import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { User, Wallet, FileCheck, Key, ShieldCheck, CreditCard, Clock, Settings, Package, Car, LayoutDashboard, Heart, Trash2, Star, TrendingUp, Sparkles, BarChart as BarChartIcon, PieChart as PieChartIcon, Gavel } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import KYCUpload from '../components/KYCUpload';
import BankUpload from '../components/BankUpload';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import { refreshUserProfile } from '../features/authSlice';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('overview');
    const [userData, setUserData] = useState(null);
    const [myListings, setMyListings] = useState([]);
    const [myPurchases, setMyPurchases] = useState([]);
    const [myActiveBids, setMyActiveBids] = useState({ won: [], leading: [], outbid: [] });
    const [sellerStats, setSellerStats] = useState(null);
    const [buyerStats, setBuyerStats] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [myRequests, setMyRequests] = useState([]);
    
    // Review states
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

    // Wallet states
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');

    const fetchUserData = async () => {
        try {
            const { data } = await api.get('/auth/me');
            setUserData(data);
            dispatch(refreshUserProfile());
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };

    const fetchMyListings = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/vehicles/my-listings');
            setMyListings(data);
        } catch (err) {
            console.error("Failed to fetch listings:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMyPurchases = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/transactions/my-purchases');
            setMyPurchases(data);
        } catch (err) {
            console.error("Failed to fetch purchases:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMyActiveBids = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/transactions/my-active-bids');
            setMyActiveBids(data);
        } catch (err) {
            console.error("Failed to fetch active bids:", err);
            // Initialize with default empty state on error to prevent crash
            setMyActiveBids({ won: [], leading: [], outbid: [] });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBuyerAnalytics = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/transactions/buyer/analytics');
            setBuyerStats(data);
        } catch (err) {
            console.error("Failed to fetch buyer analytics:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSellerAnalytics = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/transactions/seller/analytics');
            setSellerStats(data);
        } catch (err) {
            console.error("Failed to fetch seller analytics:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserData();
            fetchMyPurchases();
            fetchMyActiveBids();
            if (user.role === 'buyer') {
                fetchMyRequests();
            }
        }
    }, [user, dispatch]);

    const fetchMyRequests = async () => {
        try {
            const { data } = await api.get('/vehicle-requests/my-requests');
            setMyRequests(data);
        } catch (err) {
            console.error("Failed to fetch requests:", err);
        }
    };

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const paymentStatus = searchParams.get('payment');
        const depositStatus = searchParams.get('deposit');
        const tid = searchParams.get('tid');
        const amt = searchParams.get('amt');

        if (paymentStatus === 'success' && tid) {
            const confirmPayment = async () => {
                try {
                    await api.post('/transactions/fund', { transactionId: tid });
                    toast.success(t('dashboard.paymentSuccess') || "Payment confirmed! Funds are now in escrow.");
                    setSearchParams({});
                    fetchMyPurchases();
                    fetchUserData();
                } catch (err) {
                    console.error("Payment confirmation failed:", err);
                    toast.error("Failed to confirm payment status.");
                }
            };
            confirmPayment();
        }

        if (depositStatus === 'success' && amt) {
            const confirmDep = async () => {
                try {
                    await api.post('/transactions/confirm-deposit', { amount: amt });
                    toast.success(`Rs. ${amt} deposited successfully to your wallet!`);
                    setSearchParams({});
                    fetchUserData();
                } catch (err) {
                    console.error("Deposit confirmation failed:", err);
                }
            };
            confirmDep();
        }
    }, [searchParams]);

    useEffect(() => {
        if (activeTab === 'listings') {
            fetchMyListings();
        } else if (activeTab === 'purchases') {
            fetchMyPurchases();
        } else if (activeTab === 'bids') {
            fetchMyActiveBids();
        } else if (activeTab === 'requests') {
            fetchMyRequests();
        } else if (activeTab === 'analytics') {
            fetchBuyerAnalytics();
            if (user?.role === 'seller' || user?.role === 'admin') {
                fetchSellerAnalytics();
            }
        }
    }, [activeTab]);

    const handleCloseAuction = async (auctionId) => {
        if (!window.confirm(t('dashboard.confirmClose') || "Are you sure you want to close this auction early?")) return;
        setIsLoading(true);
        try {
            await api.put(`/vehicles/auction-close/${auctionId}`);
            toast.success(t('dashboard.closeSuccess') || "Auction closed successfully.");
            fetchMyListings();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to close auction.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/reviews', {
                transactionId: selectedTransaction._id,
                rating: reviewData.rating,
                comment: reviewData.comment
            });
            toast.success(t('dashboard.reviewSuccess') || "Review submitted! Thank you.");
            setIsReviewModalOpen(false);
            fetchMyPurchases();
        } catch (err) {
            toast.error(err.response?.data?.message || t('dashboard.reviewFail'));
        }
    };

    const handleDeposit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await api.post('/transactions/deposit-session', { amount: depositAmount });
            if (data.url) window.location.href = data.url;
        } catch (err) {
            toast.error(err.response?.data?.message || "Deposit failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleWithdraw = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/transactions/withdraw', { amount: withdrawAmount });
            toast.success("Withdrawal successful! Funds sent to your bank account.");
            setIsWithdrawModalOpen(false);
            fetchUserData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Withdrawal failed");
        } finally {
            setIsLoading(false);
        }
    };

    const getKycBadge = () => {
        switch (user?.kycStatus) {
            case 'approved':
                return <span className="bg-green-100 text-green-700 text-sm font-black px-3 py-1.5 rounded-lg uppercase tracking-widest flex items-center gap-2 border border-green-200"><ShieldCheck className="w-4 h-4" /> {t('dashboard.kycApproved')}</span>;
            case 'pending':
                return <span className="bg-amber-100 text-amber-700 text-sm font-black px-3 py-1.5 rounded-lg uppercase tracking-widest flex items-center gap-2 border border-amber-200"><Clock className="w-4 h-4" /> {t('dashboard.kycPending')}</span>;
            default:
                return <span className="bg-red-100 text-red-700 text-sm font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-red-200">{t('dashboard.kycUnverified')}</span>;
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-32">
            {/* Deposit Modal */}
            {isDepositModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-3xl font-black text-gray-900 mb-2">Deposit Funds</h3>
                        <p className="text-gray-500 font-medium mb-8">Add secure funds to your Auto Lanka wallet via Stripe.</p>
                        
                        <form onSubmit={handleDeposit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Amount (Rs.)</label>
                                <input
                                    type="number"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 focus:ring-4 focus:ring-orange-500/10 outline-none font-black text-2xl"
                                    placeholder="5000"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    required
                                    min="100"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setIsDepositModalOpen(false)} className="flex-1 px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all">Cancel</button>
                                <button type="submit" disabled={isLoading} className="flex-1 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-xl shadow-orange-500/20 transition-all">
                                    {isLoading ? 'Processing...' : 'Deposit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Withdraw Modal */}
            {isWithdrawModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-3xl font-black text-gray-900 mb-2">Withdraw Funds</h3>
                        <p className="text-gray-500 font-medium mb-8">Withdraw funds to your registered bank account.</p>
                        
                        <form onSubmit={handleWithdraw} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Amount (Rs.)</label>
                                <input
                                    type="number"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 focus:ring-4 focus:ring-orange-500/10 outline-none font-black text-2xl"
                                    placeholder="Max: Rs. 10,000"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    required
                                    max={userData?.wallet?.balance}
                                />
                                <p className="text-[10px] font-bold text-gray-400 mt-2">Available: Rs. {userData?.wallet?.balance?.toLocaleString()}</p>
                            </div>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setIsWithdrawModalOpen(false)} className="flex-1 px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all">Cancel</button>
                                <button type="submit" disabled={isLoading} className="flex-1 px-8 py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition-all">
                                    {isLoading ? 'Processing...' : 'Withdraw'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {isReviewModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-3xl font-black text-gray-900 mb-2">{t('dashboard.rateExperience')}</h3>
                        <p className="text-gray-500 font-medium mb-8">{t('dashboard.rateFor')} {selectedTransaction?.vehicle?.model}?</p>
                        
                        <form onSubmit={handleReviewSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4 text-center">{t('dashboard.starRating')}</label>
                                <div className="flex justify-center gap-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewData({ ...reviewData, rating: star })}
                                            className={`text-4xl transition-all hover:scale-125 ${reviewData.rating >= star ? 'text-orange-500' : 'text-gray-200'}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('dashboard.feedbackLabel')}</label>
                                <textarea
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 focus:ring-4 focus:ring-orange-500/10 outline-none font-medium h-32 resize-none"
                                    placeholder={t('dashboard.feedbackPlace')}
                                    value={reviewData.comment}
                                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsReviewModalOpen(false)}
                                    className="flex-1 px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all"
                                >
                                    {t('dashboard.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-xl shadow-orange-500/20 transition-all hover:-translate-y-1"
                                >
                                    {t('dashboard.submitReview')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
                <div className="container-fluid py-4 sm:py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                        <div className="flex items-center gap-4 sm:gap-6">
                            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-tr from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center shadow-xl text-white font-black text-xl sm:text-3xl border border-gray-700 shrink-0">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight truncate">{user?.name || t('dashboard.welcomeBack')}</h1>
                                <p className="text-gray-500 font-medium flex flex-wrap items-center gap-2 sm:gap-3 mt-0.5 sm:mt-1">
                                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap">{user?.role ? (user.role === 'seller' ? t('dashboard.seller') : t('dashboard.buyer')) : t('dashboard.buyer')}</span>
                                    <span className="text-xs sm:text-sm truncate opacity-70">{user?.email}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-1">
                            <div className="shrink-0">{getKycBadge()}</div>
                            {user?.role === 'admin' && (
                                <Link to="/admin" className="px-4 py-2 sm:px-5 sm:py-2.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap">
                                    <LayoutDashboard className="w-4 h-4" /> {t('dashboard.adminConsole')}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-6 text-sm font-medium">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel - Tabs Navigation */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-1 sm:p-4 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible no-scrollbar sticky top-24 z-10 lg:static">
                            <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all whitespace-nowrap text-sm sm:text-base ${activeTab === 'overview' ? 'bg-orange-50 text-orange-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
                                <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> {t('dashboard.tabOverview')}
                            </button>
                            <button onClick={() => setActiveTab('bids')} className={`flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all whitespace-nowrap text-sm sm:text-base ${activeTab === 'bids' ? 'bg-orange-50 text-orange-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
                                <Key className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> {t('dashboard.tabBids')}
                            </button>
                            <button onClick={() => setActiveTab('purchases')} className={`flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all whitespace-nowrap text-sm sm:text-base ${activeTab === 'purchases' ? 'bg-orange-50 text-orange-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
                                <Package className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> {t('dashboard.tabPurchases')}
                            </button>
                            {user?.role === 'buyer' && (
                                <button onClick={() => setActiveTab('requests')} className={`flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all whitespace-nowrap text-sm sm:text-base ${activeTab === 'requests' ? 'bg-orange-50 text-orange-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> {t('dashboard.tabRequests')}
                                </button>
                            )}
                             <button onClick={() => setActiveTab('watchlist')} className={`flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all whitespace-nowrap text-sm sm:text-base ${activeTab === 'watchlist' ? 'bg-orange-50 text-orange-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
                                <Heart className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> {t('dashboard.tabWatchlist')}
                            </button>
                            {(user?.role === 'seller' || user?.role === 'admin') && (
                                <>
                                    <button onClick={() => setActiveTab('listings')} className={`flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all whitespace-nowrap text-sm sm:text-base ${activeTab === 'listings' ? 'bg-orange-50 text-orange-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        <Car className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> {t('dashboard.tabListings')}
                                    </button>
                                    <Link to="/my-vehicles" className="flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all whitespace-nowrap text-sm sm:text-base text-gray-600 hover:bg-gray-50">
                                        {t('dashboard.manageBids') || 'Manage Bids'}
                                    </Link>
                                    <button onClick={() => setActiveTab('analytics')} className={`flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all whitespace-nowrap text-sm sm:text-base ${activeTab === 'analytics' ? 'bg-orange-50 text-orange-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> {t('dashboard.tabAnalytics')}
                                    </button>
                                </>
                            )}
                            <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all whitespace-nowrap text-sm sm:text-base ${activeTab === 'settings' ? 'bg-orange-50 text-orange-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
                                <Settings className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> {t('dashboard.tabSettings')}
                            </button>
                        </div>

                        <KYCUpload />
                        {user?.role === 'seller' && <BankUpload />}
                    </div>

                    {/* Right Panel */}
                    <div className="lg:col-span-2 space-y-8">
                        {activeTab === 'overview' && (
                            <>
                                <div className="bg-gray-900 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-gray-800 relative overflow-hidden group">
                                     <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-orange-500/20 rounded-full blur-[60px] sm:blur-[80px] -z-10 -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/30 transition-all duration-700"></div>
                                     <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-blue-600/20 rounded-full blur-[60px] sm:blur-[80px] -z-10 translate-y-1/2 -translate-x-1/2"></div>
                                     <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                                         <div>
                                             <div className="flex items-center gap-2 text-gray-400 font-bold tracking-wider uppercase text-[10px] sm:text-xs mb-2 sm:mb-3">
                                                 <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" /> {t('dashboard.escrowBalance')}
                                             </div>
                                             <div className="text-4xl sm:text-6xl font-black text-white tracking-tighter">
                                                 Rs. {userData?.wallet?.balance ? userData.wallet.balance.toLocaleString() : 0}
                                             </div>
                                             <p className="text-gray-400 mt-2 sm:mt-3 font-medium text-xs sm:text-sm">{t('dashboard.vaultDesc')}</p>
                                         </div>
                                         <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto overflow-x-auto no-scrollbar scroll-smooth">
                                             <button 
                                                onClick={() => setIsDepositModalOpen(true)}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold transition-all shadow-xl shadow-orange-500/20 whitespace-nowrap text-sm sm:text-base"
                                             >
                                                 <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" /> {t('dashboard.depositBtn')}
                                             </button>
                                             <button 
                                                onClick={() => setIsWithdrawModalOpen(true)}
                                                className="flex-1 md:flex-none px-5 py-3 sm:px-6 sm:py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-2xl font-bold transition-all whitespace-nowrap text-sm sm:text-base"
                                             >
                                                 {t('dashboard.withdrawBtn')}
                                             </button>
                                         </div>
                                     </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                     <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 sm:gap-5">
                                         <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 text-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                                             <Key className="w-5 h-5 sm:w-6 sm:h-6" />
                                         </div>
                                         <div className="min-w-0">
                                             <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px] mb-0.5 sm:mb-1 truncate">{t('dashboard.activeBidsTitle')}</p>
                                             <p className="text-2xl sm:text-3xl font-black text-gray-900 leading-none">{(myActiveBids.leading?.length || 0) + (myActiveBids.outbid?.length || 0)}</p>
                                         </div>
                                     </div>
                                     <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 sm:gap-5">
                                         <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-50 text-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                                             <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                                         </div>
                                         <div className="min-w-0">
                                             <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px] mb-0.5 sm:mb-1 truncate">{t('dashboard.boughtCount')}</p>
                                             <p className="text-2xl sm:text-3xl font-black text-gray-900 leading-none">{myPurchases.length}</p>
                                         </div>
                                     </div>
                                </div>

                            </>
                        )}

                        {activeTab === 'bids' && (
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                    <Key className="w-7 h-7 text-orange-500" /> {t('dashboard.biddingActivity')}
                                </h3>
                                
                                {myActiveBids.won.length > 0 && (
                                    <div className="mb-12">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600 mb-4 ml-1">{t('dashboard.wonAuctions')} 🎉</h4>
                                        <div className="space-y-4">
                                            {myActiveBids.won.map((auction) => (
                                                <div key={auction._id} className="bg-green-50/30 border border-green-100 rounded-[2rem] p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                                                    <div className="flex gap-6">
                                                        <div className="w-24 h-24 rounded-2xl overflow-hidden border border-green-100 shadow-sm">
                                                            <img src={auction.vehicle?.images?.[0]} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-black text-gray-900 tracking-tight">{auction.vehicle?.year} {auction.vehicle?.make} {auction.vehicle?.model}</h4>
                                                            <p className="text-xs text-green-700 font-bold mb-3">{t('home.currentBid')}: Rs. {auction.currentHighestBid?.toLocaleString()}</p>
                                                            <span className="text-[9px] font-black uppercase px-2 py-1 bg-green-100 text-green-700 rounded-lg">{t('dashboard.reserveMet')}</span>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={async () => {
                                                            try {
                                                                const { data } = await api.post('/transactions/stripe-checkout', {
                                                                    vehicleId: auction.vehicle._id,
                                                                    auctionId: auction._id,
                                                                    amount: auction.currentHighestBid
                                                                });
                                                                if (data.url) window.location.href = data.url;
                                                            } catch (err) { toast.error(err.response?.data?.message || "Stripe session failed"); }
                                                        }}
                                                        className="w-full md:w-auto px-8 py-3 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                                                    >
                                                        {t('dashboard.checkoutPay')}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Leading Section */}
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400 mb-4 ml-1">{t('dashboard.leading')}</h4>
                                        {myActiveBids.leading.length > 0 ? (
                                            <div className="space-y-4">
                                                {myActiveBids.leading.map((auction) => (
                                                    <div key={auction._id} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex gap-4 hover:border-orange-100 transition-colors">
                                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-sm shrink-0">
                                                            <img src={auction.vehicle?.images?.[0]} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h5 className="font-bold text-gray-900 text-sm leading-tight">{auction.vehicle?.make} {auction.vehicle?.model}</h5>
                                                            <p className="text-orange-600 font-black text-sm mt-1">Rs. {auction.currentHighestBid?.toLocaleString()}</p>
                                                            <Link to={`/auctions/${auction.vehicle?._id}`} className="text-[9px] font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest mt-2 block underline">{t('dashboard.viewPublic')}</Link>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-10 border-2 border-dashed border-gray-50 rounded-2xl text-center text-[10px] text-gray-400 font-black uppercase tracking-widest">{t('dashboard.noLeading')}</div>
                                        )}
                                    </div>
 
                                    {/* Outbid Section */}
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 mb-4 ml-1">{t('dashboard.outbid')}</h4>
                                        {myActiveBids.outbid.length > 0 ? (
                                            <div className="space-y-4">
                                                {myActiveBids.outbid.map((auction) => (
                                                    <div key={auction._id} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex gap-4 opacity-70 grayscale-[0.5] hover:grayscale-0 hover:opacity-100 transition-all">
                                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-sm shrink-0">
                                                            <img src={auction.vehicle?.images?.[0]} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h5 className="font-bold text-gray-900 text-sm">{auction.vehicle?.make} {auction.vehicle?.model}</h5>
                                                            <p className="text-red-500 font-black text-sm mt-0.5">Rs. {auction.currentHighestBid?.toLocaleString()}</p>
                                                            <Link to={`/auctions/${auction.vehicle?._id}`} className="text-[9px] font-black text-orange-600 hover:text-orange-700 uppercase tracking-widest mt-2 block underline font-bold">{t('vehicleDetails.placeBidBtn')}</Link>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-10 border-2 border-dashed border-gray-50 rounded-2xl text-center text-[10px] text-gray-400 font-black uppercase tracking-widest">{t('dashboard.noOutbid')}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'watchlist' && (
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                    <Heart className="w-7 h-7 text-orange-500 fill-orange-500" /> {t('dashboard.tabWatchlist')}
                                </h3>
                                {userData?.watchlist?.length === 0 ? (
                                    <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50">
                                        <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Heart className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">{t('dashboard.watchlistEmpty')}</h4>
                                        <p className="text-gray-500 font-medium mb-8 max-w-sm mx-auto">{t('dashboard.watchlistDesc')}</p>
                                        <Link to="/auctions" className="px-8 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-md">{t('dashboard.browseBtn')}</Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {userData?.watchlist?.map((vehicle) => (
                                            <div key={vehicle._id} className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                                                <div className="relative h-40">
                                                    <img src={vehicle.images?.[0]} alt={vehicle.model} className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                await api.post('/auth/toggle-watchlist', { vehicleId: vehicle._id });
                                                                fetchUserData();
                                                            } catch (err) { console.error(err); }
                                                        }}
                                                        className="absolute top-2 right-2 p-2 bg-white/90 rounded-full text-red-500 shadow-sm"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="p-4">
                                                    <h4 className="font-bold text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</h4>
                                                    <Link to={`/auctions/${vehicle._id}`} className="text-orange-500 text-xs font-black uppercase mt-2 inline-block transition-colors hover:text-orange-700">View Page</Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'purchases' && (
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                    <Package className="w-7 h-7 text-green-500" /> {t('dashboard.purchasesTitle')}
                                </h3>
                                {myPurchases.length === 0 ? (
                                    <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50">
                                        <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Car className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">{t('dashboard.garageEmpty')}</h4>
                                        <p className="text-gray-500 font-medium mb-8 max-w-sm mx-auto">{t('dashboard.garageDesc')}</p>
                                        <div className="flex items-center justify-center gap-4">
                                            <Link to="/auctions" className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm">{t('dashboard.auctionsBtn')}</Link>
                                            <Link to="/direct-buy" className="px-6 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-md">{t('dashboard.buyBtn')}</Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {myPurchases.map((p) => (
                                            <div key={p._id} className="bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:border-orange-100 transition-all group">
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                                    <div className="flex gap-5">
                                                        <div className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                                                            <img src={p.vehicle?.images?.[0] || 'https://via.placeholder.com/200'} alt={p.vehicle?.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-black text-gray-900 tracking-tight">{p.vehicle?.year} {p.vehicle?.make} {p.vehicle?.model}</h4>
                                                            <p className="text-xs text-gray-500 font-bold mb-2">Seller: {p.seller?.name}</p>
                                                            <div className="flex flex-wrap gap-2 items-center">
                                                                <span className="text-sm font-black text-orange-600">Rs. {(p.totalAmount || 0).toLocaleString()}</span>
                                                                <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${
                                                                    p.status === 'completed' ? 'bg-green-50 text-green-700 border-green-100' : 
                                                                    p.status === 'escrow_funded' ? 'bg-blue-50 text-blue-700 border-blue-100 shadow-sm animate-pulse' : 
                                                                    'bg-amber-50 text-amber-700 border-amber-100'
                                                                }`}>
                                                                    {p.status === 'completed' ? t('dashboard.statusCompleted') : 
                                                                     p.status === 'escrow_funded' ? t('dashboard.statusEscrowFunded') : 
                                                                     t('dashboard.statusPendingEscrow')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                                        {p.status === 'pending_escrow' && (
                                                            <button 
                                                                onClick={async () => {
                                                                    try {
                                                                        const { data } = await api.post('/transactions/stripe-checkout', { transactionId: p._id });
                                                                        if (data.url) window.location.href = data.url;
                                                                    } catch (err) { toast.error(err.response?.data?.message || "Stripe session failed"); }
                                                                }}
                                                                className="flex-1 md:flex-none px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-orange-500/20"
                                                            >
                                                                {t('dashboard.payAutoLanka')}
                                                            </button>
                                                        )}
                                                        {p.status === 'escrow_funded' && (
                                                            <button 
                                                                onClick={async () => {
                                                                    if (!window.confirm(t('dashboard.confirmReceipt') || "Confirm you have received the vehicle?")) return;
                                                                    try {
                                                                        await api.post('/transactions/confirm', { transactionId: p._id });
                                                                        toast.success(t('dashboard.confirmSuccess') || "Transaction completed!");
                                                                        fetchMyPurchases();
                                                                    } catch (err) { toast.error("Confirmation failed."); }
                                                                }}
                                                                className="flex-1 md:flex-none px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-green-500/20"
                                                            >
                                                                {t('dashboard.confirmReceipt')}
                                                            </button>
                                                        )}
                                                        {p.status === 'completed' && (
                                                            <button 
                                                                onClick={() => {
                                                                    setSelectedTransaction(p);
                                                                    setIsReviewModalOpen(true);
                                                                }}
                                                                className="flex-1 md:flex-none px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100 transition-all flex items-center gap-2"
                                                            >
                                                                <Star className="w-4 h-4" /> {t('dashboard.rateSeller')}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'requests' && (
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                        <Sparkles className="w-7 h-7 text-orange-500" /> {t('dashboard.requestsTitle')}
                                    </h3>
                                    <Link to="/request-vehicle" className="px-5 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-all">
                                        + {t('dashboard.requestsNew')}
                                    </Link>
                                </div>
                                <p className="text-gray-500 mb-8 font-medium">{t('dashboard.requestsDesc')}</p>
                                
                                {myRequests.length === 0 ? (
                                    <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50">
                                        <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Sparkles className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">{t('dashboard.noRequests')}</h4>
                                        <p className="text-gray-500 font-medium mb-8 max-w-sm mx-auto">{t('dashboard.noRequestsDesc')}</p>
                                        <Link to="/request-vehicle" className="px-8 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-md">{t('dashboard.createRequest')}</Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {myRequests.map((req) => (
                                            <div key={req._id} className={`p-6 rounded-2xl border transition-all ${req.status === 'matched' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="text-lg font-black text-gray-900 tracking-tight">{req.year} {req.make} {req.model}</h4>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-white border border-gray-200 rounded">{req.specs?.bodyType}</span>
                                                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-white border border-gray-200 rounded">{req.specs?.transmission}</span>
                                                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-white border border-gray-200 rounded">{req.specs?.fuelType}</span>
                                                            {req.maxPrice && <span className="text-[10px] font-black text-orange-600 px-2 py-0.5 bg-orange-50 border border-orange-100 rounded">Max: Rs. {req.maxPrice.toLocaleString()}</span>}
                                                        </div>
                                                    </div>
                                                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${req.status === 'matched' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                                        {req.status}
                                                    </span>
                                                </div>
                                                
                                                {req.status === 'matched' && req.matchedVehicle && (
                                                    <div className="mt-6 p-4 bg-white rounded-xl border border-green-200 flex items-center justify-between shadow-sm animate-pulse">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                                                <FileCheck className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-black text-green-600 uppercase tracking-widest">{t('dashboard.matchFound')}</p>
                                                                <p className="text-sm font-bold text-gray-900">{t('dashboard.matchReserved')}</p>
                                                            </div>
                                                        </div>
                                                        <Link to="/dashboard" onClick={() => setActiveTab('purchases')} className="text-xs font-black text-green-700 underline uppercase tracking-widest">{t('dashboard.goToPurchases')}</Link>
                                                    </div>
                                                )}

                                                {req.status === 'pending' && (
                                                    <button 
                                                        onClick={async () => {
                                                            if (window.confirm("Remove this matching request?")) {
                                                                await api.delete(`/vehicle-requests/${req._id}`);
                                                                fetchMyRequests();
                                                            }
                                                        }}
                                                        className="mt-4 text-[10px] font-bold text-red-400 hover:text-red-500 uppercase tracking-widest"
                                                    >
                                                        {t('dashboard.cancelRequest')}
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'listings' && (
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                        <Package className="w-7 h-7 text-orange-500" /> {t('dashboard.myListingsTitle')}
                                    </h3>
                                    <Link to="/sell" className="px-5 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-all">
                                        + {t('dashboard.listNew')}
                                    </Link>
                                </div>
                                {myListings.length === 0 ? (
                                    <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50">
                                        <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Car className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">{t('dashboard.noListings')}</h4>
                                        <p className="text-gray-500 font-medium mb-8 max-w-sm mx-auto">{t('dashboard.noListingsDesc')}</p>
                                        <Link to="/sell" className="px-8 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-md">List My Vehicle</Link>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {myListings.map((v) => (
                                            <div key={v._id} className="bg-white border border-gray-100 rounded-[2rem] p-6 hover:shadow-xl hover:border-orange-100 transition-all group">
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                                    <div className="flex gap-6">
                                                        <div className="w-32 h-32 rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative">
                                                            <img src={v.images?.[0] || 'https://via.placeholder.com/200'} alt={v.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                            <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-widest">{v.listingType}</div>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xl font-black text-gray-900 tracking-tight">{v.year} {v.make} {v.model}</h4>
                                                            <div className="flex items-center gap-3 mt-2">
                                                                <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${v.status === 'live' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>{v.status}</span>
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">VIN: {v.vin}</span>
                                                            </div>
                                                            
                                                            {v.auction && (
                                                                <div className="mt-4 flex flex-wrap items-center gap-6">
                                                                    <div>
                                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Bid</p>
                                                                        <p className="text-lg font-black text-orange-600">${v.auction.currentHighestBid?.toLocaleString() || v.auction.startPrice.toLocaleString()}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Reserve Status</p>
                                                                        {v.auction.currentHighestBid >= v.auction.reservePrice ? (
                                                                            <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">Met</span>
                                                                        ) : (
                                                                            <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">Below Reserve</span>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ends At</p>
                                                                        <p className="text-xs font-bold text-gray-900 flex items-center gap-1"><Clock className="w-3 h-3 text-gray-400" /> {new Date(v.auction.endTime).toLocaleDateString()}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                                                        {v.auction && v.auction.status === 'live' && (
                                                            <button 
                                                                disabled={isLoading}
                                                                onClick={() => handleCloseAuction(v.auction._id)}
                                                                className="flex-1 md:flex-none px-6 py-3 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-red-100 hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                                                            >
                                                                <Clock className="w-4 h-4" /> {t('dashboard.endEarly')}
                                                            </button>
                                                        )}
                                                        <Link to={v.listingType === 'auction' ? `/auctions/${v._id}` : `/direct-buy`} className="flex-1 md:flex-none px-6 py-3 bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-900 hover:text-white transition-all text-center">{t('dashboard.viewPublic')}</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'analytics' && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                
                                {/* Buyer Statistics Section */}
                                <section className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-px flex-1 bg-gray-100"></div>
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{t('dashboard.buyerInsights')}</h3>
                                        <div className="h-px flex-1 bg-gray-100"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                                            <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px] mb-1">{t('dashboard.totalSpent')}</p>
                                            <h3 className="text-4xl font-black text-gray-900">${buyerStats?.summary?.totalSpent?.toLocaleString() || 0}</h3>
                                        </div>
                                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                                            <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px] mb-1">{t('dashboard.vehiclesWon')}</p>
                                            <h3 className="text-4xl font-black text-gray-900">{buyerStats?.summary?.totalVehicles || 0}</h3>
                                        </div>
                                    </div>

                                    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                                        <h4 className="text-xl font-black text-gray-900 tracking-tight mb-8">{t('dashboard.purchaseHistory')}</h4>
                                        <div className="h-[300px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={buyerStats?.spendingTimeline}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                    <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} dy={10} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                                                    <Tooltip 
                                                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                                    />
                                                    <Area type="monotone" name={t('dashboard.chartAmount')} dataKey="amount" stroke="#3b82f6" strokeWidth={4} fillOpacity={0.1} fill="#3b82f6" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </section>

                                {/* Seller Statistics Section (Conditional) */}
                                {(user?.role === 'seller' || user?.role === 'admin') && (
                                    <section className="space-y-8 pt-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-px flex-1 bg-gray-100"></div>
                                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{t('dashboard.sellerAnalytics')}</h3>
                                            <div className="h-px flex-1 bg-gray-100"></div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                                                <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px] mb-1">{t('dashboard.totalEarnings')}</p>
                                                <h3 className="text-4xl font-black text-gray-900">${sellerStats?.summary?.totalEarnings?.toLocaleString() || 0}</h3>
                                            </div>
                                            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                                                <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px] mb-1">{t('dashboard.activeListings')}</p>
                                                <h3 className="text-4xl font-black text-gray-900">{sellerStats?.summary?.totalVehicles || 0}</h3>
                                            </div>
                                        </div>

                                        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                                            <h4 className="text-xl font-black text-gray-900 tracking-tight mb-8">{t('dashboard.salesPerformance')}</h4>
                                            <div className="h-[300px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={sellerStats?.earningsTimeline}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                        <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} dy={10} />
                                                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                                                        <Tooltip 
                                                            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                                        />
                                                        <Area type="monotone" name={t('dashboard.chartAmount')} dataKey="amount" stroke="#f97316" strokeWidth={4} fillOpacity={0.1} fill="#f97316" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </section>
                                )}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                {/* Profile Info */}
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                    <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                        <Settings className="w-7 h-7 text-blue-500" /> {t('dashboard.settingsTitle')}
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50">
                                            <h4 className="font-bold text-gray-900 mb-4">{t('dashboard.profileInfo')}</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('dashboard.fullNameLabel')}</label>
                                                    <input type="text" className="w-full bg-white border border-gray-200 p-3.5 rounded-xl outline-none font-medium" value={user?.name || ''} readOnly />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('dashboard.emailLabel')}</label>
                                                    <input type="email" className="w-full bg-white border border-gray-200 p-3.5 rounded-xl outline-none font-medium" value={user?.email || ''} readOnly />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Role</label>
                                                    <div className="bg-white border border-gray-200 p-3.5 rounded-xl">
                                                        <span className="bg-gray-900 text-white text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider">{user?.role}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">KYC Status</label>
                                                    <div className="bg-white border border-gray-200 p-3.5 rounded-xl">
                                                        {user?.kycStatus === 'approved' ? (
                                                            <span className="bg-green-100 text-green-700 text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1.5 w-fit"><ShieldCheck className="w-3.5 h-3.5" /> Verified</span>
                                                        ) : user?.kycStatus === 'pending' ? (
                                                            <span className="bg-amber-100 text-amber-700 text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1.5 w-fit"><Clock className="w-3.5 h-3.5" /> Pending</span>
                                                        ) : (
                                                            <span className="bg-red-100 text-red-700 text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider w-fit block">Unverified</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 border border-red-100 rounded-2xl bg-red-50/30">
                                            <h4 className="font-bold text-red-900 mb-2">{t('dashboard.dangerZone')}</h4>
                                            <p className="text-red-600/80 font-medium text-sm mb-4">{t('dashboard.deleteDesc')}</p>
                                            <button className="px-6 py-3 bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800 font-bold rounded-xl transition-colors">{t('dashboard.deleteBtn')}</button>
                                        </div>
                                    </div>
                                </div>

                                {/* KYC + Bank in Settings */}
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Identity Verification</p>
                                        <KYCUpload />
                                    </div>
                                    {user?.role === 'seller' && (
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Financial Account</p>
                                            <BankUpload />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
