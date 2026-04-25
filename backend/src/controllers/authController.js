const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { verifyDocumentAI } = require('./aiController');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'buyer'
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                kycStatus: user.kycStatus,
                bankStatus: user.bankStatus,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                kycStatus: user.kycStatus,
                bankStatus: user.bankStatus,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const uploadKycDocs = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Please upload a document' });
        }

        const documents = req.files.map(file => ({
            documentUrl: `/uploads/kyc/${file.filename}`,
            documentType: 'document' // Simplification
        }));

        const user = await User.findById(req.user.id);
        user.kycDocuments.push(...documents);
        user.kycStatus = 'pending';

        // Trigger AI Verification for the first document as a sample
        if (documents.length > 0) {
            const aiResult = await verifyDocumentAI(documents[0].documentUrl, user.name);
            user.aiKycData = {
                extractedName: aiResult.extractedName,
                extractedDob: aiResult.extractedDob,
                extractedId: aiResult.extractedId,
                verificationStatus: aiResult.status || 'unclear'
            };
        }

        await user.save();

        res.status(200).json({ 
            message: 'KYC documents uploaded. AI processing complete.', 
            user,
            aiExtracted: user.aiKycData 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getPendingKycUsers = async (req, res) => {
    try {
        const users = await User.find({ kycStatus: 'pending' }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateKycStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.kycStatus = status;
        await user.save();
        res.json({ message: `KYC ${status}` });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password')
            .populate({
                path: 'watchlist',
                populate: { path: 'seller', select: 'name' }
            });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getWatchlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate({
                path: 'watchlist',
                populate: { path: 'seller', select: 'name' }
            });
        res.json(user.watchlist);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const uploadBankDetails = async (req, res) => {
    try {
        const { accountName, accountNumber, bankName, branchName } = req.body;

        if (!accountName || !accountNumber || !bankName || !branchName) {
            return res.status(400).json({ message: 'All bank details are required' });
        }

        const user = await User.findById(req.user.id);
        user.bankDetails = { accountName, accountNumber, bankName, branchName };
        user.bankStatus = 'pending';
        await user.save();

        res.status(200).json({ message: 'Bank details submitted, pending approval', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getPendingBankUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'seller', bankStatus: 'pending' }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateBankStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.bankStatus = status;
        await user.save();
        res.json({ message: `Bank status ${status}` });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const toggleWatchlist = async (req, res) => {
    try {
        const { vehicleId } = req.body;
        const user = await User.findById(req.user.id);

        const index = user.watchlist.indexOf(vehicleId);
        if (index === -1) {
            user.watchlist.push(vehicleId);
            await user.save();
            res.json({ message: "Added to watchlist", watchlist: user.watchlist });
        } else {
            user.watchlist.splice(index, 1);
            await user.save();
            res.json({ message: "Removed from watchlist", watchlist: user.watchlist });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const toggleUserStatus = async (req, res) => {
    try {
        if (req.params.id === req.user.id) {
            return res.status(400).json({ message: 'You cannot suspend your own admin account.' });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { isBlocked: !user.isBlocked },
            { new: true }
        );
        
        res.json({ 
            message: `User ${updatedUser.isBlocked ? 'suspended' : 'restored'} successfully`, 
            isBlocked: updatedUser.isBlocked 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: 'There is no user with that email' });
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password reset token',
                message,
                html: `<p>You are receiving this email because you (or someone else) has requested the reset of a password. Please click the link below to reset your password:</p><a href="${resetUrl}" style="background-color: #f97316; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>`
            });

            res.status(200).json({ status: 'success', data: 'Email sent' });
        } catch (err) {
            console.log(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        // Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            status: 'success',
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword, uploadKycDocs, getPendingKycUsers, updateKycStatus, getMe, getWatchlist, uploadBankDetails, getPendingBankUsers, updateBankStatus, toggleWatchlist, getAllUsers, toggleUserStatus };
