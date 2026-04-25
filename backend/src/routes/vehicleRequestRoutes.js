const express = require('express');
const router = express.Router();
const vehicleRequestController = require('../controllers/vehicleRequestController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/', protect, restrictTo('buyer'), vehicleRequestController.createRequest);
router.get('/my-requests', protect, restrictTo('buyer'), vehicleRequestController.getMyRequests);
router.delete('/:id', protect, restrictTo('buyer'), vehicleRequestController.deleteRequest);

module.exports = router;
