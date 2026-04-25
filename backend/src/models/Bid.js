const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    auction: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction', required: true },
    bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    isProxyBid: { type: Boolean, default: false },
    maxProxyAmount: { type: Number }, // Hidden field for system to auto-bid up to limit
    status: { type: String, enum: ['accepted', 'outbid', 'withdrawn'], default: 'accepted' }
}, { timestamps: true });

module.exports = mongoose.model('Bid', bidSchema);
