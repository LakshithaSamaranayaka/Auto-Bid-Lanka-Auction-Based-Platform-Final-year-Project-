import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Activity, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

const ResetPassword = () => {
    const { t } = useTranslation();
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error('Passwords do not match');
        }
        if (password.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }

        setIsLoading(true);
        try {
            await api.put(`/auth/resetpassword/${token}`, { password });
            toast.success(t('resetPassword.success'));
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid or expired token');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Left Column: Visual */}
            <div className="hidden md:flex md:w-1/2 bg-gray-900 relative overflow-hidden flex-col justify-center items-center p-12">
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 animate-pulse"></div>
                <div className="relative z-10 text-center space-y-8">
                    <div className="p-4 bg-white/10 backdrop-blur border border-white/20 rounded-3xl inline-block mb-4 shadow-2xl">
                        <Lock className="w-16 h-16 text-blue-400" />
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
                        Create New <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Password.</span>
                    </h1>
                </div>
            </div>

            {/* Right Column: Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{t('resetPassword.title')}</h2>
                        <p className="text-gray-500 mt-2 font-medium">{t('resetPassword.subtitle')}</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 group-focus-within:text-blue-500 transition-colors">
                                {t('resetPassword.newPassword')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-900 shadow-sm"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 group-focus-within:text-blue-500 transition-colors">
                                {t('resetPassword.confirmPassword')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-900 shadow-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg transition-all shadow-xl hover:-translate-y-1 hover:shadow-2xl ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                        >
                            {isLoading ? t('resetPassword.updating') : <><>{t('resetPassword.submitBtn')}</> <ArrowRight className="w-5 h-5" /></>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
