import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Users, ArrowUp, AlertCircle, ShieldCheck } from 'lucide-react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

const SOCKET_URL = 'http://localhost:5000';

const VehicleDetails = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [bidAmount, setBidAmount] = useState('');
    const [socket, setSocket] = useState(null);

    const [vehicle, setVehicle] = useState(null);
    const [auction, setAuction] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const { data } = await api.get(`/vehicles/${id}`);
                setVehicle(data.vehicle);
                if (data.auctionData) {
                    setAuction(data.auctionData);
                }
            } catch (error) {
                console.error("Failed to fetch vehicle", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchVehicle();
    }, [id]);

    const { user, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        // Initialize Socket connection
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        // Join room for this specific auction
        if (auction?._id) {
            newSocket.emit('joinAuction', auction._id);
        }

        // Listen for incoming bids
        newSocket.on('bidUpdate', (data) => {
            setAuction(prev => ({ ...prev, currentHighestBid: data.amount }));
            // If we didn't make this bid, notify the user visually!
            if (data.userId !== user?._id) {
                toast('New bid placed!', { icon: '🔥', style: { background: '#f97316', color: '#fff' } });
            }
        });

        // Listen for bid errors (e.g., placing bid lower than current)
        newSocket.on('bidError', (data) => {
            toast.error(data.message);
        });

        // Cleanup on unmount
        return () => newSocket.disconnect();
    }, [auction?._id, user?._id]);

    const handleBid = (e) => {
        e.preventDefault();
        const bidNumber = Number(bidAmount);

        if (!isAuthenticated) {
            toast.error(t('vehicleDetails.mustBeLoggedIn'));
            return;
        }
        if (user?.kycStatus !== 'approved') {
            toast.error(t('vehicleDetails.kycRequired'));
            return;
        }

        const currentBidValue = auction.currentHighestBid || auction.startPrice || 0;
        if (bidNumber <= currentBidValue) {
            toast.error(t('vehicleDetails.bidHigher'));
            return;
        }

        // Emit the bid to the socket server
        socket.emit('placeBid', {
            auctionId: auction._id,
            userId: user._id,
            amount: bidNumber
        });

        toast.success(`${t('vehicleDetails.placingBid')}${bidNumber.toLocaleString()}...`);
        setBidAmount(''); // Reset input
    };

    if (isLoading) {
        return (
            <div className="py-32 flex justify-center">
                <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="py-32 text-center">
                <h2 className="text-3xl font-black text-gray-900">{t('vehicleDetails.notFound')}</h2>
            </div>
        );
    }

    const currentBidValue = auction ? (auction.currentHighestBid || auction.startPrice || 0) : vehicle.directBuyPrice;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            {/* Breadcrumbs */}
            <nav className="flex text-sm text-gray-500 mb-6 gap-2 font-medium">
                <Link to="/" className="hover:text-orange-500 transition-colors">{t('vehicleDetails.home')}</Link>
                <span>/</span>
                <Link to={auction ? "/auctions" : "/direct-buy"} className="hover:text-orange-500 transition-colors">
                    {auction ? t('vehicleDetails.liveAuctions') : t('vehicleDetails.directBuy')}
                </Link>
                <span>/</span>
                <span className="text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Left Column: Images & Specs */}
                <div className="lg:col-span-2 space-y-8">

                    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative aspect-[16/10] group">
                        <img src={vehicle.images?.[0] || 'https://via.placeholder.com/1200'} alt="Vehicle Main" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" />
                        {auction && (
                            <div className="absolute top-4 left-4 bg-red-500/90 backdrop-blur px-4 py-2 rounded-full text-white font-bold text-sm shadow-md flex items-center gap-2 animate-pulse">
                                <span className="w-2 h-2 bg-white rounded-full"></span> {t('vehicleDetails.liveAuctionBadge')}
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('vehicleDetails.specsTitle')}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">{t('vehicleDetails.make')}</p>
                                <p className="text-lg font-bold text-gray-900">{vehicle.make}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">{t('vehicleDetails.model')}</p>
                                <p className="text-lg font-bold text-gray-900">{vehicle.model}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">{t('vehicleDetails.year')}</p>
                                <p className="text-lg font-bold text-gray-900">{vehicle.year}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">{t('vehicleDetails.listingType')}</p>
                                <p className="text-lg font-bold text-green-600 uppercase tracking-widest text-xs mt-1.5">{vehicle.listingType.replace('_', ' ')}</p>
                            </div>
                            <div className="col-span-2 md:col-span-3 border-l-2 border-orange-500 pl-4 mt-4">
                                <p className="text-sm font-medium text-gray-500 mb-1">{t('vehicleDetails.vin')}</p>
                                <p className="text-lg font-bold text-gray-900 font-mono tracking-wider">{vehicle.vin}</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Bidding Panel */}
                <div className="lg:col-span-1">

                    {/* Sticky Bidding Card */}
                    <div className="sticky top-24 space-y-6">

                        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-orange-500/5 border border-orange-100">

                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-none mb-6">
                                {vehicle.year} {vehicle.make}<br />
                                <span className="text-2xl text-gray-500 font-bold">{vehicle.model}</span>
                            </h1>

                            <div className="p-4 bg-gray-50 rounded-2xl mb-6 flex justify-between items-center border border-gray-100 transition-all duration-300">
                                <div>
                                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider block mb-1">{auction ? t('vehicleDetails.currentHighestBid') : t('vehicleDetails.fixedPrice')}</span>
                                    <span className="text-4xl font-black text-gray-900">${currentBidValue.toLocaleString()}</span>
                                </div>
                                {auction && (
                                    <div className="text-right">
                                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider block mb-1">{t('vehicleDetails.ends')}</span>
                                        <span className="text-xs font-bold font-mono text-orange-600 flex items-center gap-1.5 justify-end mt-1">
                                            <Clock className="w-4 h-4" /> {new Date(auction.endTime).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {auction ? (
                                <form onSubmit={handleBid} className="space-y-4">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-2xl font-bold text-gray-400">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            required
                                            min={currentBidValue + 100}
                                            step={100}
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                            placeholder={(currentBidValue + 100).toLocaleString()}
                                            className="w-full pl-10 pr-6 py-4 text-2xl font-bold border-2 border-gray-200 focus:border-orange-500 rounded-xl outline-none transition-colors"
                                        />
                                    </div>

                                    <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-lg transition-all shadow-md shadow-orange-500/30 hover:shadow-lg hover:-translate-y-0.5">
                                        <ArrowUp className="w-6 h-6" /> {t('vehicleDetails.placeBidBtn')}
                                    </button>

                                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 mt-4">
                                        <Users className="w-5 h-5 text-gray-400" /> {t('vehicleDetails.liveEngaged')}
                                    </div>
                                </form>
                            ) : (
                                <button onClick={() => {
                                    if (!isAuthenticated) return toast.error(t('vehicleDetails.loginFirst'));
                                    if (user?.kycStatus !== 'approved') return toast.error(t('vehicleDetails.kycRequired'));
                                    toast.success("Proceeding to checkout...");
                                }} className="w-full flex items-center justify-center gap-2 px-6 py-5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-lg transition-all shadow-md shadow-green-500/30 hover:shadow-lg hover:-translate-y-0.5">
                                    {t('vehicleDetails.checkoutBtn')}
                                </button>
                            )}
                        </div>

                        <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                            <h4 className="flex items-center gap-2 text-blue-900 font-bold mb-2">
                                <ShieldCheck className="w-5 h-5" /> {t('vehicleDetails.escrowProtected')}
                            </h4>
                            <p className="text-sm text-blue-800/80 leading-relaxed mb-4">
                                {t('vehicleDetails.escrowDesc')}
                            </p>
                            <div className="bg-white p-3 rounded-xl border border-blue-100 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                <div>
                                    <span className="block text-sm font-bold text-gray-900 mb-0.5">{t('vehicleDetails.antiSniping')}</span>
                                    <span className="block text-xs text-gray-500">{t('vehicleDetails.antiSnipingDesc')}</span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default VehicleDetails;
