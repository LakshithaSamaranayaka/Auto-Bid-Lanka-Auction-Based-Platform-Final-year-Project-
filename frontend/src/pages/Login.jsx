import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../features/authSlice';
import { Mail, Lock, ArrowRight, ShieldCheck, Activity, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
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

    const { email, password } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        
        // Basic Validation
        const newErrors = {};
        if (!email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
        
        if (!password) newErrors.password = "Password is required";
        else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        dispatch(loginUser({ email, password }));
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">

            {/* Left Column: Visual/Animated side */}
            <div className="hidden md:flex md:w-1/2 bg-gray-900 relative overflow-hidden flex-col justify-center items-center p-12">
                {/* Animated Background Blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 animate-pulse" style={{ animationDuration: '4s' }}></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDuration: '6s' }}></div>

                <div className="relative z-10 text-center space-y-8">
                    <div className="p-4 bg-white/10 backdrop-blur border border-white/20 rounded-3xl inline-block mb-4 shadow-2xl transform hover:scale-105 transition-transform duration-500">
                        <Activity className="w-16 h-16 text-orange-400" />
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
                        {t('login.welcome')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">AutoBid.</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-md mx-auto font-medium">
                        {t('login.subtitle')}
                    </p>

                    <div className="pt-8 flex flex-col gap-4 max-w-sm mx-auto">
                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur">
                            <ShieldCheck className="w-6 h-6 text-green-400 shrink-0" />
                            <span className="text-sm font-bold text-gray-300 text-left">{t('login.bankGrade')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Form Side */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-12 relative">

                {/* Mobile only decorative blob */}
                <div className="md:hidden absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="w-full max-w-md relative z-10">
                    <div className="mb-10">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{t('login.signIn')}</h2>
                        <p className="text-gray-500 mt-2 font-medium">{t('login.accessAccount')}</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">

                        <div className="group">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 group-focus-within:text-orange-500 transition-colors">
                                {t('login.email')}
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
                                    placeholder={t('login.emailPlaceholder')}
                                />
                                {errors.email && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="group">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest group-focus-within:text-orange-500 transition-colors">
                                    {t('login.password')}
                                </label>
                                <Link to="/forgot-password" size="sm" className="text-sm font-bold text-orange-600 hover:text-orange-500 transition-colors">{t('login.forgot')}</Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                </div>
                                 <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    autoComplete="current-password"
                                    required
                                    className={`w-full pl-12 pr-12 py-4 bg-white border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all font-medium text-gray-900 shadow-sm ${errors.password ? 'border-red-500 focus:ring-red-500/10' : 'border-gray-100 focus:border-orange-500 focus:ring-orange-500/10'}`}
                                    placeholder={t('login.passwordPlaceholder')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                                {errors.password && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.password}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg transition-all shadow-xl hover:-translate-y-1 hover:shadow-2xl ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-black'}`}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t('login.authenticating')}
                                </span>
                            ) : (
                                <>{t('login.signInBtn')} <ArrowRight className="w-5 h-5" /></>
                            )}
                        </button>
                    </form>

                    <p className="mt-10 text-center text-gray-500 font-medium">
                        {t('login.noAccount')} {' '}
                        <Link to="/register" className="text-orange-600 font-bold hover:underline hover:text-orange-500 transition-colors">
                            {t('login.applyHere')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
