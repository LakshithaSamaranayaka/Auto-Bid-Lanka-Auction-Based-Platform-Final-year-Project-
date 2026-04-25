import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Clock, Users, ArrowRight, Activity, Zap } from 'lucide-react';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

const Auctions = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const [auctions, setAuctions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('model') || searchParams.get('make') || '');
    const [isFilterOpen, setIsFilterOpen] = useState(!!searchParams.get('category') || !!searchParams.get('fuel'));
    
    // Filter states
    const [bodyType, setBodyType] = useState(searchParams.get('category') || '');
    const [fuelType, setFuelType] = useState(searchParams.get('fuel') || '');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const fetchLiveAuctions = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (bodyType) params.append('bodyType', bodyType);
            if (fuelType) params.append('fuelType', fuelType);
            if (minPrice) params.append('minPrice', minPrice);
            if (maxPrice) params.append('maxPrice', maxPrice);

            const { data } = await api.get(`/vehicles/auction?${params.toString()}`);
            setAuctions(data);
        } catch (err) {
            console.error('Failed to load live auctions', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLiveAuctions();
    }, [bodyType, fuelType, minPrice, maxPrice]);

    const filteredAuctions = auctions.filter(a =>
        a.vehicle?.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.vehicle?.model.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container-fluid py-6 sm:py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12 gap-6">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 text-[10px] sm:text-xs font-black uppercase rounded-full tracking-wider mb-3">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        {t('auctions.liveBadge')}
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-[1000] text-gray-900 mb-3 tracking-tight leading-tight">{t('auctions.title')}</h1>
                    <p className="text-gray-500 text-base sm:text-xl font-medium opacity-80">{t('auctions.subtitle')}</p>
                </div>


                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72 lg:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={t('auctions.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all bg-white font-bold text-sm sm:text-base shadow-sm"
                        />
                    </div>
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-2 px-5 sm:px-6 py-4 border rounded-2xl font-black transition-all shrink-0 shadow-sm ${isFilterOpen ? 'bg-gray-900 border-gray-900 text-white shadow-xl shadow-gray-900/20' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                    >
                        <Filter className="w-5 h-5" />
                        <span className="hidden sm:inline">{t('auctions.filters')}</span>
                    </button>
                </div>
            </div>

            {/* Expanded Filters */}
            {isFilterOpen && (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-top-4 duration-300">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Body Type</label>
                        <select 
                            value={bodyType} 
                            onChange={(e) => setBodyType(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 font-bold text-gray-700 focus:ring-2 focus:ring-orange-500/20"
                        >
                            <option value="">All Types</option>
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="Hatchback">Hatchback</option>
                            <option value="Coupe">Coupe</option>
                            <option value="Van">Van</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Fuel Type</label>
                        <select 
                            value={fuelType} 
                            onChange={(e) => setFuelType(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 font-bold text-gray-700 focus:ring-2 focus:ring-orange-500/20"
                        >
                            <option value="">Any Fuel</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                            <option value="Electric">Electric</option>
                            <option value="Petrol">Petrol</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Min Price (Rs.)</label>
                        <input 
                            type="number" 
                            placeholder="0"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 font-bold text-gray-700 focus:ring-2 focus:ring-orange-500/20"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Max Price (Rs.)</label>
                        <input 
                            type="number" 
                            placeholder="10,000,000+"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 font-bold text-gray-700 focus:ring-2 focus:ring-orange-500/20"
                        />
                    </div>
                    <div className="md:col-span-4 flex justify-end">
                        <button 
                            onClick={() => {
                                setBodyType('');
                                setFuelType('');
                                setMinPrice('');
                                setMaxPrice('');
                            }}
                            className="text-xs font-bold text-orange-600 hover:underline"
                        >
                            Clear All Filters
                        </button>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-500 font-medium tracking-wide">{t('auctions.loading')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                    {filteredAuctions.map((auction) => (
                        <div key={auction._id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col hover:-translate-y-2">
                            <div className="relative aspect-[16/11] overflow-hidden">
                                <img
                                    src={auction.vehicle?.images[0] || 'https://via.placeholder.com/800'}
                                    alt={`${auction.vehicle?.year} ${auction.vehicle?.make}`}
                                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                                    <Activity className="w-3 h-3 text-red-500" /> {t('auctions.live')}
                                </div>
                            </div>
 
                            <div className="p-6 sm:p-8 flex flex-col flex-1">
                                <div className="mb-6">
                                    <div className="flex gap-2 mb-2">
                                        <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-orange-50 text-orange-600 rounded border border-orange-100">{auction.vehicle?.specs?.bodyType}</span>
                                        <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100">{auction.vehicle?.specs?.fuelType}</span>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 group-hover:text-orange-600 transition-colors tracking-tight leading-tight">
                                        {auction.vehicle?.year} {auction.vehicle?.make} {auction.vehicle?.model}
                                    </h3>
                                </div>
 
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 transition-colors group-hover:bg-orange-50/50 group-hover:border-orange-100">
                                        <p className="text-[10px] text-gray-400 font-extrabold mb-1 uppercase tracking-widest">{t('auctions.currentBid')}</p>
                                        <p className="text-xl font-black text-gray-900 tracking-tighter">Rs. {(auction.currentHighestBid || auction.startPrice || 0).toLocaleString()}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 transition-colors group-hover:bg-gray-100">
                                        <p className="text-[10px] text-gray-400 font-extrabold mb-1 uppercase tracking-widest">{t('auctions.endsOn')}</p>
                                        <div className="flex items-center gap-1.5 text-gray-900 font-black font-mono text-xs">
                                            <Clock className="w-4 h-4 text-orange-500" />
                                            {new Date(auction.endTime).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
 
                                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                        <Zap className="w-3 h-3 text-orange-400 animate-pulse" /> {t('auctions.autoExtend')}
                                    </div>
                                    <Link to={`/auctions/${auction.vehicle?._id}`} className="group/link inline-flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl font-black text-xs transition-all hover:bg-orange-600 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1">
                                        {t('auctions.placeBid')} <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
 
                    {filteredAuctions.length === 0 && (
                        <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-4xl shadow-inner">
                                🏁
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">{t('auctions.noAuctionsTitle')}</h3>
                            <p className="text-gray-500 font-medium max-w-sm">{t('auctions.noAuctionsSub')}</p>
                        </div>
                    )}
                </div>

            )}
        </div>
    );
};

export default Auctions;
