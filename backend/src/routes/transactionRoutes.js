const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Only logged in and KYC approved users can interact with transactions
router.post('/stripe-checkout', protect, transactionController.createStripeSession);
router.post('/checkout', protect, transactionController.createCheckoutSession);
router.post('/fund', protect, transactionController.fundEscrow); // Simulated Auto Lanka receiving funds
router.post('/confirm', protect, transactionController.confirmTransaction);

// Admins can view platform revenue logic
router.get('/admin/revenues', protect, restrictTo('admin'), transactionController.getPlatformRevenues);
router.get('/admin/analytics', protect, restrictTo('admin'), transactionController.getAnalyticsData);
router.get('/admin/all', protect, restrictTo('admin'), transactionController.getAllTransactions);

// User specific transactions
router.get('/my-purchases', protect, transactionController.getMyPurchases);
router.get('/my-active-bids', protect, transactionController.getMyActiveBids);
router.get('/seller/analytics', protect, restrictTo('seller', 'admin'), transactionController.getSellerAnalytics);
router.get('/buyer/analytics', protect, transactionController.getBuyerAnalytics);

// Wallet interactions
router.post('/deposit-session', protect, transactionController.walletDepositSession);
router.post('/confirm-deposit', protect, transactionController.confirmDeposit);
router.post('/withdraw', protect, transactionController.withdrawFunds);

module.exports = router;
