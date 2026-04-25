const Review = require('../models/Review');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

const createReview = async (req, res) => {
    try {
        const { transactionId, rating, comment, targetId } = req.body;
        const reviewerId = req.user._id;

        // Verify the transaction exists and is completed
        const transaction = await Transaction.findById(transactionId);
        if (!transaction || transaction.status !== 'completed') {
            return res.status(400).json({ message: "You can only review completed transactions." });
        }

        // Determine reviewer role and target
        let reviewerRole;
        let finalTargetId = targetId;

        if (transaction.buyer.toString() === reviewerId.toString()) {
            reviewerRole = 'buyer';
            if (!finalTargetId) finalTargetId = transaction.seller;
        } else if (transaction.seller.toString() === reviewerId.toString()) {
            reviewerRole = 'seller';
            if (!finalTargetId) finalTargetId = transaction.buyer;
        } else {
            return res.status(403).json({ message: "You are not part of this transaction." });
        }

        const review = await Review.create({
            reviewer: reviewerId,
            target: finalTargetId,
            transaction: transactionId,
            rating,
            comment,
            reviewerRole
        });

        res.status(201).json(review);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "You have already reviewed this transaction." });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ target: req.params.userId })
            .populate('reviewer', 'name')
            .sort('-createdAt');

        // Calculate average rating
        const stats = await Review.aggregate([
            { $match: { target: new require('mongoose').Types.ObjectId(req.params.userId) } },
            { $group: { _id: null, averageRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } }
        ]);

        res.json({
            reviews,
            stats: stats.length > 0 ? stats[0] : { averageRating: 0, totalReviews: 0 }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getLatestReviews = async (req, res) => {
    try {
        const reviews = await Review.find({})
            .populate('reviewer', 'name')
            .populate({
                path: 'transaction',
                populate: { path: 'vehicle', select: 'make model' }
            })
            .sort('-createdAt')
            .limit(6);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { createReview, getUserReviews, getLatestReviews };
