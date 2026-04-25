const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    auction: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction' }, // Null if direct buy
    saleType: { type: String, enum: ['auction', 'direct_buy'], required: true },
    totalAmount: { type: Number, required: true },
    commissionPercentage: { type: Number, default: 2.5 },
    commissionAmount: { type: Number, required: true },
    sellerPayout: { type: Number, required: true }, // totalAmount - commissionAmount
    status: { type: String, enum: ['pending_escrow', 'escrow_funded', 'completed', 'disputed', 'refunded'], default: 'pending_escrow' },
    paymentGatewayRef: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
