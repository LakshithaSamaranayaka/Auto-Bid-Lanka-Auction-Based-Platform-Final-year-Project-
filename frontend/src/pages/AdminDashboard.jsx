import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CheckCircle, XCircle, Clock, ShieldAlert, Eye, Car, LayoutDashboard, TrendingUp, Landmark, Users, Bot, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('kyc'); // 'kyc' or 'vehicles'
    const [pendingUsers, setPendingUsers] = useState([]);
    const [pendingVehicles, setPendingVehicles] = useState([]);
    const [pendingBanks, setPendingBanks] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

    // Mocking the data load until DB is mounted
    useEffect(() => {
        const fetchPendingData = async () => {
            setIsLoading(true);
            try {
                const [kycRes, vehiclesRes, bankRes, allUsersRes, transactionsRes] = await Promise.all([
                    api.get('/auth/admin/kyc-pending'),
                    api.get('/vehicles/admin/pending'),
                    api.get('/auth/admin/bank-pending'),
                    api.get('/auth/admin/users'),
                    api.get('/transactions/admin/all')
                ]);
                // Ensure array data
                setPendingUsers(Array.isArray(kycRes.data) ? kycRes.data : []);
                setPendingVehicles(Array.isArray(vehiclesRes.data) ? vehiclesRes.data : []);
                setPendingBanks(Array.isArray(bankRes.data) ? bankRes.data : []);
                setAllUsers(Array.isArray(allUsersRes.data) ? allUsersRes.data : []);
                setAllTransactions(Array.isArray(transactionsRes.data) ? transactionsRes.data : []);
            } catch (err) {
                console.error("Failed to fetch pending data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        if (user?.role === 'admin') {
            fetchPendingData();
        }
    }, [user?.role]);

    if (user?.role !== 'admin') {
        return (
            <div className="max-w-3xl mx-auto px-4 py-32 text-center flex flex-col items-center min-h-screen">
                <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8 shadow-xl border border-red-100">
                    <ShieldAlert className="w-12 h-12" />
                </div>
                <h2 className="text-5xl font-black text-gray-900 tracking-tight">Access Denied</h2>
                <p className="text-xl text-gray-500 font-medium mt-4 max-w-lg mb-8">You do not have administrative privileges to view the control center.</p>
                <Link to="/dashboard" className="px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold shadow-xl transition-all hover:-translate-y-1">Return to Dashboard</Link>
            </div>
        );
    }

    const handleKycApproval = async (userId, status) => {
        setIsLoading(true);
        try {
            await api.put(`/auth/admin/kyc-approve/${userId}`, { status });
            setPendingUsers(prev => prev.filter(u => u._id !== userId));
            toast.success(status === 'approved' ? 'KYC Approved successfully.' : 'KYC Rejected. User notified.');
        } catch (err) {
            toast.error('Failed to update KYC status.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVehicleApproval = async (vehicleId, status) => {
        setIsLoading(true);
        try {
            await api.put(`/vehicles/admin/approve/${vehicleId}`, { status });
            setPendingVehicles(prev => prev.filter(v => v._id !== vehicleId));
            toast.success(status === 'live' ? 'Vehicle listing approved and is now Live!' : 'Vehicle listing rejected.');
        } catch (err) {
            toast.error('Failed to update vehicle status.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBankApproval = async (userId, status) => {
        setIsLoading(true);
        try {
            await api.put(`/auth/admin/bank-approve/${userId}`, { status });
            setPendingBanks(prev => prev.filter(u => u._id !== userId));
            toast.success(status === 'approved' ? 'Seller Bank Details Approved.' : 'Bank Details Rejected.');
        } catch (err) {
            toast.error('Failed to update bank status.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleUserStatus = async (userId) => {
        setIsLoading(true);
        try {
            const { data } = await api.put(`/auth/admin/user-toggle/${userId}`);
            setAllUsers(prev => prev.map(u => u._id === userId ? { ...u, isBlocked: data.isBlocked } : u));
            toast.success(data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update user status.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-32">

            {/* Header */}
            <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100 shadow-sm">
                                <ShieldAlert className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Control Center</h1>
                                <p className="text-gray-500 font-medium uppercase tracking-wider text-xs flex mt-1">Platform moderation & approvals</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {user?.role === 'admin' && (
                                <Link to="/analytics" className="px-5 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold border border-purple-200 rounded-xl transition-colors flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" /> Telemetry
                                </Link>
                            )}
                            <Link to="/dashboard" className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold border border-gray-200 rounded-xl transition-colors flex items-center gap-2">
                                <LayoutDashboard className="w-4 h-4" /> Exit
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-6 text-sm font-medium">

                {/* Tabs */}
                <div className="flex bg-white p-1.5 rounded-2xl mb-8 shadow-sm border border-gray-100 self-start md:self-auto w-max mx-auto md:mx-0">
                    <button
                        onClick={() => setActiveTab('kyc')}
                        className={`flex items-center gap-3 px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'kyc' ? 'bg-orange-50 shadow-sm text-orange-600 border border-orange-100' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <ShieldAlert className="w-5 h-5" /> KYC
                    </button>
                    <button
                        onClick={() => setActiveTab('vehicles')}
                        className={`flex items-center gap-3 px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'vehicles' ? 'bg-orange-50 shadow-sm text-orange-600 border border-orange-100' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Car className="w-5 h-5" /> Vehicles
                    </button>
                    <button
                        onClick={() => setActiveTab('banks')}
                        className={`flex items-center gap-3 px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'banks' ? 'bg-orange-50 shadow-sm text-orange-600 border border-orange-100' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Landmark className="w-5 h-5" /> Banks
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-3 px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'users' ? 'bg-orange-50 shadow-sm text-orange-600 border border-orange-100' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Users className="w-5 h-5" /> Users
                    </button>
                    <button
                        onClick={() => setActiveTab('txns')}
                        className={`flex items-center gap-3 px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'txns' ? 'bg-orange-50 shadow-sm text-orange-600 border border-orange-100' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <TrendingUp className="w-5 h-5" /> Transactions
                    </button>
                </div>

                {/* KYC Tab Content */}
                {activeTab === 'kyc' && (
                    <div className="space-y-6">
                        {pendingUsers.length === 0 ? (
                            <div className="text-center py-32 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                                <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ShieldAlert className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">No Pending KYC Documents</h3>
                                <p className="text-gray-500 font-medium max-w-sm mx-auto">All user identities connected to the platform have been verified.</p>
                            </div>
                        ) : (
                            <div className="bg-white shadow-xl rounded-[2rem] border border-gray-100 overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead className="bg-gray-50/80">
                                        <tr>
                                            <th className="px-8 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest rounded-tl-[2rem]">User Details</th>
                                            <th className="px-8 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Platform Role</th>
                                            <th className="px-8 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Documents</th>
                                            <th className="px-8 py-5 text-right text-xs font-black text-gray-500 uppercase tracking-widest rounded-tr-[2rem]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-50">
                                        {pendingUsers.map(u => (
                                            <tr key={u._id} className="hover:bg-orange-50/30 transition-colors">
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-12 h-12 bg-gradient-to-tr from-orange-400 to-orange-500 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-md">
                                                            {u.name.charAt(0)}
                                                        </div>
                                                        <div className="ml-5">
                                                            <div className="text-lg font-black text-gray-900">{u.name}</div>
                                                            <div className="text-sm text-gray-500 font-medium">{u.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <span className={`px-4 py-1.5 inline-flex text-xs font-bold rounded-lg uppercase tracking-wider ${u.role === 'seller' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                 <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                                            <Eye className="w-4 h-4 text-gray-400" /> {u.kycDocuments?.length || 0} Files
                                                        </span>
                                                        
                                                        {u.aiKycData && u.aiKycData.verificationStatus !== 'none' && (
                                                            <div className={`p-3 rounded-2xl border-2 shadow-sm animate-in fade-in duration-500 ${u.aiKycData.verificationStatus === 'match' ? 'bg-green-50/50 border-green-100 text-green-700' : 'bg-red-50/50 border-red-100 text-red-700'}`}>
                                                                <div className="flex items-center gap-2 mb-1.5">
                                                                    <div className={`p-1 rounded-lg ${u.aiKycData.verificationStatus === 'match' ? 'bg-green-100' : 'bg-red-100'}`}>
                                                                        <Bot className="w-3 h-3" />
                                                                    </div>
                                                                    <span className="text-[9px] font-black uppercase tracking-widest">AI Smart Verification</span>
                                                                    {u.aiKycData.verificationStatus === 'match' && <Sparkles className="w-3 h-3 text-yellow-500" />}
                                                                </div>
                                                                <div className="space-y-0.5">
                                                                    <p className="text-xs font-black truncate max-w-[180px]">{u.aiKycData.extractedName || "Extraction Failed"}</p>
                                                                    <p className="text-[10px] font-bold opacity-70 font-mono tracking-tighter">{u.aiKycData.extractedId || "ID Not Found"}</p>
                                                                </div>
                                                                <div className="mt-2 flex items-center justify-between">
                                                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${u.aiKycData.verificationStatus === 'match' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                                                        {u.aiKycData.verificationStatus}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        <span className="text-[10px] text-gray-400 font-medium flex items-center gap-2">
                                                            <Clock className="w-3 h-3" /> Submitted: {new Date(u.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-3">
                                                        <button disabled={isLoading} onClick={() => handleKycApproval(u._id, 'rejected')} className="text-red-600 bg-white hover:bg-red-50 px-5 py-2.5 rounded-xl border border-red-200 flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50">
                                                            <XCircle className="w-5 h-5" /> Reject
                                                        </button>
                                                        <button disabled={isLoading} onClick={() => handleKycApproval(u._id, 'approved')} className="text-white bg-green-500 hover:bg-green-600 px-5 py-2.5 rounded-xl border border-green-600 flex items-center justify-center gap-2 font-bold transition-all shadow-md shadow-green-500/20 disabled:opacity-50">
                                                            <CheckCircle className="w-5 h-5" /> Approve KYC
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Vehicles Tab Content */}
                {activeTab === 'vehicles' && (
                    <div className="space-y-6">
                        {pendingVehicles.length === 0 ? (
                            <div className="text-center py-32 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                                <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Car className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">No Pending Vehicles</h3>
                                <p className="text-gray-500 font-medium max-w-sm mx-auto">All vehicles submitted by verified sellers have been moderated.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {pendingVehicles.map(v => (
                                    <div key={v._id} className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest border border-orange-200 mb-3">
                                                    <Clock className="w-3 h-3 text-orange-500" /> Waiting Approval
                                                </div>
                                                <h3 className="text-3xl font-black text-gray-900 tracking-tight">{v.year} {v.make}</h3>
                                                <p className="text-xl text-gray-600 font-bold mb-1">{v.model}</p>
                                                <p className="text-sm text-gray-500 font-medium flex items-center gap-2 mt-4 bg-gray-50 px-3 py-1.5 rounded-lg w-max">
                                                    Seller: <span className="font-bold text-gray-900">{v.seller.name}</span>
                                                </p>
                                            </div>
                                            <div className="px-4 py-2 border-2 border-dashed border-gray-200 rounded-xl text-center">
                                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Listing</p>
                                                <p className="font-bold text-gray-900">{v.listingType.replace('_', ' ')}</p>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
                                            <button 
                                                onClick={() => {
                                                    setSelectedVehicle(v);
                                                    setIsVehicleModalOpen(true);
                                                }}
                                                className="col-span-2 py-4 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                                            >
                                                <Eye className="w-5 h-5" /> Inspect Vehicle Details
                                            </button>
                                            <button disabled={isLoading} onClick={() => handleVehicleApproval(v._id, 'rejected')} className="py-4 bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold rounded-xl transition-colors disabled:opacity-50 text-center">
                                                Reject Listing
                                            </button>
                                            <button disabled={isLoading} onClick={() => handleVehicleApproval(v._id, 'live')} className="py-4 bg-green-500 hover:bg-green-600 text-white shadow-xl shadow-green-500/20 font-bold justify-center rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50">
                                                Approve
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Banks Tab Content */}
                {activeTab === 'banks' && (
                    <div className="space-y-6">
                        {pendingBanks.length === 0 ? (
                            <div className="text-center py-32 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                                <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Landmark className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">No Pending Bank Verifications</h3>
                                <p className="text-gray-500 font-medium max-w-sm mx-auto">All sellers' financial details have been cleared and approved.</p>
                            </div>
                        ) : (
                            <div className="bg-white shadow-xl rounded-[2rem] border border-gray-100 overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead className="bg-gray-50/80">
                                        <tr>
                                            <th className="px-8 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest rounded-tl-[2rem]">Seller Details</th>
                                            <th className="px-8 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Bank Details</th>
                                            <th className="px-8 py-5 text-right text-xs font-black text-gray-500 uppercase tracking-widest rounded-tr-[2rem]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-50">
                                        {pendingBanks.map(u => (
                                            <tr key={u._id} className="hover:bg-purple-50/30 transition-colors">
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-12 h-12 bg-gradient-to-tr from-purple-400 to-purple-500 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-md">
                                                            {u.name.charAt(0)}
                                                        </div>
                                                        <div className="ml-5">
                                                            <div className="text-lg font-black text-gray-900">{u.name}</div>
                                                            <div className="text-sm text-gray-500 font-medium">{u.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className="flex flex-col gap-1.5">
                                                        <span className="text-sm font-bold text-gray-900 leading-tight">Acc Name: {u.bankDetails?.accountName}</span>
                                                        <span className="text-xs text-gray-600 font-medium leading-tight">Acc No: {u.bankDetails?.accountNumber}</span>
                                                        <span className="text-xs text-gray-500 leading-tight border-t border-gray-100 pt-1 mt-1">{u.bankDetails?.bankName} - {u.bankDetails?.branchName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-3">
                                                        <button disabled={isLoading} onClick={() => handleBankApproval(u._id, 'rejected')} className="text-red-600 bg-white hover:bg-red-50 px-5 py-2.5 rounded-xl border border-red-200 flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50">
                                                            <XCircle className="w-5 h-5" /> Reject
                                                        </button>
                                                        <button disabled={isLoading} onClick={() => handleBankApproval(u._id, 'approved')} className="text-white bg-green-500 hover:bg-green-600 px-5 py-2.5 rounded-xl border border-green-600 flex items-center justify-center gap-2 font-bold transition-all shadow-md shadow-green-500/20 disabled:opacity-50">
                                                            <CheckCircle className="w-5 h-5" /> Approve Bank
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Users Management Tab */}
                {activeTab === 'users' && (
                    <div className="bg-white shadow-xl rounded-[2rem] border border-gray-100 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/80">
                                <tr>
                                    <th className="px-8 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">User</th>
                                    <th className="px-8 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Role & Status</th>
                                    <th className="px-8 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Financials</th>
                                    <th className="px-8 py-5 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-50">
                                {allUsers.map(u => (
                                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-gray-900">{u.name}</div>
                                            <div className="text-xs text-gray-500">{u.email}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex gap-2">
                                                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded border border-blue-100">{u.role}</span>
                                                {u.isBlocked && <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase rounded border border-red-100 tracking-tighter">Suspended</span>}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="text-sm font-bold text-gray-700">${(u.wallet?.balance || 0).toLocaleString()}</div>
                                            <div className="text-[10px] text-gray-400 font-medium">Escrow: ${(u.wallet?.escrowBalance || 0).toLocaleString()}</div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button 
                                                onClick={() => handleToggleUserStatus(u._id)}
                                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${u.isBlocked ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-white text-red-600 border border-red-200 hover:bg-red-50'}`}
                                            >
                                                {u.isBlocked ? 'Restore Account' : 'Suspend'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Transactions Tab */}
                {activeTab === 'txns' && (
                    <div className="bg-white shadow-xl rounded-[2rem] border border-gray-100 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/80">
                                <tr>
                                    <th className="px-8 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Vehicle</th>
                                    <th className="px-8 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Buyer / Seller</th>
                                    <th className="px-8 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Amount & Fee</th>
                                    <th className="px-8 py-5 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-50">
                                {allTransactions.map(t => (
                                    <tr key={t._id}>
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-gray-900">{t.vehicle?.year} {t.vehicle?.make}</div>
                                            <div className="text-xs text-gray-500">{t.vehicle?.model}</div>
                                        </td>
                                        <td className="px-8 py-5 text-xs">
                                            <div>B: <span className="font-bold">{t.buyer?.name}</span></div>
                                            <div>S: <span className="font-bold">{t.seller?.name}</span></div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="font-black text-gray-900">${(t.totalAmount || 0).toLocaleString()}</div>
                                            <div className="text-[10px] text-purple-600 font-bold">Fee: ${(t.commissionAmount || 0).toLocaleString()}</div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${t.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {t.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Vehicle Details Modal */}
                {isVehicleModalOpen && selectedVehicle && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-100 animate-in fade-in zoom-in duration-300">
                            
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-6 border-b border-gray-100 flex justify-between items-center z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                                        <Car className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900">Vehicle Inspection</h2>
                                </div>
                                <button 
                                    onClick={() => setIsVehicleModalOpen(false)}
                                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full flex items-center justify-center transition-colors shadow-inner"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-8 space-y-10">
                                
                                {/* Photo Gallery */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedVehicle.images?.map((img, idx) => (
                                        <div key={idx} className={`rounded-2xl overflow-hidden border border-gray-100 shadow-sm ${idx === 0 ? 'md:col-span-2 aspect-video' : 'aspect-square'}`}>
                                            <img src={img} alt={`Vehicle ${idx}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>

                                {/* Main Info */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Make & Model</h4>
                                            <p className="text-3xl font-black text-gray-900">{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Seller Information</h4>
                                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <div className="w-10 h-10 bg-orange-500 text-white rounded-lg flex items-center justify-center font-bold">
                                                    {selectedVehicle.seller?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{selectedVehicle.seller?.name}</p>
                                                    <p className="text-xs text-gray-500">{selectedVehicle.seller?.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Vehicle Identification (VIN)</h4>
                                            <p className="text-lg font-mono font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 inline-block">
                                                {selectedVehicle.vin}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Detailed Specifications</h4>
                                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                                            <div>
                                                <p className="text-gray-500 font-medium">Mileage</p>
                                                <p className="font-bold text-gray-900">{(selectedVehicle.specs?.mileage || 0).toLocaleString()} km</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 font-medium">Condition</p>
                                                <p className="font-bold text-gray-900 uppercase text-xs">{selectedVehicle.specs?.condition}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 font-medium">Transmission</p>
                                                <p className="font-bold text-gray-900">{selectedVehicle.specs?.transmission || 'Auto'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 font-medium">Engine Capacity</p>
                                                <p className="font-bold text-gray-900">{selectedVehicle.specs?.engineCC || 'N/A'} cc</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 font-medium">Fuel Type</p>
                                                <p className="font-bold text-gray-900">{selectedVehicle.specs?.fuelType || 'Hybrid'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 font-medium">Hybrid Tech</p>
                                                <p className="font-bold text-gray-900">{selectedVehicle.specs?.hybridType}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                {selectedVehicle.specs?.description && (
                                    <div className="bg-orange-50/50 rounded-3xl p-8 border border-orange-100">
                                        <h4 className="text-sm font-black text-orange-900 uppercase tracking-widest mb-3">Seller's Statement</h4>
                                        <p className="text-gray-700 leading-relaxed font-medium">
                                            {selectedVehicle.specs.description}
                                        </p>
                                    </div>
                                )}

                                {/* Modal Actions */}
                                <div className="flex gap-4 pt-6">
                                    <button 
                                        disabled={isLoading}
                                        onClick={() => {
                                            handleVehicleApproval(selectedVehicle._id, 'rejected');
                                            setIsVehicleModalOpen(false);
                                        }}
                                        className="flex-1 py-4 bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold rounded-2xl transition-all shadow-sm"
                                    >
                                        Reject Listing
                                    </button>
                                    <button 
                                        disabled={isLoading}
                                        onClick={() => {
                                            handleVehicleApproval(selectedVehicle._id, 'live');
                                            setIsVehicleModalOpen(false);
                                        }}
                                        className="flex-1 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-green-500/20"
                                    >
                                        Approve & Go Live
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;
