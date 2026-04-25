const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000, // 10 seconds timeout
            family: 4 // Force IPv4 to avoid ENOTFOUND/timeout on some networks
        });
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        // If SRV fails, we might want to suggest checking internet/DNS
        if (error.message.includes('ENOTFOUND')) {
            console.error('Tip: This usually means a DNS issue. Try using Google DNS (8.8.8.8) or check if your firewall blocks SRV lookups.');
        }
    }
};

module.exports = connectDB;
