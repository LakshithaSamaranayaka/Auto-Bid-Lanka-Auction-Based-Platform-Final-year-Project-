import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
    TrendingUp, DollarSign, Activity, Users, Car, ShieldAlert, LayoutDashboard, 
    ArrowUpRight, ArrowDownRight, Package 
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts';
import api from '../services/api';
import toast from 'react-hot-toast';

const SuperAdminAnalytics = () => {
    const { user } = useSelector((state) => state.auth);
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await api.get('/transactions/admin/analytics');
                setAnalytics(data);
            } catch (err) {
                console.error("Failed to fetch analytics:", err);
                toast.error("Failed to load telemetry data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (user?.role !== 'admin') {
        return (
            <div className="max-w-3xl mx-auto px-4 py-32 text-center flex flex-col items-center min-h-screen">
                <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8 shadow-xl border border-red-100">
                    <ShieldAlert className="w-12 h-12" />
                </div>
                <h2 className="text-5xl font-black text-gray-900 tracking-tight">Analytics Restricted</h2>
                <p className="text-xl text-gray-500 font-medium mt-4 max-w-lg mb-8">Only Platform Admins can access financial telemetry data.</p>
                <Link to="/dashboard" className="px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold shadow-xl transition-all hover:-translate-y-1">Return to Dashboard</Link>
            </div>
        );
    }

    const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];
    
    // Aggregates for Top Cards
    const totalVolume = analytics?.salesTimeline?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
    const totalProfit = analytics?.salesTimeline?.reduce((acc, curr) => acc + (curr.profit || 0), 0) || 0;
    const totalNewUsers = analytics?.userTimeline?.reduce((acc, curr) => acc + curr.count, 0) || 0;
    const totalSales = analytics?.salesTimeline?.reduce((acc, curr) => acc + curr.count, 0) || 0;
    const avgOrderValue = totalSales > 0 ? Math.round(totalVolume / totalSales) : 0;

    return (
        <div className="bg-slate-50 min-h-screen pb-32">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center border border-purple-100 shadow-sm">
                                <Activity className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Platform Telemetry</h1>
                                <p className="text-gray-500 font-medium uppercase tracking-wider text-xs flex mt-1 items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Corporate Access Level
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link to="/admin" className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold border border-gray-200 rounded-xl transition-colors flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4" /> Control Center
                            </Link>
                            <Link to="/dashboard" className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white font-bold border border-gray-900 rounded-xl transition-colors flex items-center gap-2">
                                <LayoutDashboard className="w-4 h-4" /> Exit
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-6">
                {isLoading ? (
                    <div className="flex justify-center py-32">
                        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                                        <DollarSign className="w-6 h-6" />
                                    </div>
                                    <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                                        <ArrowUpRight className="w-3 h-3 mr-1" /> +12.5%
                                    </span>
                                </div>
                                <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Sales Volume (30d)</p>
                                <h3 className="text-xl font-black text-gray-900 mt-1">${totalVolume.toLocaleString()}</h3>
                            </div>

                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 border-purple-100 bg-purple-50/20">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-purple-500 text-white rounded-2xl shadow-lg shadow-purple-500/20">
                                        <TrendingUp className="w-6 h-6" />
                                    </div>
                                </div>
                                <p className="text-purple-600 font-bold uppercase tracking-wider text-[10px]">Platform Profit</p>
                                <h3 className="text-xl font-black text-purple-900 mt-1">${totalProfit.toLocaleString()}</h3>
                            </div>

                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                        <Users className="w-6 h-6" />
                                    </div>
                                </div>
                                <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">New Users (30d)</p>
                                <h3 className="text-xl font-black text-gray-900 mt-1">{totalNewUsers}</h3>
                            </div>

                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                                        <Package className="w-6 h-6" />
                                    </div>
                                </div>
                                <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Completed Sales</p>
                                <h3 className="text-xl font-black text-gray-900 mt-1">{totalSales}</h3>
                            </div>

                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-gray-50 text-gray-600 rounded-2xl">
                                        <Activity className="w-6 h-6" />
                                    </div>
                                </div>
                                <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Avg Order Value</p>
                                <h3 className="text-xl font-black text-gray-900 mt-1">${avgOrderValue.toLocaleString()}</h3>
                            </div>
                        </div>

                        {/* Charts Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Sales Chart */}
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                                <h4 className="text-xl font-black text-gray-900 tracking-tight mb-8">Daily Sales Volume</h4>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={analytics?.salesTimeline}>
                                            <defs>
                                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                                            <Tooltip 
                                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                itemStyle={{ fontWeight: 800, color: '#f97316' }}
                                            />
                                            <Area type="monotone" dataKey="amount" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* User Chart */}
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                                <h4 className="text-xl font-black text-gray-900 tracking-tight mb-8">User Acquisition</h4>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={analytics?.userTimeline}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                                            <Tooltip 
                                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Segmentation Chart */}
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                                <h4 className="text-xl font-black text-gray-900 tracking-tight mb-8">Asset Segmentation</h4>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={analytics?.categoryStats}
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                                nameKey="_id"
                                            >
                                                {analytics?.categoryStats?.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperAdminAnalytics;

