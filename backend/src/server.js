const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const setupBiddingSocket = require('./sockets/biddingSocket');
const startAuctionMonitor = require('./utils/auctionMonitor');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: '*', // To be restricted in production
        methods: ['GET', 'POST']
    }
});

// Connect to Databases and start server
const startServer = async () => {
    try {
        await connectDB();
        
        try {
            await connectRedis();
            console.log('Redis Connected Successfully');
        } catch (redisError) {
            console.error('Redis connection failed. Some features may be unavailable:', redisError.message);
        }

        setupBiddingSocket(io);
        startAuctionMonitor();

        server.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
