const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Route to get AI Valuation
router.post('/valuation', protect, aiController.getValuation);

// Route to generate AI Description
router.post('/description', protect, aiController.getDescription);

module.exports = router;
