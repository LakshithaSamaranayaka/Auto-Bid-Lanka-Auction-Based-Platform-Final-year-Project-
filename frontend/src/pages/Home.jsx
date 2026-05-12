import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Clock, ShieldCheck, Zap, User, ArrowRight, Activity, DollarSign, CheckCircle2, CarFront, LayoutGrid, Search, Star, Quote, Award, Globe, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const Home = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [liveAuctions, setLiveAuctions] = useState([]);
    const [realReviews, setRealReviews] = useState([]);
    const [searchMake, setSearchMake] = useState('Toyota');
    const [searchModel, setSearchModel] = useState('Prius');

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const { data } = await api.get('/vehicles/auction');
                setLiveAuctions(data);
            } catch (err) {
                console.error("Failed to fetch live auctions:", err);
            }
        };
        const fetchReviews = async () => {
            try {
                const { data } = await api.get('/reviews/latest');
                setRealReviews(data);
            } catch (err) {
                console.error("Failed to fetch latest reviews:", err);
            }
        };
        fetchAuctions();
        fetchReviews();
    }, []);

    const handleToggleWatchlist = async (vehicleId) => {
        try {
            const { data } = await api.post('/auth/toggle-watchlist', { vehicleId });
            toast.success(data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update watchlist");
        }
    };
    return (
        <div className="flex flex-col overflow-x-hidden">
            {/* 1. Hero Section + Search Bar */}
            <section className="relative min-h-[90vh] flex items-center bg-white overflow-hidden">
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-300/20 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-300/10 rounded-full blur-[120px]"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
                </div>

                <div className="container-fluid pt-20 pb-24 w-full">
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

                        <motion.div
                            initial={{ opacity: 0, x: -60 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-10"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-orange-50 text-orange-600 text-xs font-black uppercase tracking-[0.2em] shadow-sm border border-orange-100"
                            >
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                </span>
                                {t('home.badge')}
                            </motion.div>

                            <div className="space-y-4">
                                <motion.h1
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.8 }}
                                    className="text-4xl sm:text-5xl lg:text-[5.5rem] font-[1000] text-gray-900 tracking-[-0.04em] leading-[0.95]"
                                >
                                    {t('home.title1')} <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-orange-400 drop-shadow-sm leading-tight inline-block mt-2">
                                        {t('home.title2')}
                                    </span>
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    className="text-lg text-gray-500 max-w-lg leading-relaxed font-semibold italic opacity-80"
                                >
                                    {t('home.subtitle')}
                                </motion.p>
                            </div>

                            {/* Ultra Modern Search Form */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                                className="bg-white p-6 sm:p-4 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl sm:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100 sm:border-white/50 flex flex-col sm:flex-row gap-6 sm:gap-4 relative z-20 group"
                            >
                                <div className="flex-1 space-y-1 sm:px-4 sm:border-r border-gray-100">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">{t('home.searchMake')}</label>
                                    <select 
                                        value={searchMake}
                                        onChange={(e) => setSearchMake(e.target.value)}
                                        className="bg-transparent w-full outline-none font-bold text-gray-900 cursor-pointer text-lg sm:text-base"
                                    >
                                        <option value="">{t('home.allMakes') || 'All Makes'}</option>
                                        <option value="Toyota">Toyota</option>
                                        <option value="Honda">Honda</option>
                                        <option value="Tesla">Tesla</option>
                                        <option value="Nissan">Nissan</option>
                                        <option value="Mitsubishi">Mitsubishi</option>
                                        <option value="Ford">Ford</option>
                                        <option value="Audi">Audi</option>
                                        <option value="BMW">BMW</option>
                                    </select>
                                </div>
                                <div className="flex-1 space-y-1 sm:px-4 sm:border-r border-gray-100">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">{t('home.searchModel')}</label>
                                    <select 
                                        value={searchModel}
                                        onChange={(e) => setSearchModel(e.target.value)}
                                        className="bg-transparent w-full outline-none font-bold text-gray-900 cursor-pointer text-lg sm:text-base"
                                    >
                                        <option value="">{t('home.allModels') || 'All Models'}</option>
                                        <option value="Prius">Prius</option>
                                        <option value="Insight">Insight</option>
                                        <option value="Model 3">Model 3</option>
                                        <option value="Leaf">Leaf</option>
                                        <option value="Outlander">Outlander</option>
                                        <option value="Mach-E">Mach-E</option>
                                        <option value="e-tron">e-tron</option>
                                    </select>
                                </div>
                                <button 
                                    onClick={() => navigate(`/auctions?make=${searchMake}&model=${searchModel}`)}
                                    className="bg-gray-900 hover:bg-orange-600 text-white rounded-[1.5rem] sm:rounded-[1.8rem] px-8 py-4 sm:px-10 sm:py-5 font-black transition-all duration-500 flex items-center justify-center gap-3 shadow-xl hover:shadow-orange-500/40"
                                >
                                    <Search className="w-5 h-5 text-orange-400" /> {t('home.searchBtn')}
                                </button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.9 }}
                                className="flex items-center gap-8 pt-4"
                            >
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                                            <img src={`https://i.pravatar.cc/100?u=${i*10}`} alt="User" />
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-white bg-orange-500 flex items-center justify-center text-[10px] font-black text-white shadow-sm">+1k</div>
                                </div>
                                <p className="text-sm font-bold text-gray-400">Trusted by over <span className="text-gray-900 underline decoration-orange-500/50">1,200+ enthusiasts</span> in SL</p>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="relative lg:block hidden"
                            initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="absolute -inset-10 bg-gradient-to-tr from-orange-500/20 to-transparent blur-[100px] -z-10 animate-pulse"></div>
                            <div className="relative group">
                                <div className="absolute -inset-2 bg-gradient-to-tr from-orange-400 to-amber-300 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <div className="bg-white p-3 rounded-[3.5rem] shadow-2xl border border-white/50 relative overflow-hidden">
                                     <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=2692&auto=format&fit=crop" alt="Hero Car" className="rounded-[3rem] object-cover w-full h-[550px]" />
                                     
                                     {/* Floating Price Tag */}
                                     <motion.div
                                        animate={{ y: [0, -15, 0] }}
                                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                        className="absolute top-10 right-10 bg-white/90 backdrop-blur-md px-6 py-4 rounded-[2rem] shadow-2xl border border-white flex flex-col items-center"
                                     >
                                         <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Starting Bid</span>
                                         <span className="text-3xl font-black text-gray-900">Rs. 8,500,000</span>
                                     </motion.div>

                                     {/* Floating Status */}
                                     <div className="absolute bottom-10 left-10 bg-gray-900/90 backdrop-blur-md px-6 py-4 rounded-[2rem] shadow-2xl border border-white/10 flex items-center gap-4">
                                         <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center animate-pulse">
                                             <Activity className="w-5 h-5 text-white" />
                                         </div>
                                         <div>
                                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Status</p>
                                             <p className="text-sm font-black text-white">12 Bids Active</p>
                                         </div>
                                     </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 1.5 Categories (Body Types) */}
            <section className="py-24 bg-white">
                <div className="container-fluid">

                    <div className="text-center mb-16">
                        <h3 className="text-sm font-black text-orange-500 uppercase tracking-[0.3em] mb-4">Discovery</h3>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">{t('home.browseByBody')}</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {['Sedan', 'SUV', 'Hatchback', 'Coupe'].map((type, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                key={type}
                                onClick={() => navigate(`/direct-buy?category=${type}`)}
                                className="group bg-white p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] text-center cursor-pointer transition-all duration-500 hover:shadow-xl border border-gray-100 hover:border-orange-200 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-[3] transition-transform duration-700"></div>
                                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gray-50 rounded-2xl sm:rounded-3xl shadow-inner flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:shadow-orange-200 transition-all duration-500 group-hover:-translate-y-2">
                                    <CarFront className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 group-hover:text-white" />
                                </div>
                                <h4 className="font-black text-xl text-gray-900 mb-2">{type}</h4>
                                <p className="text-orange-600 text-xs font-black uppercase tracking-widest">{t('home.vehiclesCount')}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 2. How It Works Section */}
            <section className="py-32 bg-gray-50 relative overflow-hidden">
                <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -translate-x-1/2"></div>
                <div className="container-fluid">

                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <div className="inline-flex justify-center items-center gap-3 px-5 py-2 bg-gray-900 text-orange-400 rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase mb-6 shadow-xl border border-white/10">
                            <Zap className="w-4 h-4 fill-orange-400" /> {t('home.processBadge')}
                        </div>
                        <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight leading-tight">{t('home.howItWorks')}</h2>
                        <p className="text-lg text-gray-500 font-semibold max-w-lg mx-auto leading-relaxed">{t('home.processSub')}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-16 relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent -translate-y-1/2 hidden md:block -z-0"></div>

                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="relative text-center group z-10">
                            <div className="w-28 h-28 mx-auto bg-white border border-gray-100 shadow-[0_20px_40px_-8px_rgba(0,0,0,0.1)] rounded-[2.5rem] flex items-center justify-center mb-8 group-hover:bg-gray-900 group-hover:-translate-y-3 group-hover:shadow-gray-900/30 transition-all duration-500">
                                <ShieldCheck className="w-12 h-12 text-orange-500 group-hover:text-white transition-colors" />
                                <span className="absolute -top-4 -right-4 w-10 h-10 bg-orange-500 text-white rounded-2xl flex items-center justify-center font-black shadow-lg">01</span>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4">{t('home.step1')}</h3>
                            <p className="text-gray-500 font-bold leading-relaxed">{t('home.step1Sub')}</p>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="relative text-center group z-10">
                            <div className="w-28 h-28 mx-auto bg-white border border-gray-100 shadow-[0_20px_40px_-8px_rgba(0,0,0,0.1)] rounded-[2.5rem] flex items-center justify-center mb-8 group-hover:bg-gray-900 group-hover:-translate-y-3 group-hover:shadow-gray-900/30 transition-all duration-500">
                                <Activity className="w-12 h-12 text-blue-500 group-hover:text-white transition-colors" />
                                <span className="absolute -top-4 -right-4 w-10 h-10 bg-blue-500 text-white rounded-2xl flex items-center justify-center font-black shadow-lg">02</span>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4">{t('home.step2')}</h3>
                            <p className="text-gray-500 font-bold leading-relaxed">{t('home.step2Sub')}</p>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="relative text-center group z-10">
                            <div className="w-28 h-28 mx-auto bg-white border border-gray-100 shadow-[0_20px_40px_-8px_rgba(0,0,0,0.1)] rounded-[2.5rem] flex items-center justify-center mb-8 group-hover:bg-gray-900 group-hover:-translate-y-3 group-hover:shadow-gray-900/30 transition-all duration-500">
                                <CarFront className="w-12 h-12 text-green-500 group-hover:text-white transition-colors" />
                                <span className="absolute -top-4 -right-4 w-10 h-10 bg-green-500 text-white rounded-2xl flex items-center justify-center font-black shadow-lg">03</span>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4">{t('home.step3')}</h3>
                            <p className="text-gray-500 font-bold leading-relaxed">{t('home.step3Sub')}</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* NEW: Stats Section */}
            <section className="py-24 bg-white">
                <div className="container-fluid">

                    <div className="bg-gray-900 rounded-[3.5rem] p-12 lg:p-20 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-[100px]"></div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                            {[
                                { icon: <CarFront className="w-8 h-8" />, count: "1,200+", label: "Vehicles Sold" },
                                { icon: <User className="w-8 h-8" />, count: "8k+", label: "Happy Users" },
                                { icon: <Globe className="w-8 h-8" />, count: "25+", label: "Auction Centers" },
                                { icon: <Award className="w-8 h-8" />, count: "99%", label: "Trust Score" }
                            ].map((stat, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="text-center space-y-4"
                                >
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-orange-400 border border-white/10 group-hover:scale-110 transition-transform">
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-2xl sm:text-4xl font-[1000] text-white tracking-tight">{stat.count}</h4>
                                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] sm:text-xs mt-1">{stat.label}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 2.5 Educational Section - Why AutoBid? */}
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="container-fluid">

                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
                            <div className="absolute -inset-10 bg-blue-500/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
                            <div className="relative group">
                                <img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000" alt="Security" className="rounded-[3rem] shadow-[0_48px_80px_-16px_rgba(0,0,0,0.15)] border border-gray-100 object-cover h-[600px] w-full group-hover:scale-[1.02] transition-transform duration-700" />
                                <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 max-w-xs transform group-hover:-translate-y-5 transition-transform duration-500">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/40">
                                            <ShieldCheck className="w-7 h-7" />
                                        </div>
                                        <h4 className="font-black text-gray-900 leading-tight">{t('home.secureBadge')}</h4>
                                    </div>
                                    <p className="text-sm text-gray-400 font-bold leading-relaxed">{t('home.secureDesc')}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-10">
                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em]">{t('home.differenceBadge')}</h3>
                                <h2 className="text-5xl md:text-6xl font-[1000] text-gray-900 tracking-tight leading-[0.95]">
                                    {t('home.differenceTitle')} <br /> 
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 italic">
                                        {t('home.differenceTitle2')}
                                    </span>
                                </h2>
                                <p className="text-xl text-gray-400 leading-relaxed font-semibold opacity-80 pt-4">
                                    {t('home.differenceSubtitle')}
                                </p>
                            </div>

                            <div className="grid gap-8 pt-4">
                                {[
                                    { icon: <User className="w-6 h-6" />, title: t('home.kycTitle'), desc: t('home.kycDesc'), color: 'indigo' },
                                    { icon: <DollarSign className="w-6 h-6" />, title: t('home.escrowTitle'), desc: t('home.escrowDesc'), color: 'green' },
                                    { icon: <Activity className="w-6 h-6" />, title: t('home.snipingTitle'), desc: t('home.snipingDesc'), color: 'orange' }
                                ].map((item, idx) => (
                                    <motion.div 
                                        key={idx}
                                        whileHover={{ x: 10 }}
                                        className="flex gap-6 group cursor-default"
                                    >
                                        <div className={`w-16 h-16 shrink-0 bg-${item.color}-50 rounded-2xl flex items-center justify-center border border-${item.color}-100 shadow-sm group-hover:bg-gray-900 group-hover:border-gray-800 transition-all duration-300`}>
                                            <div className={`text-${item.color}-500 group-hover:text-white transition-colors`}>{item.icon}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                                            <p className="text-gray-500 font-bold leading-relaxed opacity-80">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. Live Auctions / Ending Soon Preview Section */}
            <section className="py-32 bg-[#0a0a0c] relative overflow-hidden">
                {/* Dark Luxury Accents */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
 
                <div className="container-fluid">

                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div className="max-w-2xl">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-red-500/10 text-red-500 font-black text-[10px] uppercase tracking-[0.3em] mb-6 border border-red-500/20"
                            >
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                {t('home.endingSoon')}
                            </motion.div>
                            <h2 className="text-5xl md:text-6xl font-[1000] text-white tracking-tight leading-none mb-6">{t('home.activeAuctions')}</h2>
                            <p className="text-gray-500 font-bold text-xl opacity-80">{t('home.realTimeDesc')}</p>
                        </div>
                        <Link to="/auctions" className="group flex items-center gap-4 bg-white/5 hover:bg-orange-500 text-white px-8 py-4 rounded-2xl font-black transition-all duration-500 border border-white/10 hover:border-orange-500 hover:-translate-y-2">
                            {t('home.viewAllVehicles')} <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {liveAuctions.length === 0 ? (
                            <div className="col-span-full text-center py-32 bg-white/5 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 shadow-2xl">
                                <Activity className="w-20 h-20 text-gray-700 mx-auto mb-8 animate-pulse" />
                                <h3 className="text-3xl font-black text-white mb-4">{t('home.noAuctions')}</h3>
                                <p className="text-gray-500 font-bold text-lg">{t('home.noAuctionsSub')}</p>
                            </div>
                        ) : (
                            liveAuctions.slice(0, 3).map((auction, i) => (
                                <motion.div
                                    key={auction._id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group relative bg-[#1c1c1f] rounded-[3rem] overflow-hidden border border-white/5 hover:border-orange-500/30 transition-all duration-700 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]"
                                >
                                    <div className="relative h-72 overflow-hidden">
                                        <img
                                            src={auction.vehicle?.images?.[0] || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800'}
                                            alt="Car"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out opacity-80 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1f] via-transparent to-transparent opacity-90"></div>
                                        
                                        {/* Status Badge */}
                                        <div className="absolute top-6 left-6 z-20">
                                            <div className="bg-black/40 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{t('home.liveNowBadge')}</span>
                                            </div>
                                        </div>

                                        {/* Hover Action Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30">
                                            <Link to={`/auctions/${auction.vehicle?._id}`} className="bg-orange-500 text-white px-10 py-5 rounded-[2rem] font-[1000] text-lg shadow-2xl shadow-orange-500/50 hover:bg-orange-600 transition-all hover:scale-110 active:scale-95">
                                                {t('home.bidNow')}
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="p-10 space-y-8">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <p className="text-orange-500 text-[11px] font-[1000] uppercase tracking-[0.4em]">{auction.vehicle?.make}</p>
                                                <h3 className="text-3xl font-[1000] text-white tracking-tight">{auction.vehicle?.year} {auction.vehicle?.model}</h3>
                                            </div>
                                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-orange-500/50 transition-colors">
                                                <Star className="w-5 h-5 text-gray-500 group-hover:text-orange-500 transition-colors" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/5 p-4 rounded-3xl border border-white/10 flex flex-col items-center justify-center space-y-1">
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('home.currentBid')}</span>
                                                <span className="text-2xl font-black text-white tracking-tight">Rs. {(auction.currentHighestBid || auction.startPrice).toLocaleString()}</span>
                                            </div>
                                            <div className="bg-orange-500/10 p-4 rounded-3xl border border-orange-500/20 flex flex-col items-center justify-center space-y-1">
                                                <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Ending In</span>
                                                <span className="text-lg font-black text-white uppercase flex items-center gap-2"><Clock className="w-4 h-4" /> 2d 4h</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}

                        {/* Ultra Premium More Info Card */}
                        {liveAuctions.length > 2 && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }} 
                                whileInView={{ opacity: 1, scale: 1 }} 
                                className="relative bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[3.5rem] p-12 overflow-hidden group shadow-2xl lg:block hidden"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                                <div className="relative z-10 flex flex-col h-full justify-between items-center text-center">
                                    <div className="w-24 h-24 bg-white/20 backdrop-blur-3xl rounded-[2rem] flex items-center justify-center border border-white/30 shadow-2xl mb-8 group-hover:scale-110 transition-transform">
                                        <Zap className="w-12 h-12 text-white fill-white" />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-3xl font-[1000] text-white tracking-tight leading-none">{t('home.dozensMore')}</h3>
                                        <p className="text-blue-100 font-bold opacity-80">{t('home.dozensMoreSub')}</p>
                                    </div>
                                    <Link to="/auctions" className="mt-10 group/btn bg-white text-indigo-700 px-10 py-5 rounded-[2rem] font-black text-lg transition-all shadow-2xl hover:bg-gray-100 hover:-translate-y-2 flex items-center gap-3">
                                        {t('home.enterAction')} <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            {/* 4. Direct Buy Selection */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="container-fluid">

                    <div className="bg-orange-50 rounded-[4rem] p-12 lg:p-24 relative overflow-hidden border border-orange-100 shadow-[0_48px_96px_-24px_rgba(249,115,22,0.15)]">
                        {/* Decorative Circles */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-200/20 rounded-full -translate-x-1/2 translate-y-1/2 blur-2xl"></div>

                        <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
                            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-10">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-2xl text-orange-600 font-[1000] text-[10px] uppercase tracking-[0.3em] shadow-sm border border-orange-100">
                                        <DollarSign className="w-4 h-4" /> {t('directBuy.badge')}
                                    </div>
                                    <h2 className="text-5xl md:text-7xl font-[1000] text-gray-900 tracking-[-0.04em] leading-[0.9]">
                                        {t('home.directBuyHeader')} <br /> 
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 italic">
                                            {t('home.directBuyHeader2')}
                                        </span>
                                    </h2>
                                    <p className="text-xl text-gray-400 leading-relaxed font-bold opacity-80 pt-4">
                                        {t('home.directBuySub')}
                                    </p>
                                </div>

                                <ul className="grid gap-6">
                                    {[t('home.directBuyLi1'), t('home.directBuyLi2'), t('home.directBuyLi3')].map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-4 text-gray-900 font-extrabold text-xl">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-green-500 shadow-sm border border-orange-100">
                                                <CheckCircle2 className="w-6 h-6" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <div className="pt-6">
                                    <Link to="/direct-buy" className="group/btn inline-flex items-center justify-center gap-4 px-12 py-6 bg-gray-900 hover:bg-orange-600 text-white font-black text-xl rounded-[2rem] transition-all shadow-2xl hover:shadow-orange-500/40 hover:-translate-y-2">
                                        {t('home.directBuyBtn')} <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-3 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative">
                                <div className="grid grid-cols-2 gap-8">
                                    {/* Premium Decor Cards */}
                                    <div className="bg-white p-3 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-orange-100 transform -rotate-6 hover:rotate-0 hover:scale-110 transition-all duration-700 z-10 translate-y-12">
                                        <div className="relative rounded-[2rem] overflow-hidden mb-4 h-45">
                                            <img src="https://tse2.mm.bing.net/th/id/OIP._NJHr1rwHJESfdPttlSk5AHaE8?w=1920&h=1280&rs=1&pid=ImgDetMain&o=7&rm=3" alt="Car" className="w-full h-full object-cover" />
                                            <div className=" bg-gradient-to-t from-black/20 to-transparent"></div>
                                        </div>
                                        <h4 className="font-black text-gray-900 text-lg mb-4">Mustang Mach-E</h4>
                                        <div className="flex justify-between items-center bg-white p-4 rounded-2xl">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Buy Now</span>
                                            <span className="text-xl font-black text-orange-600">Rs. 12,800,000</span>
                                        </div>
                                    </div>

                                    <div className="bg-white p-3 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-orange-100 transform rotate-6 hover:rotate-0 hover:scale-110 transition-all duration-700 z-20 -translate-y-6">
                                        <div className="relative rounded-[2rem] overflow-hidden mb-4 h-40">
                                            <img src="https://static0.topspeedimages.com/wordpress/wp-content/uploads/2022/11/Clip022800_00_19_01Still001.jpg?q=50&amp;fit=contain&amp;w=755&amp;h=430&amp;dpr=1.5" alt="Car" className="w-full h-full object-cover" />
                                            <div className=" bg-gradient-to-t from-black/20 to-transparent"></div>
                                        </div>
                                        <h4 className="font-black text-gray-900 text-lg mb-4">Audi Q4 e-tron</h4>
                                        <div className="flex justify-between items-center bg-white p-4 rounded-2xl">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Buy Now</span>
                                            <span className="text-xl font-black text-orange-600">Rs. 16,200,000</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Trust Signals & Testimonials */}
            <section className="py-32 bg-white overflow-hidden relative">
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -z-10"></div>
                <div className="container-fluid">

                    <div className="text-center max-w-3xl mx-auto mb-24">
                        <motion.h3 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-sm font-black text-orange-600 uppercase tracking-[0.4em] mb-6"
                        >
                            Testimonials
                        </motion.h3>
                        <h2 className="text-5xl md:text-6xl font-[1000] text-gray-900 mb-6 tracking-tight leading-[1.1]">{t('home.trustTitle')}</h2>
                        <p className="text-xl text-gray-400 font-bold opacity-80">{t('home.trustSub')}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10 items-stretch">
                        {realReviews.length > 0 ? (
                            realReviews.slice(0, 3).map((review, i) => (
                                <motion.div
                                    key={review._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.8 }}
                                    className={`rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 border shadow-lg relative flex flex-col justify-between transition-all duration-700 hover:-translate-y-4 group overflow-hidden ${i === 1 ? 'bg-gray-900 border-gray-800 shadow-2xl md:-translate-y-8' : 'bg-white border-orange-100 hover:border-orange-300'}`}
                                >
                                    {/* Decorative Blob */}
                                    <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 group-hover:scale-150 transition-transform duration-1000 ${i === 1 ? 'bg-orange-500' : 'bg-blue-500'}`}></div>

                                    <div>
                                        <Quote className={`w-12 h-12 mb-8 ${i === 1 ? 'text-gray-800' : 'text-orange-50'}`} />
                                        <div className="flex gap-1.5 mb-8 relative z-10">
                                            {[...Array(5)].map((_, starI) => (
                                                <Star key={starI} className={`w-5 h-5 ${starI < review.rating ? (i === 1 ? 'fill-orange-500 text-orange-500' : 'fill-orange-400 text-orange-400') : 'text-gray-200'}`} />
                                            ))}
                                        </div>
                                        <p className={`text-xl leading-relaxed font-bold mb-12 relative z-10 tracking-tight ${i === 1 ? 'text-white' : 'text-gray-900 opacity-90'}`}>
                                            "{review.comment}"
                                        </p>
                                    </div>

                                    <div className={`flex items-center gap-5 pt-8 border-t relative z-10 ${i === 1 ? 'border-white/10' : 'border-gray-50'}`}>
                                        <div className={`w-16 h-16 rounded-[1.2rem] flex items-center justify-center font-black text-xl text-white shadow-2xl transition-transform group-hover:rotate-12 ${i === 1 ? 'bg-gradient-to-tr from-orange-600 to-amber-500 border border-orange-400' : 'bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-400'}`}>
                                            {review.reviewer?.name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <h4 className={`font-[1000] text-lg ${i === 1 ? 'text-white' : 'text-gray-900'}`}>{review.reviewer?.name}</h4>
                                            <p className={`${i === 1 ? 'text-blue-400' : 'text-orange-500'} text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mt-1`}>
                                                <ShieldCheck className="w-4 h-4" /> 
                                                {review.reviewerRole === 'buyer' ? 'Verified Buyer' : 'Top Seller'}
                                                {review.transaction?.vehicle && (
                                                    <span className="opacity-50">• {review.transaction.vehicle.make}</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            // Legacy Fallback (Ultra Styled)
                            [1, 2, 3].map((_, i) => (
                                <motion.div key={i} className={`rounded-[3rem] p-12 border border-gray-100 shadow-xl bg-white flex flex-col justify-center items-center text-center ${i === 1 ? 'md:-translate-y-8 bg-gray-50' : ''}`}>
                                     <Activity className="w-12 h-12 text-orange-200 mb-6" />
                                     <p className="text-gray-400 font-bold italic">Join our community and leave the first review!</p>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* NEW: Newsletter Section */}
            <section className="py-24 bg-gray-50">
                <div className="container-fluid">

                    <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-[4rem] p-12 lg:p-24 relative overflow-hidden shadow-[0_48px_96px_-24px_rgba(249,115,22,0.3)]">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-10">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-3xl rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl">
                                <Mail className="w-10 h-10 text-white" />
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-4xl lg:text-6xl font-[1000] text-white tracking-tight leading-tight">
                                    Join the Inner Circle
                                </h1>
                                <p className="text-orange-100 text-xl font-bold opacity-90">
                                    Get exclusive access to hot listings, hidden gems, and auction alerts before everyone else.
                                </p>
                            </div>
                            <div className="w-full max-w-md flex flex-col sm:flex-row gap-4">
                                <input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    className="flex-1 px-8 py-5 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder:text-orange-100/70 outline-none focus:ring-4 focus:ring-white/10 transition-all font-bold text-lg"
                                />
                                <button className="bg-white text-orange-600 px-10 py-5 rounded-[2rem] font-[1000] text-lg hover:bg-gray-100 transition-all shadow-2xl hover:-translate-y-1 active:scale-95 whitespace-nowrap">
                                    Subscribe Now
                                </button>
                            </div>
                            <p className="text-orange-100/60 text-sm font-bold tracking-wide">
                                NO SPAM. JUST LUXURY CARS. UNSUBSCRIBE ANYTIME.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
