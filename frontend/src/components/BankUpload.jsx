import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Landmark, CheckCircle2, AlertCircle, Clock, ChevronDown, Search, X, Building2, Shield } from 'lucide-react';
import { refreshUserProfile } from '../features/authSlice';

const SRI_LANKA_BANKS = [
    { code: 'BOC', name: 'Bank of Ceylon', abbr: 'BOC' },
    { code: 'PB', name: "People's Bank", abbr: "PB" },
    { code: 'HNB', name: 'Hatton National Bank', abbr: 'HNB' },
    { code: 'COMBANK', name: 'Commercial Bank of Ceylon', abbr: 'COMBANK' },
    { code: 'NDB', name: 'Nations Trust Bank', abbr: 'NTB' },
    { code: 'SAMP', name: 'Sampath Bank', abbr: 'Sampath' },
    { code: 'SEYLAN', name: 'Seylan Bank', abbr: 'Seylan' },
    { code: 'NSB', name: 'National Savings Bank', abbr: 'NSB' },
    { code: 'DFCC', name: 'DFCC Bank', abbr: 'DFCC' },
    { code: 'NTB', name: 'Nations Trust Bank', abbr: 'NTB' },
    { code: 'UNION', name: 'Union Bank of Colombo', abbr: 'Union' },
    { code: 'AMANA', name: 'Amana Bank', abbr: 'Amana' },
    { code: 'MCB', name: 'MCB Bank', abbr: 'MCB' },
    { code: 'CITI', name: 'Citibank N.A.', abbr: 'Citi' },
    { code: 'HSBCSL', name: 'HSBC Sri Lanka', abbr: 'HSBC' },
    { code: 'STANDARD', name: 'Standard Chartered Bank', abbr: 'SCB' },
    { code: 'PABC', name: 'Pan Asia Banking Corporation', abbr: 'PABC' },
    { code: 'SANASA', name: 'SANASA Development Bank', abbr: 'SDB' },
    { code: 'LB', name: 'Lanka Bangla Finance', abbr: 'LB' },
    { code: 'IBSL', name: 'Islamic Bank of Sri Lanka', abbr: 'IBSL' },
    { code: 'RDB', name: 'Regional Development Bank', abbr: 'RDB' },
    { code: 'STATE', name: 'State Mortgage & Investment Bank', abbr: 'SMIB' },
    { code: 'LOLC', name: 'LOLC Finance PLC', abbr: 'LOLC' },
    { code: 'BRAC', name: 'BRAC Lanka Finance', abbr: 'BRAC' },
];

const BankSelect = ({ value, onChange, error }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef(null);
    const selectedBank = SRI_LANKA_BANKS.find(b => b.name === value);

    const filtered = SRI_LANKA_BANKS.filter(b =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.abbr.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const handleOutside = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`w-full flex items-center justify-between bg-gray-50 border px-4 py-3.5 rounded-xl font-medium outline-none transition-all text-left ${error ? 'border-red-400 ring-2 ring-red-100' : open ? 'border-purple-500 ring-2 ring-purple-100 bg-white' : 'border-gray-200 hover:border-gray-300'}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${selectedBank ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400'}`}>
                        {selectedBank ? selectedBank.abbr.slice(0,3) : <Building2 className="w-4 h-4" />}
                    </div>
                    <span className={selectedBank ? 'text-gray-900 font-semibold' : 'text-gray-400'}>
                        {selectedBank ? selectedBank.name : 'Select your bank...'}
                    </span>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-gray-200/60 overflow-hidden animate-in slide-in-from-top-2 duration-150">
                    {/* Search */}
                    <div className="p-3 border-b border-gray-50">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl">
                            <Search className="w-4 h-4 text-gray-400 shrink-0" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search bank..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="bg-transparent outline-none text-sm font-medium flex-1 text-gray-700 placeholder:text-gray-400"
                            />
                            {search && <button onClick={() => setSearch('')}><X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" /></button>}
                        </div>
                    </div>
                    {/* List */}
                    <div className="max-h-52 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
                        {filtered.length === 0 ? (
                            <p className="text-center text-xs text-gray-400 py-6 font-medium">No bank found</p>
                        ) : (
                            filtered.map(bank => (
                                <button
                                    key={bank.code}
                                    type="button"
                                    onClick={() => { onChange(bank.name); setOpen(false); setSearch(''); }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${value === bank.name ? 'bg-purple-50 text-purple-700' : 'hover:bg-gray-50 text-gray-700'}`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${value === bank.name ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {bank.abbr.slice(0, 3)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm leading-tight">{bank.name}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{bank.abbr}</p>
                                    </div>
                                    {value === bank.name && <CheckCircle2 className="w-4 h-4 text-purple-500 ml-auto" />}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const BankUpload = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        accountName: '',
        accountNumber: '',
        bankName: '',
        branchName: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors(prev => { const n = { ...prev }; delete n[e.target.name]; return n; });
        }
    };

    const handleBankChange = (bankName) => {
        setFormData(prev => ({ ...prev, bankName }));
        if (errors.bankName) setErrors(prev => { const n = { ...prev }; delete n.bankName; return n; });
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.accountName.trim()) newErrors.accountName = 'Account name is required';
        if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
        else if (formData.accountNumber.length < 5) newErrors.accountNumber = 'Enter a valid account number';
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return false; }
        return true;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.bankName.trim()) newErrors.bankName = 'Please select a bank';
        if (!formData.branchName.trim()) newErrors.branchName = 'Branch name is required';
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return false; }
        return true;
    };

    const handleNext = () => { if (validateStep1()) setStep(2); };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!validateStep2()) return;

        setIsSubmitting(true);
        try {
            const response = await api.post('/auth/bank', formData);
            toast.success(response.data.message || 'Bank details submitted successfully!');
            dispatch(refreshUserProfile());
        } catch (error) {
            toast.error(error.response?.data?.message || 'Submission failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Approved State ───────────────────────────────────────────
    if (user?.bankStatus === 'approved') {
        return (
            <div className="bg-white rounded-3xl border border-green-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 70% 30%, white 0%, transparent 60%)'}} />
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-black text-white mb-1">Bank Account Verified</h3>
                    <p className="text-green-100 text-sm font-medium">Ready to receive payouts</p>
                </div>
                <div className="p-6">
                    <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Bank</span>
                            <span className="text-sm font-bold text-gray-900">{user.bankDetails?.bankName}</span>
                        </div>
                        <div className="h-px bg-gray-100" />
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Account</span>
                            <span className="text-sm font-bold text-gray-900 font-mono tracking-wider">••••{user.bankDetails?.accountNumber?.slice(-4) || '****'}</span>
                        </div>
                        <div className="h-px bg-gray-100" />
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Branch</span>
                            <span className="text-sm font-bold text-gray-900">{user.bankDetails?.branchName}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Pending State ───────────────────────────────────────────
    if (user?.bankStatus === 'pending') {
        return (
            <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 70% 30%, white 0%, transparent 60%)'}} />
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
                        <Clock className="w-8 h-8 text-white animate-pulse" />
                    </div>
                    <h3 className="text-xl font-black text-white mb-1">Under Review</h3>
                    <p className="text-amber-100 text-sm font-medium">Your bank details are being verified</p>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-3 bg-amber-50 rounded-2xl p-4 border border-amber-100">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                        <p className="text-sm text-amber-800 font-medium leading-relaxed">
                            Our team is reviewing your submission. This usually takes <strong>1–2 business days</strong>.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Form State ───────────────────────────────────────────────
    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 80% 20%, white 0%, transparent 55%)'}} />
                <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <Landmark className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white leading-tight">Financial Account Setup</h3>
                            <p className="text-purple-200 text-xs font-medium">Link your bank for Escrow payouts</p>
                        </div>
                    </div>
                    {/* Step Indicator */}
                    <div className="flex items-center gap-2 mt-4">
                        {[1, 2].map(s => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                                    step === s ? 'bg-white text-purple-700 shadow-lg' :
                                    step > s ? 'bg-green-400 text-white' : 'bg-white/20 text-white/60'
                                }`}>
                                    {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                                </div>
                                <span className={`text-xs font-bold ${step === s ? 'text-white' : 'text-white/50'}`}>
                                    {s === 1 ? 'Account Info' : 'Bank Details'}
                                </span>
                                {s < 2 && <div className={`w-6 h-0.5 mx-1 rounded-full ${step > s ? 'bg-green-400' : 'bg-white/20'}`} />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleUpload} className="p-6 space-y-4">
                {step === 1 && (
                    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Account Holder Name</label>
                            <input
                                type="text"
                                name="accountName"
                                value={formData.accountName}
                                onChange={handleChange}
                                className={`w-full bg-gray-50 border px-4 py-3.5 rounded-xl font-medium outline-none transition-all text-gray-900 placeholder:text-gray-400 ${errors.accountName ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:bg-white'}`}
                                placeholder="Kamal Perera"
                            />
                            {errors.accountName && <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 uppercase tracking-wide">{errors.accountName}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Account Number</label>
                            <input
                                type="text"
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleChange}
                                className={`w-full bg-gray-50 border px-4 py-3.5 rounded-xl font-mono font-semibold tracking-wider outline-none transition-all text-gray-900 placeholder:text-gray-400 placeholder:font-sans placeholder:tracking-normal ${errors.accountNumber ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:bg-white'}`}
                                placeholder="1234 5678 9012 3456"
                            />
                            {errors.accountNumber && <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 uppercase tracking-wide">{errors.accountNumber}</p>}
                        </div>
                        <button
                            type="button"
                            onClick={handleNext}
                            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 hover:-translate-y-0.5"
                        >
                            Continue →
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Select Bank</label>
                            <BankSelect value={formData.bankName} onChange={handleBankChange} error={errors.bankName} />
                            {errors.bankName && <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 uppercase tracking-wide">{errors.bankName}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Branch Name</label>
                            <input
                                type="text"
                                name="branchName"
                                value={formData.branchName}
                                onChange={handleChange}
                                className={`w-full bg-gray-50 border px-4 py-3.5 rounded-xl font-medium outline-none transition-all text-gray-900 placeholder:text-gray-400 ${errors.branchName ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:bg-white'}`}
                                placeholder="e.g. Colombo 03, Kandy City"
                            />
                            {errors.branchName && <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 uppercase tracking-wide">{errors.branchName}</p>}
                        </div>

                        <div className="flex items-start gap-3 bg-purple-50 p-4 rounded-xl border border-purple-100">
                            <Shield className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                            <p className="text-xs text-purple-800 font-medium leading-relaxed">
                                Escrow funds are wire-transferred within <strong>24 hours</strong> of clearance. Details must match your KYC identity.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="px-5 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
                            >
                                ← Back
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-60 hover:-translate-y-0.5"
                            >
                                {isSubmitting
                                    ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    : 'Submit for Verification'}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default BankUpload;
