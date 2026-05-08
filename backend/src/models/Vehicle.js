const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    vin: { type: String, required: true, unique: true },
    specs: {
        mileage: Number,
        condition: { type: String, enum: ['new', 'excellent', 'good', 'fair'], required: true },
        hybridType: { type: String, enum: ['MHEV', 'HEV', 'PHEV'] },
        transmission: { type: String, enum: ['Auto', 'Manual'], default: 'Auto' },
        fuelType: { type: String, default: 'Hybrid' },
        bodyType: { type: String },
        engineCC: { type: Number },
        description: { type: String },
        history: { type: String },
        accidentRecords: { type: String }
    },
    images: [{ type: String }],
    listingType: { type: String, enum: ['auction', 'direct_buy', 'both'], required: true },
    status: { type: String, enum: ['pending_approval', 'live', 'rejected', 'sold', 'unsold', 'cancelled'], default: 'pending_approval' },
    directBuyPrice: { type: Number }, // Required if direct_buy
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Added to track who bought it
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
