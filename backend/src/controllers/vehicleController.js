const Vehicle = require('../models/Vehicle');
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const Transaction = require('../models/Transaction');
const VehicleRequest = require('../models/VehicleRequest');
const User = require('../models/User');

const matchVehicleWithRequests = async (vehicle) => {
    // Build the base query - only make, model, year are REQUIRED for a match
    // Specs (condition, transmission, fuelType) are optional preferences
    const baseQuery = {
        status: 'pending',
        make: { $regex: new RegExp(`^${vehicle.make}$`, 'i') },
        model: { $regex: new RegExp(`^${vehicle.model}$`, 'i') },
        year: vehicle.year,
        $or: [
            { maxPrice: { $exists: false } },
            { maxPrice: null },
            { maxPrice: { $gte: vehicle.directBuyPrice || 0 } }
        ]
    };

    // Try exact spec match first (best match)
    let match = await VehicleRequest.findOne({
        ...baseQuery,
        'specs.condition':    vehicle.specs.condition,
        'specs.transmission': vehicle.specs.transmission,
        'specs.fuelType':     vehicle.specs.fuelType,
    });

    // Fallback: partial spec match (fuelType + transmission only)
    if (!match) {
        match = await VehicleRequest.findOne({
            ...baseQuery,
            'specs.transmission': vehicle.specs.transmission,
            'specs.fuelType':     vehicle.specs.fuelType,
        });
    }

    // Fallback: fuelType only
    if (!match) {
        match = await VehicleRequest.findOne({
            ...baseQuery,
            'specs.fuelType': vehicle.specs.fuelType,
        });
    }

    // Final fallback: make/model/year/budget only (broadest match)
    if (!match) {
        match = await VehicleRequest.findOne(baseQuery);
    }

    if (match) {
        // Auto-assign vehicle to matched buyer
        vehicle.status = 'sold';
        vehicle.buyer = match.buyer;
        await vehicle.save();

        match.status = 'matched';
        match.matchedVehicle = vehicle._id;
        await match.save();

        // Cancel any open auction for this vehicle (bypass bidding process)
        await Auction.findOneAndUpdate(
            { vehicle: vehicle._id, status: { $in: ['live', 'upcoming'] } },
            { status: 'cancelled' }
        );

        // Auto-create transaction
        const amount = vehicle.directBuyPrice || 0;
        const commission = Math.round(amount * 0.025); // 2.5% platform fee
        await Transaction.create({
            vehicle:         vehicle._id,
            buyer:           match.buyer,
            seller:          vehicle.seller,
            saleType:        'direct_buy',
            totalAmount:     amount,
            commissionAmount: commission,
            sellerPayout:    amount - commission,
            status:          'pending_escrow'
        });

        console.log(`✅ Vehicle matched: ${vehicle.make} ${vehicle.model} → Buyer: ${match.buyer}`);
        return { matched: true, buyerId: match.buyer };
    }

    return { matched: false };
};

const createVehicle = async (req, res) => {
    try {
        const { make, model, year, vin, specs, images, listingType, directBuyPrice, auctionConfig } = req.body;

        const vehicle = await Vehicle.create({
            seller: req.user._id,
            make,
            model,
            year,
            vin,
            specs,
            images,
            listingType,
            directBuyPrice: listingType !== 'auction' ? directBuyPrice : undefined
        });

        if (listingType === 'auction' || listingType === 'both') {
            if (!auctionConfig) return res.status(400).json({ message: "Auction configuration required" });

            const auction = await Auction.create({
                vehicle: vehicle._id,
                seller: req.user._id,
                startPrice: auctionConfig.startPrice,
                reservePrice: auctionConfig.reservePrice,
                startTime: new Date(auctionConfig.startTime),
                endTime: new Date(auctionConfig.endTime)
            });
            // Optionally link auction back to vehicle if your schema was two-way
        }

        res.status(201).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getAllVehicles = async (req, res) => {
    try {
        const { make, bodyType, fuelType, minPrice, maxPrice } = req.query;
        let query = { status: 'live' };

        if (make) query.make = new RegExp(make, 'i');
        if (bodyType) query['specs.bodyType'] = bodyType;
        if (fuelType) query['specs.fuelType'] = fuelType;
        
        if (minPrice || maxPrice) {
            query.directBuyPrice = {};
            if (minPrice) query.directBuyPrice.$gte = Number(minPrice);
            if (maxPrice) query.directBuyPrice.$lte = Number(maxPrice);
        }

        const vehicles = await Vehicle.find(query).populate('seller', 'name');
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getAuctionVehicles = async (req, res) => {
    try {
        const { bodyType, fuelType, minPrice, maxPrice } = req.query;
        let vehicleQuery = {};

        if (bodyType) vehicleQuery['specs.bodyType'] = bodyType;
        if (fuelType) vehicleQuery['specs.fuelType'] = fuelType;

        const auctions = await Auction.find({ status: { $in: ['live', 'upcoming'] } })
            .populate({
                path: 'vehicle',
                match: vehicleQuery
            })
            .populate('seller', 'name');

        // Filter out auctions where vehicle didn't match the populate match
        let filteredAuctions = auctions.filter(a => a.vehicle !== null);

        if (minPrice || maxPrice) {
            filteredAuctions = filteredAuctions.filter(a => {
                const price = a.currentHighestBid || a.startPrice;
                if (minPrice && price < Number(minPrice)) return false;
                if (maxPrice && price > Number(maxPrice)) return false;
                return true;
            });
        }

        res.json(filteredAuctions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getDirectBuyVehicles = async (req, res) => {
    try {
        const { bodyType, fuelType, minPrice, maxPrice } = req.query;
        let query = { 
            listingType: { $in: ['direct_buy', 'both'] },
            status: 'live'
        };

        if (bodyType) query['specs.bodyType'] = bodyType;
        if (fuelType) query['specs.fuelType'] = fuelType;
        
        if (minPrice || maxPrice) {
            query.directBuyPrice = {};
            if (minPrice) query.directBuyPrice.$gte = Number(minPrice);
            if (maxPrice) query.directBuyPrice.$lte = Number(maxPrice);
        }

        const vehicles = await Vehicle.find(query).populate('seller', 'name');
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id).populate('seller', 'name');

        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        let auctionData = null;
        let bidHistory = [];
        if (vehicle.listingType === 'auction' || vehicle.listingType === 'both') {
            auctionData = await Auction.findOne({ vehicle: vehicle._id });
            if (auctionData) {
                bidHistory = await Bid.find({ auction: auctionData._id })
                    .populate('bidder', 'name')
                    .sort({ createdAt: -1 })
                    .limit(10); // Show last 10 bids
            }
        }

        res.json({ vehicle, auctionData, bidHistory });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


const getPendingVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ status: 'pending_approval' }).populate('seller', 'name email');
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getMyVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ seller: req.user._id }).sort({ createdAt: -1 }).lean();
        
        // Populate auction data and bids
        const result = await Promise.all(vehicles.map(async (v) => {
            const auction = await Auction.findOne({ vehicle: v._id }).lean();
            let bids = [];
            if (auction) {
                bids = await Bid.find({ auction: auction._id })
                    .sort({ amount: -1 })
                    .lean();
            }
            return { ...v, auction, bids };
        }));

        res.json(result);
    } catch (error) {
        console.error("getMyVehicles error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const acceptBid = async (req, res) => {
    try {
        const { bidId } = req.body;
        const auction = await Auction.findById(req.params.auctionId).populate('vehicle');
        
        if (!auction) return res.status(404).json({ message: 'Auction not found' });
        if (auction.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized: You do not own this listing.' });
        }

        const bid = await Bid.findById(bidId);
        if (!bid) return res.status(404).json({ message: 'Bid not found' });

        // 1. End Auction early and set this bid as winner
        auction.status = 'ended';
        auction.highestBidder = bid.bidder;
        auction.currentHighestBid = bid.amount;
        await auction.save();

        // 2. Create Transaction (Pending Escrow)
        const COMMISSION_RATE = 0.05;
        const amount = bid.amount;
        const commissionAmount = amount * COMMISSION_RATE;
        const sellerPayout = amount - commissionAmount;

        await Transaction.create({
            buyer: bid.bidder,
            seller: auction.seller,
            vehicle: auction.vehicle._id,
            auction: auction._id,
            saleType: 'auction',
            totalAmount: amount,
            commissionPercentage: COMMISSION_RATE * 100,
            commissionAmount: commissionAmount,
            sellerPayout: sellerPayout,
            status: 'pending_escrow'
        });

        res.json({ message: 'Bid accepted successfully. Transaction initiated.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const approveVehicle = async (req, res) => {
    try {
        const { status } = req.body; // 'live' or 'rejected'
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        vehicle.status = status;
        await vehicle.save();

        if (status === 'live' && (vehicle.listingType === 'auction' || vehicle.listingType === 'both')) {
            await Auction.findOneAndUpdate({ vehicle: vehicle._id }, { status: 'live' });
        }

        let matchResult = null;
        if (status === 'live') {
            matchResult = await matchVehicleWithRequests(vehicle);
        }

        res.json({ 
            message: `Vehicle ${status}`, 
            matched: matchResult ? matchResult.matched : false,
            buyerId: matchResult ? matchResult.buyerId : null
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const closeAuctionEarly = async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id);
        if (!auction) return res.status(404).json({ message: 'Auction not found' });

        // Ensure only the seller can close it
        if (auction.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized. Only the seller can close this auction.' });
        }

        if (auction.status !== 'live') {
            return res.status(400).json({ message: `Auction cannot be closed. Current status: ${auction.status}` });
        }

        auction.status = 'ended';
        auction.endTime = new Date(); // Mark as ended now
        await auction.save();

        res.json({ message: 'Auction closed early successfully.', auction });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createVehicle,
    getAllVehicles,
    getAuctionVehicles,
    getDirectBuyVehicles,
    getVehicleById,
    getPendingVehicles,
    approveVehicle,
    closeAuctionEarly,
    getMyVehicles,
    acceptBid
};
