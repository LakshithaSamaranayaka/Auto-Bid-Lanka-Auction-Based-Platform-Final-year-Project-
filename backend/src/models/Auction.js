const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startPrice: { type: Number, required: true },
    reservePrice: { type: Number, required: true }, // Required but kept secret from buyers via API serialization
    currentHighestBid: { type: Number, default: 0 },
    highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ['upcoming', 'live', 'ended', 'cancelled'], default: 'upcoming' },
    antiSnipingExtension: { type: Number, default: 5 }, // minutes
}, { timestamps: true });

module.exports = mongoose.model('Auction', auctionSchema);
