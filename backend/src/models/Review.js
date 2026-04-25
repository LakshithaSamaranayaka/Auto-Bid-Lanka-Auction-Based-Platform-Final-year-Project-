const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    target: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user being reviewed
    transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, maxLength: 500 },
    reviewerRole: { type: String, enum: ['buyer', 'seller'], required: true }
}, { timestamps: true });

// Prevent duplicate reviews for the same transaction from the same user
reviewSchema.index({ transaction: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
