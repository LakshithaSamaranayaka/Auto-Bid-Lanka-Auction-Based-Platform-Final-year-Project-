const { redisClient } = require('../config/redis');
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const User = require('../models/User');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected to Socket.IO: ${socket.id}`);

        // Join Auction Room
        socket.on('joinAuction', async (auctionId) => {
            socket.join(auctionId);
            console.log(`Socket ${socket.id} joined auction ${auctionId}`);

            try {
                let highestBidData = null;

                // Check Redis first
                if (redisClient.isOpen) {
                    const highestBidStr = await redisClient.get(`auction:${auctionId}:highestBid`);
                    if (highestBidStr) {
                        highestBidData = JSON.parse(highestBidStr);
                    }
                }

                // Fallback to MongoDB if Redis is down or no data in Redis
                if (!highestBidData) {
                    const auction = await Auction.findById(auctionId);
                    if (auction && auction.currentHighestBid > 0) {
                        highestBidData = {
                            amount: auction.currentHighestBid,
                            userId: auction.highestBidder,
                            timestamp: auction.updatedAt
                        };
                    }
                }

                if (highestBidData) {
                    socket.emit('bidUpdate', highestBidData);
                }
            } catch (err) {
                console.error('Fetch highest bid error', err);
            }
        });

        // Handle New Bid
        socket.on('placeBid', async (data) => {
            const { auctionId, userId, amount } = data;

            try {
                // Verify KYC Status
                const user = await User.findById(userId);
                if (!user || user.kycStatus !== 'approved') {
                    socket.emit('bidError', { message: 'Your KYC must be approved by the admin before placing bids.' });
                    return;
                }

                let currentHighest = 0;
                const auction = await Auction.findById(auctionId);

                if (!auction || auction.status !== 'live') {
                    socket.emit('bidError', { message: 'Auction is not live or has already ended.' });
                    return;
                }

                // SECURITY CHECK: Seller cannot bid on their own auction
                if (auction.seller.toString() === userId.toString()) {
                    socket.emit('bidError', { message: 'You cannot placement bids on your own auction.' });
                    return;
                }

                // Check if auction end time has passed (redundancy)
                if (new Date() > new Date(auction.endTime)) {
                    if (auction.status === 'live') {
                        auction.status = 'ended';
                        await auction.save();
                    }
                    socket.emit('bidError', { message: 'Auction has already ended.' });
                    return;
                }

                // Get current highest bid from Redis if available
                if (redisClient.isOpen) {
                    const highestBidStr = await redisClient.get(`auction:${auctionId}:highestBid`);
                    currentHighest = highestBidStr ? JSON.parse(highestBidStr).amount : (auction ? auction.currentHighestBid : 0);
                } else {
                    currentHighest = auction ? auction.currentHighestBid : 0 ;
                }

                // MINIMUM BID INCREMENT (Prevent tiny bids like +$1)
                const MIN_INCREMENT = 50; // Could be dynamic based on starting price
                if (amount < currentHighest + MIN_INCREMENT) {
                    socket.emit('bidError', { message: `Bid must be at least $${MIN_INCREMENT} higher than the current bid.` });
                    return;
                }

                if (amount > currentHighest) {
                    const previousBidder = auction.highestBidder;
                    const newBidData = { 
                        amount, 
                        userId, 
                        timestamp: Date.now(),
                        newEndTime: auction.endTime // Placeholder for sniper extension
                    };

                    // ---- ANTI-SNIPING LOGIC (AUCTION EXTENSION) ----
                    // If a bid is placed in the last 2 minutes, extend by 5 minutes
                    const now = new Date();
                    const endTime = new Date(auction.endTime);
                    const diffMs = endTime - now;
                    const sniperThreshold = 2 * 60 * 1000; // 2 minutes

                    if (diffMs > 0 && diffMs < sniperThreshold) {
                        const extensionMs = auction.antiSnipingExtension * 60 * 1000;
                        const extendedEndTime = new Date(endTime.getTime() + extensionMs);
                        auction.endTime = extendedEndTime;
                        newBidData.newEndTime = extendedEndTime.toISOString();
                        
                        console.log(`Auction ${auctionId} extended due to sniping prevention. New End: ${extendedEndTime}`);
                    }
                    // ------------------------------------------------

                    // Save to Redis if available
                    if (redisClient.isOpen) {
                        await redisClient.set(`auction:${auctionId}:highestBid`, JSON.stringify(newBidData));
                        await redisClient.lPush(`auction:${auctionId}:bids`, JSON.stringify(newBidData));
                        await redisClient.lTrim(`auction:${auctionId}:bids`, 0, 49);
                    }

                    // Broadcast to everyone in the room
                    io.to(auctionId).emit('bidUpdate', newBidData);

                    // Notify the previous bidder they've been outbid
                    if (previousBidder && previousBidder.toString() !== userId.toString()) {
                        io.to(auctionId).emit('outbidNotification', {
                            targetUserId: previousBidder,
                            message: `You have been outbid on this item! New highest bid: $${amount}`
                        });

                        // --- Added Email Notification ---
                        try {
                            const prevUser = await User.findById(previousBidder);
                            const auctionInfo = await Auction.findById(auctionId).populate('vehicle');
                            if (prevUser && auctionInfo) {
                                require('../utils/sendEmail')({
                                    email: prevUser.email,
                                    subject: 'You have been OUTBID! - AutoBid Lanka',
                                    html: `<h1>Auction Update</h1>
                                           <p>Hi ${prevUser.name}, you have been outbid on <b>${auctionInfo.vehicle.year} ${auctionInfo.vehicle.make} ${auctionInfo.vehicle.model}</b>.</p>
                                           <p>The new highest bid is: <b>$${amount.toLocaleString()}</b>.</p>
                                           <p>Go back to the auction to place a higher bid now!</p>
                                           <a href="${process.env.FRONTEND_URL}/auctions/${auctionInfo.vehicle._id}" style="background:#f97316; color:white; padding:10px 20px; text-decoration:none; border-radius:5px; font-weight:bold;">Bid Again</a>`
                                });
                            }
                        } catch (err) {
                            console.error("Outbid Email Error:", err);
                        }
                        // ---------------------------------
                    }

                    // Persist to MongoDB
                    auction.currentHighestBid = amount;
                    auction.highestBidder = userId;
                    await auction.save();

                    await Bid.create({ auction: auctionId, bidder: userId, amount });
                } else {
                    socket.emit('bidError', { message: 'Bid amount must be higher than current highest bid' });
                }
            } catch (err) {
                console.error('Place bid error', err);
                socket.emit('bidError', { message: 'Server error placing bid' });
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
