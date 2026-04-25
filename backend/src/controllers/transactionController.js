const Transaction = require('../models/Transaction');
const Vehicle = require('../models/Vehicle');
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const User = require('../models/User'); 
const sendEmail = require('../utils/sendEmail');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const COMMISSION_RATE = 0.05; // 5% platform cut

// Creates a Stripe Checkout Session for the purchase
const createStripeSession = async (req, res) => {
    try {
        const { vehicleId, auctionId, amount, transactionId } = req.body;
        const buyerId = req.user._id;

        if (req.user.kycStatus !== 'approved') {
            return res.status(403).json({ message: "KYC must be approved to initiate transactions." });
        }

        let transaction;
        let vehicle;
        let targetAmount = amount;

        if (transactionId) {
            transaction = await Transaction.findById(transactionId).populate('vehicle');
            if (!transaction) return res.status(404).json({ message: "Transaction not found." });
            vehicle = transaction.vehicle;
            targetAmount = transaction.totalAmount;
        } else {
            vehicle = await Vehicle.findById(vehicleId);
            targetAmount = amount;
        }

        if (!vehicle) return res.status(404).json({ message: "Vehicle not found." });

        if (vehicle.seller.toString() === buyerId.toString()) {
            return res.status(403).json({ message: "Sellers cannot buy their own listings." });
        }

        if (!transaction) {
            // 1. Create a logical Transaction document (STATE: PENDING_ESCROW)
            const commissionAmount = targetAmount * COMMISSION_RATE;
            const sellerPayout = targetAmount - commissionAmount;

            transaction = await Transaction.create({
                buyer: buyerId,
                seller: vehicle.seller,
                vehicle: vehicle._id,
                auction: auctionId || undefined,
                saleType: auctionId ? 'auction' : 'direct_buy',
                totalAmount: targetAmount,
                commissionPercentage: COMMISSION_RATE * 100,
                commissionAmount: commissionAmount,
                sellerPayout: sellerPayout,
                status: 'pending_escrow'
            });
        }

        // 2. Create Stripe Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
                        description: `Vehicle Purchase - ${vehicle.vin}`,
                        images: vehicle.images && vehicle.images.length > 0 ? vehicle.images.filter(img => img.startsWith('http')) : []
                    },
                    unit_amount: Math.round(targetAmount * 100), // Stripe uses cents
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?payment=success&tid=${transaction._id}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?payment=cancel`,
            metadata: {
                transactionId: transaction._id.toString(),
                vehicleId: vehicle._id.toString()
            }
        });

        res.json({ id: session.id, url: session.url });

    } catch (error) {
        console.error("Stripe Session Error:", error);
        res.status(500).json({ message: 'Stripe session creation failed.', error: error.message });
    }
};

// Creates a pending escrow transaction block when user says "Buy Now" or wins
const createCheckoutSession = async (req, res) => {
    try {
        const { vehicleId, auctionId, purchaseType, amount } = req.body;
        const buyerId = req.user._id;

        if (req.user.kycStatus !== 'approved') {
            return res.status(403).json({ message: "KYC must be approved to initiate transactions." });
        }

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found." });

        if (vehicle.seller.toString() === buyerId.toString()) {
            return res.status(403).json({ message: "Sellers cannot buy their own listings." });
        }

        // Ensure it's not already sold
        if (vehicle.status === 'sold') {
            return res.status(400).json({ message: "Vehicle is already sold." });
        }

        // Mathematical breakdown of the financial flow
        const commissionAmount = amount * COMMISSION_RATE;
        const sellerPayout = amount - commissionAmount;

        // Create the logical Transaction document (STATE: PENDING_ESCROW)
        const transaction = await Transaction.create({
            buyer: buyerId,
            seller: vehicle.seller,
            vehicle: vehicleId,
            auction: auctionId || undefined,
            saleType: purchaseType || (auctionId ? 'auction' : 'direct_buy'),
            totalAmount: amount,
            commissionPercentage: COMMISSION_RATE * 100,
            commissionAmount: commissionAmount,
            sellerPayout: sellerPayout,
            status: 'pending_escrow'  // Awaiting buyer to pay Auto Lanka
        });

        res.status(201).json({
            message: "Transaction initiated. Please pay Auto Lanka to fund escrow.",
            transactionData: transaction
        });

    } catch (error) {
        res.status(500).json({ message: 'Transaction preparation failed.', error: error.message });
    }
};

// Mock function simulating payment receipt at Auto Lanka account
const fundEscrow = async (req, res) => {
    try {
        const { transactionId } = req.body;
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) return res.status(404).json({ message: "Transaction not found." });

        if (transaction.status === 'escrow_funded') {
            return res.json({ message: "Payment already processed. Funds held in Escrow.", transaction });
        }

        if (transaction.status !== 'pending_escrow') {
            return res.status(400).json({ message: "Transaction invalid for funding." });
        }

        // Simulate payment verification
        transaction.status = 'escrow_funded';
        transaction.paymentGatewayRef = `PAY-${Date.now()}`;
        await transaction.save();

        // Update Vehicle status to 'sold'
        const vehicle = await Vehicle.findById(transaction.vehicle);
        if (vehicle) {
            vehicle.status = 'sold';
            vehicle.buyer = transaction.buyer;
            await vehicle.save();
        }

        // Emails are sent in background and shouldn't crash the response if SMTP fails
        try {
            // 1. Send Email to Buyer
            const buyer = await User.findById(transaction.buyer);
            if (buyer && vehicle) {
                await sendEmail({
                    email: buyer.email,
                    subject: 'Payment Received - AutoBid Lanka Escrow',
                    html: `<h1>Payment Confirmed</h1>
                           <p>Hi ${buyer.name}, your payment for <b>${vehicle.year} ${vehicle.make} ${vehicle.model}</b> has been received.</p>
                           <p>The funds are now safely held in AutoBid Lanka Escrow. Please coordinate with the seller for vehicle handover.</p>`
                });
            }

            // 2. Send Email to Seller
            const seller = await User.findById(transaction.seller);
            if (seller && vehicle) {
                await sendEmail({
                    email: seller.email,
                    subject: 'Escrow Funded - Your Vehicle Listing',
                    html: `<h1>Good News!</h1>
                           <p>Hi ${seller.name}, the buyer has funded the escrow for your vehicle <b>${vehicle.year} ${vehicle.make} ${vehicle.model}</b>.</p>
                           <p>You can now safely proceed with the handover. Once the buyer confirms receipt, the funds will be released to your wallet.</p>`
                });
            }
        } catch (emailError) {
            console.error("Email Sending Failed (Non-critical):", emailError.message);
            // We don't fail the request because the payment itself was successful
        }

        res.json({ message: "Payment received by Auto Lanka. Funds now held in Escrow.", transaction });
    } catch (error) {
        console.error("Fund Escrow Error:", error);
        res.status(500).json({ message: 'Escrow funding failed.', error: error.message });
    }
};

// Simulated function when actual delivery & inspection finishes nicely
const confirmTransaction = async (req, res) => {
    try {
        const { transactionId } = req.body;

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) return res.status(404).json({ message: "Transaction not found." });

        if (transaction.status === 'completed') {
            return res.json({ message: "Transaction already completed.", transaction });
        }

        if (transaction.status !== 'escrow_funded') {
            return res.status(400).json({ message: "Escrow must be funded by Auto Lanka before confirmation." });
        }

        // 1. Mark transaction as completed (Escrow released)
        transaction.status = 'completed';
        await transaction.save();

        // 2. Mark vehicle as officially sold
        await Vehicle.findByIdAndUpdate(transaction.vehicle, { status: 'sold' });

        // 3. Update Seller's Wallet (Total - Commission)
        await User.findByIdAndUpdate(transaction.seller, {
            $inc: { 'wallet.balance': transaction.sellerPayout }
        });

        // 4. (Platform logic) Log commission as revenue
        console.log(`Auto Lanka earned commission: $${transaction.commissionAmount}`);

        // Emails are sent in background and shouldn't crash the response if SMTP fails
        try {
            // 1. Send Success Email to Buyer
            const buyer = await User.findById(transaction.buyer);
            const vehicle = await Vehicle.findById(transaction.vehicle);
            if (buyer && vehicle) {
                await sendEmail({
                    email: buyer.email,
                    subject: 'Transaction Completed - Welcome to your new car!',
                    html: `<h1>Congratulations!</h1>
                           <p>The transaction for <b>${vehicle.year} ${vehicle.make} ${vehicle.model}</b> is now complete.</p>
                           <p>We hope you enjoy your new vehicle. Thank you for choosing AutoBid Lanka.</p>`
                });
            }

            // 2. Send Payout Email to Seller
            const seller = await User.findById(transaction.seller);
            if (seller && vehicle) {
                await sendEmail({
                    email: seller.email,
                    subject: 'Funds Released - AutoBid Lanka',
                    html: `<h1>Funds Released</h1>
                           <p>The buyer has confirmed receipt of <b>${vehicle.year} ${vehicle.make} ${vehicle.model}</b>.</p>
                           <p><b>$${transaction.sellerPayout.toLocaleString()}</b> has been added to your AutoBid wallet balance.</p>`
                });
            }
        } catch (emailError) {
            console.error("Completion Email Failed (Non-critical):", emailError.message);
        }

        res.json({ message: "Vehicle successfully transferred. Auto Lanka has released escrow funds to Seller minus commission.", transaction });

    } catch (error) {
        console.error("Confirm Transaction Error:", error);
        res.status(500).json({ message: 'Transaction confirmation failed.', error: error.message });
    }
};

// Admin Endpoint to track platform profits!
const getPlatformRevenues = async (req, res) => {
    try {
        // Aggregate all completed transactions to get total site profit
        const stats = await Transaction.aggregate([
            { $match: { status: 'completed' } },
            {
                $group: {
                    _id: null,
                    totalVolume: { $sum: "$totalAmount" },
                    totalPlatformProfit: { $sum: "$commissionAmount" },
                    successfulSales: { $sum: 1 }
                }
            }
        ]);

        const userCount = await User.countDocuments();
        const activeVehiclesCount = await Vehicle.countDocuments({ status: 'live' });

        const revenueData = stats.length > 0 ? stats[0] : { totalVolume: 0, totalPlatformProfit: 0, successfulSales: 0 };
        revenueData.userCount = userCount;
        revenueData.activeVehiclesCount = activeVehiclesCount;

        res.json(revenueData);

    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve analytics', error: error.message });
    }
}

const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({})
            .populate('buyer', 'name email')
            .populate('seller', 'name email')
            .populate('vehicle', 'make model year')
            .sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
    }
};

const getAnalyticsData = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // 1. Daily Sales Volume
        const salesData = await Transaction.aggregate([
            { $match: { status: 'completed', createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    amount: { $sum: "$totalAmount" },
                    profit: { $sum: "$commissionAmount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 2. Daily New Users
        const userData = await User.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 3. Category Breakdown (Body Type) from Sold Vehicles
        const categoryData = await Transaction.aggregate([
            { $match: { status: 'completed' } },
            {
                $lookup: {
                    from: 'vehicles',
                    localField: 'vehicle',
                    foreignField: '_id',
                    as: 'vehicleInfo'
                }
            },
            { $unwind: "$vehicleInfo" },
            {
                $group: {
                    _id: "$vehicleInfo.specs.bodyType",
                    value: { $sum: 1 }
                }
            }
        ]);

        res.json({
            salesTimeline: salesData,
            userTimeline: userData,
            categoryStats: categoryData
        });

    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve analytics', error: error.message });
    }
};

const getSellerAnalytics = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // 1. Daily Earnings (Seller Payouts)
        const earningsData = await Transaction.aggregate([
            { 
                $match: { 
                    seller: sellerId, 
                    status: 'completed', 
                    createdAt: { $gte: thirtyDaysAgo } 
                } 
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    amount: { $sum: "$sellerPayout" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 2. Listing Status Breakdown
        const vehicleStats = await Vehicle.aggregate([
            { $match: { seller: sellerId } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // 3. Overall Totals
        const totalVehicles = await Vehicle.countDocuments({ seller: sellerId });
        const totalEarningsAgg = await Transaction.aggregate([
            { $match: { seller: sellerId, status: 'completed' } },
            { $group: { _id: null, total: { $sum: "$sellerPayout" } } }
        ]);
        const totalEarnings = totalEarningsAgg[0]?.total || 0;

        res.json({
            earningsTimeline: earningsData,
            listingStats: vehicleStats,
            summary: {
                totalVehicles,
                totalEarnings
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch seller analytics', error: error.message });
    }
};

const getBuyerAnalytics = async (req, res) => {
    try {
        const buyerId = req.user._id;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // 1. Spending Timeline
        const spendingData = await Transaction.aggregate([
            { 
                $match: { 
                    buyer: buyerId, 
                    status: 'completed', 
                    createdAt: { $gte: thirtyDaysAgo } 
                } 
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    amount: { $sum: "$totalAmount" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 2. Interest by Category (based on transactions)
        const interestData = await Transaction.aggregate([
            { $match: { buyer: buyerId, status: 'completed' } },
            {
                $lookup: {
                    from: 'vehicles',
                    localField: 'vehicle',
                    foreignField: '_id',
                    as: 'vehicleInfo'
                }
            },
            { $unwind: "$vehicleInfo" },
            {
                $group: {
                    _id: "$vehicleInfo.specs.bodyType",
                    count: { $sum: 1 }
                }
            }
        ]);

        // 3. Totals
        const totalSpentAgg = await Transaction.aggregate([
            { $match: { buyer: buyerId, status: 'completed' } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        
        const totalVehicles = await Transaction.countDocuments({ buyer: buyerId, status: 'completed' });

        res.json({
            spendingTimeline: spendingData,
            interests: interestData,
            summary: {
                totalSpent: totalSpentAgg[0]?.total || 0,
                totalVehicles
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch buyer analytics', error: error.message });
    }
};

const getMyActiveBids = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Find all auctions this user has bid on (using Bid model)
        const myBids = await Bid.find({ bidder: userId }).distinct('auction');
        
        const auctions = await Auction.find({ _id: { $in: myBids } })
            .populate('vehicle')
            .sort({ endTime: -1 });

        const result = {
            won: [],
            leading: [],
            outbid: []
        };

        for (const auction of auctions) {
            const isWinner = auction.highestBidder && auction.highestBidder.toString() === userId.toString();
            
            if (auction.status === 'ended') {
                if (isWinner) {
                    const transactionExists = await Transaction.findOne({ auction: auction._id });
                    if (!transactionExists && auction.currentHighestBid >= auction.reservePrice) {
                        result.won.push(auction);
                    }
                } else {
                    result.outbid.push(auction);
                }
            } else if (auction.status === 'live') {
                if (isWinner) {
                    result.leading.push(auction);
                } else {
                    result.outbid.push(auction);
                }
            }
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch active bids', error: error.message });
    }
};

const getMyPurchases = async (req, res) => {
    try {
        const transactions = await Transaction.find({ buyer: req.user._id })
            .populate('vehicle')
            .populate('seller', 'name email')
            .sort({ createdAt: -1 });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch purchases', error: error.message });
    }
};

const walletDepositSession = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user._id;

        if (amount < 1) { // Min 1 unit
            return res.status(400).json({ message: "Minimum deposit is 1 unit" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: "Wallet Deposit - AutoBid Lanka",
                        description: "Add funds to your secure wallet",
                    },
                    unit_amount: Math.round(amount * 100),
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?deposit=success&amt=${amount}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?deposit=cancel`,
            metadata: {
                userId: userId.toString(),
                type: 'deposit'
            }
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error("Deposit Session Error:", error);
        res.status(500).json({ message: 'Deposit session failed.', error: error.message });
    }
};

const confirmDeposit = async (req, res) => {
    try {
        const { amount } = req.body;
        const user = await User.findById(req.user._id);
        
        user.wallet.balance += Number(amount);
        await user.save();
        
        res.json({ message: "Deposit confirmed!", balance: user.wallet.balance });
    } catch (error) {
        res.status(500).json({ message: "Failed to confirm deposit" });
    }
};

const withdrawFunds = async (req, res) => {
    try {
        const { amount } = req.body;
        const user = await User.findById(req.user._id);

        if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });
        if (user.wallet.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        user.wallet.balance -= Number(amount);
        await user.save();

        res.json({ message: "Withdrawal successful. Funds will be sent to your bank account.", balance: user.wallet.balance });
    } catch (error) {
        res.status(500).json({ message: 'Withdrawal failed.', error: error.message });
    }
};

module.exports = {
    createStripeSession,
    createCheckoutSession,
    fundEscrow,
    confirmTransaction,
    getPlatformRevenues,
    getAllTransactions,
    getAnalyticsData,
    getSellerAnalytics,
    getBuyerAnalytics,
    getMyPurchases,
    getMyActiveBids,
    walletDepositSession,
    confirmDeposit,
    withdrawFunds
};
