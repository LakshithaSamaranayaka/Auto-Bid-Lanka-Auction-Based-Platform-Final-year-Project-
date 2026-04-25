const express = require('express');
const router = express.Router();
const { createReview, getUserReviews, getLatestReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/latest', getLatestReviews);
router.get('/user/:userId', getUserReviews);

module.exports = router;
