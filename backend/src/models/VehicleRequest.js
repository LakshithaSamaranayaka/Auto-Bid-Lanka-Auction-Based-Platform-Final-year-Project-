const mongoose = require('mongoose');

const vehicleRequestSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    specs: {
        condition: { type: String, enum: ['new', 'excellent', 'good', 'fair'], required: true },
        hybridType: { type: String, enum: ['MHEV', 'HEV', 'PHEV'] },
        transmission: { type: String, enum: ['Auto', 'Manual'], default: 'Auto' },
        fuelType: { type: String, default: 'Hybrid' },
        bodyType: { type: String },
        engineCC: { type: Number }
    },
    maxPrice: { type: Number },
    status: { type: String, enum: ['pending', 'matched', 'completed', 'cancelled'], default: 'pending' },
    matchedVehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }
}, { timestamps: true });

module.exports = mongoose.model('VehicleRequest', vehicleRequestSchema);
