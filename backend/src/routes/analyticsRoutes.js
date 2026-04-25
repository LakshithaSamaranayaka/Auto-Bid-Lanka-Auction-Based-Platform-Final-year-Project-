const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/analyticsController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/admin/stats', protect, restrictTo('admin'), getAdminStats);

module.exports = router;
