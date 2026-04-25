const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed
  role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
  kycStatus: { type: String, enum: ['pending', 'approved', 'rejected', 'none'], default: 'none' },
  kycDocuments: [{
    documentUrl: { type: String }, // e.g., AWS S3 URL
    documentType: { type: String } // e.g., 'NIC', 'Passport'
  }],
  wallet: {
    balance: { type: Number, default: 0 },
    escrowBalance: { type: Number, default: 0 } // Locked funds for active bids
  },
  bankStatus: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
  bankDetails: {
    accountName: { type: String },
    accountNumber: { type: String },
    bankName: { type: String },
    branchName: { type: String }
  },
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }],
  isBlocked: { type: Boolean, default: false },
  aiKycData: {
    extractedName: String,
    extractedDob: String,
    extractedId: String,
    verificationStatus: { type: String, enum: ['match', 'mismatch', 'unclear', 'none'], default: 'none' }
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { timestamps: true });

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function() {
  const crypto = require('crypto');
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
