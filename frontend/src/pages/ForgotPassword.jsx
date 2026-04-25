import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Activity, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/auth/forgotpassword', { email });
            setIsSubmitted(true);
            toast.success('Reset link sent to your email!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Left Column: Visual */}
            <div className="hidden md:flex md:w-1/2 bg-gray-900 relative overflow-hidden flex-col justify-center items-center p-12">
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
                <div className="relative z-10 text-center space-y-8">
                    <div className="p-4 bg-white/10 backdrop-blur border border-white/20 rounded-3xl inline-block mb-4 shadow-2xl">
                        <Activity className="w-16 h-16 text-orange-400" />
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
                        Reset Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Security.</span>
                    </h1>
                </div>
            </div>

            {/* Right Column: Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-12 relative">
                <div className="w-full max-w-md relative z-10">
                    <Link to="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 font-bold mb-10 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> {t('forgotPassword.backToLogin')}
                    </Link>

                    {!isSubmitted ? (
                        <>
                            <div className="mb-10">
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{t('forgotPassword.title')}</h2>
                                <p className="text-gray-500 mt-2 font-medium">{t('forgotPassword.subtitle')}</p>
                            </div>

                            <form onSubmit={onSubmit} className="space-y-6">
                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 group-focus-within:text-orange-500 transition-colors">
                                        {t('forgotPassword.emailLabel')}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-gray-900 shadow-sm"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg transition-all shadow-xl hover:-translate-y-1 hover:shadow-2xl ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-black'}`}
                                >
                                    {isLoading ? t('forgotPassword.sending') : <><>{t('forgotPassword.submitBtn')}</> <ArrowRight className="w-5 h-5" /></>}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-10">
                            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
                                <Mail className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 mb-4">{t('forgotPassword.successTitle')}</h2>
                            <p className="text-gray-500 font-medium mb-8">{t('forgotPassword.successSubtitle')} <span className="text-gray-900 font-bold">{email}</span>. {t('forgotPassword.successHint')}</p>
                            <button 
                                onClick={() => setIsSubmitted(false)}
                                className="text-orange-600 font-bold hover:underline"
                            >
                                {t('forgotPassword.resend')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
