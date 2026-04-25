const Auction = require('../models/Auction');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const sendEmail = require('./sendEmail');

const startAuctionMonitor = () => {
    console.log('Auction Monitor Initialized...');
    
    // Check every minute
    setInterval(async () => {
        try {
            const now = new Date();
            // Find auctions that have ended but are still marked as 'live'
            const expiredAuctions = await Auction.find({
                status: 'live',
                endTime: { $lt: now }
            }).populate('vehicle').populate('seller');

            for (const auction of expiredAuctions) {
                console.log(`Processing expired auction: ${auction._id}`);
                
                auction.status = 'ended';
                await auction.save();

                if (auction.highestBidder && auction.currentHighestBid >= auction.reservePrice) {
                    // We have a winner!
                    const winner = await User.findById(auction.highestBidder);
                    
                    // 1. Send Win Email to Buyer
                    await sendEmail({
                        email: winner.email,
                        subject: 'CONGRATULATIONS! You won the auction - AutoBid Lanka',
                        html: `<h1>You're the Winner!</h1>
                               <p>Hi ${winner.name}, congratulations! You've won the auction for <b>${auction.vehicle.year} ${auction.vehicle.make} ${auction.vehicle.model}</b> with a bid of <b>$${auction.currentHighestBid.toLocaleString()}</b>.</p>
                               <p>Please log in to your dashboard to complete the payment and fund the escrow.</p>
                               <a href="${process.env.FRONTEND_URL}/dashboard" style="background:#f97316; color:white; padding:10px 20px; text-decoration:none; border-radius:5px; font-weight:bold;">Go to Dashboard</a>`
                    });

                    // 2. Send Success Email to Seller
                    await sendEmail({
                        email: auction.seller.email,
                        subject: 'Your auction has successfully ended!',
                        html: `<h1>Successful Sale!</h1>
                               <p>Hi ${auction.seller.name}, your auction for <b>${auction.vehicle.year} ${auction.vehicle.make} ${auction.vehicle.model}</b> has ended successfully.</p>
                               <p>The winning bid is <b>$${auction.currentHighestBid.toLocaleString()}</b>. We've notified the winner to proceed with payment.</p>
                               <p>We'll update you as soon as the funds are in escrow.</p>`
                    });

                } else if (auction.highestBidder) {
                    // Reserve price not met
                    const winner = await User.findById(auction.highestBidder);
                    await sendEmail({
                        email: winner.email,
                        subject: 'Auction Ended - Reserve Price Not Met',
                        html: `<h1>Auction Update</h1>
                               <p>The auction for ${auction.vehicle.make} ${auction.vehicle.model} has ended. Unfortunately, the highest bid did not meet the seller's reserve price.</p>`
                    });
                } else {
                    // No bids
                    await sendEmail({
                        email: auction.seller.email,
                        subject: 'Auction Ended - No Bids Reached',
                        html: `<h1>Auction Update</h1>
                               <p>Your auction for ${auction.vehicle.make} ${auction.vehicle.model} has ended without any bids.</p>`
                    });
                }
            }
        } catch (error) {
            console.error('Auction Monitor Error:', error);
        }
    }, 60000); // 1 minute
};

module.exports = startAuctionMonitor;
