const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    uploadKycDocs, 
    getPendingKycUsers, 
    updateKycStatus, 
    getMe, 
    uploadBankDetails, 
    getPendingBankUsers, 
    updateBankStatus,
    getAllUsers,
    toggleUserStatus,
    toggleWatchlist,
    getWatchlist,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { uploadKYC } = require('../middleware/uploadMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/me', protect, getMe);
router.post('/kyc', protect, uploadKYC.array('documents', 3), uploadKycDocs);
router.get('/admin/kyc-pending', protect, restrictTo('admin'), getPendingKycUsers);
router.put('/admin/kyc-approve/:id', protect, restrictTo('admin'), updateKycStatus);

router.post('/bank', protect, uploadBankDetails);
router.get('/admin/bank-pending', protect, restrictTo('admin'), getPendingBankUsers);
router.put('/admin/bank-approve/:id', protect, restrictTo('admin'), updateBankStatus);

router.get('/admin/users', protect, restrictTo('admin'), getAllUsers);
router.put('/admin/user-toggle/:id', protect, restrictTo('admin'), toggleUserStatus);

router.post('/toggle-watchlist', protect, toggleWatchlist);
router.get('/watchlist', protect, getWatchlist);

module.exports = router;
