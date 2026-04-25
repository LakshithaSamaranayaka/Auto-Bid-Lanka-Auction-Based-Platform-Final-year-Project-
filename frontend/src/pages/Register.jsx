import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../features/authSlice';
import { Mail, Lock, User, UserPlus, ArrowRight, Car, Briefcase, FileCheck, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Register = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'buyer', // Default
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
        if (error) {
            toast.error(error);
        }
    }, [isAuthenticated, error, navigate]);

    const { name, email, password, role } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleRoleSelect = (selectedRole) => {
        setFormData({ ...formData, role: selectedRole });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        
        // Basic Validation
        const newErrors = {};
        if (!name.trim()) newErrors.name = "Full name is required";
        
        if (!email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
        
        if (!password) newErrors.password = "Password is required";
        else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        dispatch(registerUser({ name, email, password, role }));
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row-reverse">

            {/* Right Column: Visual/Animated side (Reversed order in DOM so image is Right or Left depending on layout choice) */}
            <div className="hidden md:flex md:w-[45%] bg-gray-900 relative overflow-hidden flex-col justify-center items-center p-12">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDuration: '5s' }}></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2 animate-pulse" style={{ animationDuration: '7s' }}></div>

                <div className="relative z-10 space-y-10 max-w-sm">
                    <div className="p-4 bg-white/10 backdrop-blur border border-white/20 rounded-3xl inline-block shadow-2xl transform hover:scale-105 transition-transform duration-500">
                        <UserPlus className="w-16 h-16 text-orange-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight leading-tight mb-4">
                            {t('register.welcome')} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">{t('register.welcome2')}</span>
                        </h1>
                        <p className="text-gray-400 font-medium leading-relaxed">
                            {t('register.subtitle')}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur">
                            <FileCheck className="w-6 h-6 text-green-400 shrink-0" />
                            <div className="flex-1">
                                <h4 className="text-white font-bold text-sm">{t('register.mandate')}</h4>
                                <p className="text-gray-400 text-xs mt-1">{t('register.mandateSub')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Left Column: Form Side */}
            <div className="w-full md:w-[55%] flex items-center justify-center p-8 lg:p-16 relative">

                <div className="w-full max-w-lg relative z-10">
                    <div className="mb-10">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{t('register.createAcc')}</h2>
                        <p className="text-gray-500 mt-2 font-medium">{t('register.takesTime')}</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">

                        {/* Role Selection */}
                        <div className="mb-8">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">
                                {t('register.selectType')}
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    onClick={() => handleRoleSelect('buyer')}
                                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 group ${role === 'buyer' ? 'border-orange-500 bg-orange-50 shadow-md' : 'border-gray-200 bg-white hover:border-orange-300'}`}
                                >
                                    <Car className={`w-8 h-8 ${role === 'buyer' ? 'text-orange-500' : 'text-gray-400 group-hover:text-orange-400 transition-colors'}`} />
                                    <span className={`font-bold ${role === 'buyer' ? 'text-orange-700' : 'text-gray-600'}`}>{t('register.buyer')}</span>
                                </div>
                                <div
                                    onClick={() => handleRoleSelect('seller')}
                                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 group ${role === 'seller' ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 bg-white hover:border-blue-300'}`}
                                >
                                    <Briefcase className={`w-8 h-8 ${role === 'seller' ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-400 transition-colors'}`} />
                                    <span className={`font-bold ${role === 'seller' ? 'text-blue-700' : 'text-gray-600'}`}>{t('register.seller')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 group-focus-within:text-orange-500 transition-colors">
                                    {t('register.legalName')}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                    </div>
                                     <input
                                        type="text"
                                        name="name"
                                        value={name}
                                        onChange={onChange}
                                        autoComplete="name"
                                        required
                                        className={`w-full pl-12 pr-4 py-4 bg-white border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all font-medium text-gray-900 shadow-sm ${errors.name ? 'border-red-500 focus:ring-red-500/10' : 'border-gray-100 focus:border-orange-500 focus:ring-orange-500/10'}`}
                                        placeholder="John Carter"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.name}</p>}
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 group-focus-within:text-orange-500 transition-colors">
                                    {t('register.email')}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                    </div>
                                     <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={onChange}
                                        autoComplete="email"
                                        required
                                        className={`w-full pl-12 pr-4 py-4 bg-white border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all font-medium text-gray-900 shadow-sm ${errors.email ? 'border-red-500 focus:ring-red-500/10' : 'border-gray-100 focus:border-orange-500 focus:ring-orange-500/10'}`}
                                        placeholder="john@example.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 group-focus-within:text-orange-500 transition-colors">
                                    {t('register.password')}
                                </label>
                                 <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={password}
                                        onChange={onChange}
                                        autoComplete="new-password"
                                        required
                                        minLength="6"
                                        className={`w-full pl-12 pr-12 py-4 bg-white border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all font-medium text-gray-900 shadow-sm ${errors.password ? 'border-red-500 focus:ring-red-500/10' : 'border-gray-100 focus:border-orange-500 focus:ring-orange-500/10'}`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-500 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.password}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg transition-all shadow-xl hover:-translate-y-1 hover:shadow-2xl mt-8 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-black'}`}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t('register.creating')}
                                </span>
                            ) : (
                                <>{t('register.accessBtn')} <ArrowRight className="w-5 h-5" /></>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-500 font-medium">
                        {t('register.alreadyVerified')} {' '}
                        <Link to="/login" className="text-orange-600 font-bold hover:underline hover:text-orange-500 transition-colors">
                            {t('register.returnSignIn')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
