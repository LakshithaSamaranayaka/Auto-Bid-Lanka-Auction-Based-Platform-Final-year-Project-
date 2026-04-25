import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, Users, DollarSign, Package, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await api.get('/transactions/admin/analytics');
                setAnalytics(data);
            } catch (error) {
                toast.error("Failed to load telemetry data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (isLoading) return <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;

    const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> +12.5%
                        </span>
                    </div>
                    <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Total Revenue (30d)</p>
                    <h3 className="text-2xl font-black text-gray-900 mt-1">
                        ${analytics?.salesTimeline?.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                    </h3>
                </div>

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                            <Users className="w-6 h-6" />
                        </div>
                        <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> +8.2%
                        </span>
                    </div>
                    <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">New Users (30d)</p>
                    <h3 className="text-2xl font-black text-gray-900 mt-1">
                        {analytics?.userTimeline?.reduce((acc, curr) => acc + curr.count, 0)}
                    </h3>
                </div>

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                            <Package className="w-6 h-6" />
                        </div>
                        <span className="flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                            <ArrowDownRight className="w-3 h-3 mr-1" /> -2.4%
                        </span>
                    </div>
                    <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Successful Sales</p>
                    <h3 className="text-2xl font-black text-gray-900 mt-1">
                        {analytics?.salesTimeline?.reduce((acc, curr) => acc + curr.count, 0)}
                    </h3>
                </div>

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Avg Order Value</p>
                    <h3 className="text-2xl font-black text-gray-900 mt-1">
                        ${Math.round(analytics?.salesTimeline?.reduce((acc, curr) => acc + curr.amount, 0) / (analytics?.salesTimeline?.reduce((acc, curr) => acc + curr.count, 0) || 1)).toLocaleString()}
                    </h3>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Volume Chart */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-xl font-black text-gray-900 tracking-tight">Sales Volume</h4>
                            <p className="text-sm text-gray-500 font-medium">Daily transaction amount for the last 30 days</p>
                        </div>
                        <div className="p-2.5 bg-gray-50 rounded-xl">
                            <DollarSign className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
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

                {/* New Users Chart */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-xl font-black text-gray-900 tracking-tight">User Acquisition</h4>
                            <p className="text-sm text-gray-500 font-medium">New registrations trend</p>
                        </div>
                        <div className="p-2.5 bg-gray-50 rounded-xl">
                            <Users className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
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

                {/* Body Type Breakdown */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 lg:col-span-1">
                    <h4 className="text-xl font-black text-gray-900 tracking-tight mb-8">Market Segmentation</h4>
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

                {/* Quick Logs / Alerts */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                     <h4 className="text-xl font-black text-gray-900 tracking-tight mb-6">Recent Escalations</h4>
                     <div className="space-y-4">
                        {[1,2,3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-orange-500 shadow-sm">
                                    !
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">KYC Rejection Appeal #{1024 + i}</p>
                                    <p className="text-xs text-gray-500 font-medium">User claimed documents be valid. Follow up required.</p>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
