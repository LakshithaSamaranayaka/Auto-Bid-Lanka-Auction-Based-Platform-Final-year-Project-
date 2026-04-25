import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronRight, Car, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

const AuctionCalendar = () => {
    const { t } = useTranslation();
    const [auctions, setAuctions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAllAuctions = async () => {
            try {
                // Fetch all auctions (live/upcoming)
                const { data } = await api.get('/vehicles/auction');
                setAuctions(data);
            } catch (err) {
                console.error("Failed to fetch auction calendar:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllAuctions();
    }, []);

    const filtered = auctions.filter(a => 
        `${a.vehicle?.make} ${a.vehicle?.model}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group auctions by Date
    const grouped = filtered.reduce((acc, auction) => {
        const date = new Date(auction.endTime).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        if (!acc[date]) acc[date] = [];
        acc[date].push(auction);
        return acc;
    }, {});

    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));

    return (
        <div className="container-fluid py-16">

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 text-orange-600 font-black uppercase tracking-widest text-xs mb-2">
                        <CalendarIcon className="w-4 h-4" /> Platform Schedule
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Auction Calendar</h1>
                    <p className="text-gray-500 font-medium mt-1">Plan your bids across upcoming vehicle closes.</p>
                </div>
                
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                        type="text"
                        placeholder="Search calendar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500/20 outline-none font-bold"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
                </div>
            ) : sortedDates.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                    <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900">No scheduled auctions found</h3>
                    <p className="text-gray-500 mt-1">Check back later for new vehicle listings.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {sortedDates.map(date => (
                        <div key={date}>
                            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
                                {date}
                                <span className="flex-1 h-px bg-gray-100"></span>
                            </h2>
                            <div className="grid gap-4">
                                {grouped[date].map(auction => (
                                    <Link 
                                        key={auction._id}
                                        to={`/auctions/${auction.vehicle?._id}`}
                                        className="group bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-orange-200 flex flex-col md:flex-row items-center gap-6 transition-all"
                                    >
                                        <div className="w-full md:w-32 h-24 rounded-xl overflow-hidden shrink-0">
                                            <img src={auction.vehicle?.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Car" />
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-1">
                                                <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-orange-50 text-orange-600 rounded-md">{auction.vehicle?.year}</span>
                                                <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md">{auction.vehicle?.specs?.fuelType}</span>
                                            </div>
                                            <h3 className="text-xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">
                                                {auction.vehicle?.make} {auction.vehicle?.model}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-8 px-6 text-center md:text-right border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Current Bid</p>
                                                <p className="text-lg font-black text-gray-900">${(auction.currentHighestBid || auction.startPrice).toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Closing At</p>
                                                <div className="flex items-center justify-center md:justify-end gap-1.5 text-orange-600 font-bold">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(auction.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                            <div className="hidden lg:block">
                                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all text-gray-400 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                                                    <ChevronRight className="w-6 h-6" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AuctionCalendar;
