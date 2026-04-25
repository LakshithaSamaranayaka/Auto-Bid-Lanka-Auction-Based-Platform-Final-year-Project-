import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Car, Package, Clock, ShieldCheck, ChevronRight, Gavel, CheckCircle2, User, Eye, Trash2, ArrowRight, TrendingUp } from 'lucide-react';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const SellerVehicles = () => {
    const { t } = useTranslation();
    const { user } = useSelector((state) => state.auth);
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAuction, setSelectedAuction] = useState(null);
    const [isBidModalOpen, setIsBidModalOpen] = useState(false);

    const fetchMyListings = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/vehicles/my-listings');
            setListings(data);
        } catch (err) {
            console.error("Failed to fetch listings:", err);
            toast.error("Failed to load your vehicles");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyListings();
    }, []);

    const handleAcceptBid = async (auctionId, bidId) => {
        if (!window.confirm("Are you sure you want to accept this bid? This will end the auction and start the transaction process.")) return;
        
        try {
            await api.post(`/vehicles/accept-bid/${auctionId}`, { bidId });
            toast.success("Bid accepted! Transaction initiated.");
            setIsBidModalOpen(false);
            fetchMyListings();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to accept bid");
        }
    };

    const handleCloseAuction = async (auctionId) => {
        if (!window.confirm("Are you sure you want to end this auction early?")) return;
        try {
            await api.put(`/vehicles/auction-close/${auctionId}`);
            toast.success("Auction ended early.");
            fetchMyListings();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to close auction.");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'live': return 'bg-green-500';
            case 'pending_approval': return 'bg-amber-500';
            case 'sold': return 'bg-blue-500';
            case 'rejected': return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">My Vehicles</h1>
                        <p className="text-gray-500 font-medium">Manage your listings, view bids, and approve buyers.</p>
                    </div>
                    <Link to="/sell" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-[1.2rem] shadow-xl shadow-black/10 transition-all hover:-translate-y-1">
                        <Package className="w-5 h-5" />
                        List New Vehicle
                    </Link>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <Car className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Listings</p>
                            <p className="text-3xl font-black text-gray-900">{listings.length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6">
                        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Active Auctions</p>
                            <p className="text-3xl font-black text-gray-900">{listings.filter(v => v.auction?.status === 'live').length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6">
                        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                            <Gavel className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Bids Received</p>
                            <p className="text-3xl font-black text-gray-900">{listings.reduce((acc, curr) => acc + (curr.bids?.length || 0), 0)}</p>
                        </div>
                    </div>
                </div>

                {/* Listings Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="w-16 h-16 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-500 font-bold">Loading your fleet...</p>
                    </div>
                ) : listings.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-16 text-center border-2 border-dashed border-gray-100">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Car className="w-12 h-12 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">No listings found</h3>
                        <p className="text-gray-500 font-medium mb-8 max-w-md mx-auto">You haven't listed any vehicles yet. Start selling today and reach thousands of buyers.</p>
                        <Link to="/sell" className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 transition-all">
                            List My First Vehicle
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {listings.map((vehicle) => (
                            <div key={vehicle._id} className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-orange-100 transition-all group">
                                <div className="flex flex-col lg:flex-row gap-8">
                                    {/* Image & Main Info */}
                                    <div className="lg:w-1/3">
                                        <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-gray-100 border border-gray-100 shadow-inner">
                                            <img 
                                                src={vehicle.images?.[0] || 'https://via.placeholder.com/600x400'} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 left-4 flex gap-2">
                                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black text-white uppercase tracking-widest ${getStatusColor(vehicle.status)}`}>
                                                    {vehicle.status.replace('_', ' ')}
                                                </span>
                                                <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-black text-white uppercase tracking-widest">
                                                    {vehicle.listingType}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-1">{vehicle.year} {vehicle.make} {vehicle.model}</h2>
                                            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">VIN: {vehicle.vin}</p>
                                        </div>
                                    </div>

                                    {/* Listing Details */}
                                    <div className="lg:w-2/3 flex flex-col justify-between">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Transmission</p>
                                                <p className="font-bold text-gray-900">{vehicle.specs?.transmission}</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Fuel Type</p>
                                                <p className="font-bold text-gray-900">{vehicle.specs?.fuelType}</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Mileage</p>
                                                <p className="font-bold text-gray-900">{vehicle.specs?.mileage?.toLocaleString()} km</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Color</p>
                                                <p className="font-bold text-gray-900">{vehicle.specs?.color}</p>
                                            </div>
                                        </div>

                                        {vehicle.auction && (
                                            <div className="bg-orange-50/50 rounded-[2rem] p-6 border border-orange-100/50 mb-8">
                                                <div className="flex flex-wrap items-center justify-between gap-6">
                                                    <div>
                                                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Current Highest Bid</p>
                                                        <p className="text-3xl font-black text-gray-900">Rs. {vehicle.auction.currentHighestBid?.toLocaleString() || vehicle.auction.startPrice.toLocaleString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Reserve Price</p>
                                                        <p className="font-bold text-gray-900">Rs. {vehicle.auction.reservePrice?.toLocaleString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Bids</p>
                                                        <p className="font-bold text-gray-900">{vehicle.bids?.length || 0} Bids</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedAuction(vehicle);
                                                                setIsBidModalOpen(true);
                                                            }}
                                                            className="px-6 py-3 bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-lg shadow-black/10 flex items-center gap-2"
                                                        >
                                                            <Eye className="w-4 h-4" /> View Bids
                                                        </button>
                                                        {vehicle.auction.status === 'live' && (
                                                            <button 
                                                                onClick={() => handleCloseAuction(vehicle.auction._id)}
                                                                className="px-6 py-3 bg-white text-red-500 border border-red-100 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-red-50 transition-all flex items-center gap-2"
                                                            >
                                                                <Clock className="w-4 h-4" /> End Early
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                            <div className="flex items-center gap-4">
                                                <Link to={`/auctions/${vehicle._id}`} className="text-[10px] font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest flex items-center gap-1">
                                                    View Public Page <ChevronRight className="w-3 h-3" />
                                                </Link>
                                            </div>
                                            {vehicle.listingType === 'direct_buy' && (
                                                <p className="text-xl font-black text-gray-900">Rs. {vehicle.directBuyPrice?.toLocaleString()}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bids Modal */}
            {isBidModalOpen && selectedAuction && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">Bid History</h3>
                                <p className="text-gray-500 font-medium">{selectedAuction.year} {selectedAuction.make} {selectedAuction.model}</p>
                            </div>
                            <button onClick={() => setIsBidModalOpen(false)} className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">
                                <Trash2 className="w-5 h-5 rotate-45" />
                            </button>
                        </div>

                        <div className="p-8 max-h-[60vh] overflow-y-auto">
                            {selectedAuction.bids?.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Gavel className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 font-bold">No bids received yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {selectedAuction.bids.map((bid, index) => (
                                        <div key={bid._id} className={`p-5 rounded-2xl border flex items-center justify-between transition-all ${index === 0 ? 'bg-orange-50 border-orange-200 shadow-sm' : 'bg-white border-gray-100'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? 'bg-orange-500' : 'bg-gray-200 text-gray-400'}`}>
                                                    {bid.bidder?.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{bid.bidder?.name || 'Anonymous'}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(bid.createdAt).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-lg font-black text-gray-900">Rs. {bid.amount.toLocaleString()}</p>
                                                    {index === 0 && <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Highest</span>}
                                                </div>
                                                <button 
                                                    onClick={() => handleAcceptBid(selectedAuction.auction._id, bid._id)}
                                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all shadow-md"
                                                >
                                                    Accept
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-xs text-gray-400 font-bold max-w-[250px]">Accepting a bid will end the auction immediately and notify the buyer.</p>
                            <button onClick={() => setIsBidModalOpen(false)} className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerVehicles;
