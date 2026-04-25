const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Transaction = require('../models/Transaction');

const getAdminStats = async (req, res) => {
    try {
        // Aggregate User registrations by day (last 7 days)
        const userStats = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Aggregate Sales/Revenue by day (last 7 days)
        const salesStats = await Transaction.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$amount" },
                    platformFees: { $sum: "$platformFee" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Overall stats
        const totalUsers = await User.countDocuments();
        const totalVehicles = await Vehicle.countDocuments();
        const liveVehicles = await Vehicle.countDocuments({ status: 'live' });
        
        const profitAgg = await Transaction.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: "$platformFee" } } }
        ]);
        const totalProfit = profitAgg[0]?.total || 0;

        res.json({
            success: true,
            userGrowth: userStats,
            salesGrowth: salesStats,
            overview: {
                totalUsers,
                totalVehicles,
                liveVehicles,
                totalProfit
            }
        });
    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch stats" });
    }
};

module.exports = { getAdminStats };
