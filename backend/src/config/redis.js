const { createClient } = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
        connectTimeout: 5000,
        reconnectStrategy: (retries) => {
            if (retries > 1) {
                // If we can't connect after 1 retry, stop trying to avoid spamming.
                // The application will use MongoDB fallbacks.
                return false; 
            }
            return 1000;
        }
    }
});

redisClient.on('error', (err) => {
    // Suppress spamming logs if it's just a connection refused error
    if (err.code !== 'ECONNREFUSED') {
        console.log('Redis Client Error', err);
    }
});

redisClient.on('connect', () => console.log('Redis Connected Successfully'));

const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        // Error will be caught in server.js
        throw err;
    }
};

module.exports = { redisClient, connectRedis };
