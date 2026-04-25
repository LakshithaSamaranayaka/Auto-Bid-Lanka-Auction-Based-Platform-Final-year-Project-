const VehicleRequest = require('../models/VehicleRequest');
const Vehicle = require('../models/Vehicle');

const createRequest = async (req, res) => {
    try {
        const { make, model, year, specs, maxPrice } = req.body;
        
        const vehicleRequest = await VehicleRequest.create({
            buyer: req.user._id,
            make,
            model,
            year,
            specs,
            maxPrice
        });

        res.status(201).json(vehicleRequest);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getMyRequests = async (req, res) => {
    try {
        const requests = await VehicleRequest.find({ buyer: req.user._id }).populate('matchedVehicle');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const deleteRequest = async (req, res) => {
    try {
        const request = await VehicleRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });
        
        if (request.buyer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await request.deleteOne();
        res.json({ message: 'Request removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createRequest,
    getMyRequests,
    deleteRequest
};
