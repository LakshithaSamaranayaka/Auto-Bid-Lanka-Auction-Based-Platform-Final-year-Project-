const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/', protect, restrictTo('seller', 'admin'), vehicleController.createVehicle);
router.get('/', vehicleController.getAllVehicles);
router.get('/auction', vehicleController.getAuctionVehicles);
router.get('/direct', vehicleController.getDirectBuyVehicles);
router.get('/admin/pending', protect, restrictTo('admin'), vehicleController.getPendingVehicles);
router.get('/my-listings', protect, vehicleController.getMyVehicles);
router.get('/:id', vehicleController.getVehicleById);

router.put('/admin/approve/:id', protect, restrictTo('admin'), vehicleController.approveVehicle);
router.put('/auction-close/:id', protect, vehicleController.closeAuctionEarly);
router.post('/accept-bid/:auctionId', protect, vehicleController.acceptBid);

module.exports = router;
