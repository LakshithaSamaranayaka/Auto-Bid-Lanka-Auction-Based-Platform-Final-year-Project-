const mongoose = require('mongoose');
const Vehicle = require('./src/models/Vehicle');
const Auction = require('./src/models/Auction');
const Bid = require('./src/models/Bid');

async function test() {
    try {
        await mongoose.connect('mongodb://localhost:27017/autobid'); // Adjust if needed
        console.log("Connected");
        const vehicles = await Vehicle.find({}).limit(1);
        if (vehicles.length > 0) {
            const v = vehicles[0];
            console.log("Vehicle:", v._id);
            const auction = await Auction.findOne({ vehicle: v._id });
            console.log("Auction found:", !!auction);
            if (auction) {
                const bids = await Bid.find({ auction: auction._id })
                    .populate('bidder', 'name email')
                    .sort({ amount: -1 });
                console.log("Bids found:", bids.length);
            }
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

test();
