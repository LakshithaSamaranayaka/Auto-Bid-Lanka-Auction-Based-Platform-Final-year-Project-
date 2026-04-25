import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight, Car, Clock, Zap } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Watchlist = () => {
    const { t } = useTranslation();
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchWatchlist = async () => {
        try {
            const { data } = await api.get('/auth/watchlist');
            setVehicles(data);
        } catch (err) {
            toast.error("Failed to load watchlist");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWatchlist();
    }, []);

    const removeVehicle = async (id) => {
        try {
            await api.post('/auth/toggle-watchlist', { vehicleId: id });
            setVehicles(vehicles.filter(v => v._id !== id));
            toast.success("Removed from watchlist");
        } catch (err) {
            toast.error("Failed to remove vehicle");
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
                    <Heart className="text-orange-500 fill-orange-500" /> My Watchlist
                </h1>
                <p className="text-gray-500 mt-2">Saved vehicles you're keeping an eye on</p>
            </div>

            {vehicles.length === 0 ? (
                <div className="bg-gray-50 rounded-3xl p-16 text-center border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Car className="w-10 h-10 text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your watchlist is empty</h2>
                    <p className="text-gray-500 mb-8">Start exploring auctions and save the ones you love!</p>
                    <Link to="/auctions" className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all">
                        Browse Auctions <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {vehicles.map((vehicle, i) => (
                        <motion.div
                            key={vehicle._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl hover:shadow-2xl transition-all group"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800'}
                                    alt={vehicle.model}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <button
                                    onClick={() => removeVehicle(vehicle._id)}
                                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-full text-red-500 shadow-lg hover:bg-red-50 transition-all border border-gray-100 active:scale-90"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                {vehicle.listingType === 'auction' && (
                                    <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                                        <Zap className="w-3 h-3" /> Live Auction
                                    </div>
                                )}
                            </div>

                            <div className="p-8">
                                <div className="mb-6">
                                    <p className="text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{vehicle.make}</p>
                                    <h3 className="text-2xl font-black text-gray-900">{vehicle.year} {vehicle.model}</h3>
                                </div>

                                <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                                    <div className="text-gray-500 text-sm font-bold flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" /> Ending Soon
                                    </div>
                                    <Link
                                        to={`/auctions/${vehicle._id}`}
                                        className="text-orange-600 font-extrabold hover:text-orange-700 transition-colors flex items-center gap-1"
                                    >
                                        View Details <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Watchlist;
