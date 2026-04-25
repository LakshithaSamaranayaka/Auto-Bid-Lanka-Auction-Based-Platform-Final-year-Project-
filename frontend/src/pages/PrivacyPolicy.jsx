import { ShieldCheck, Lock, EyeOff, FileText, Server, UserCheck, Trash2, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy = () => {
    const { t } = useTranslation();

    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    return (
        <div className="bg-slate-50 min-h-screen overflow-hidden">
            {/* Header Banner - Emerald Theme */}
            <div className="bg-gray-900 pt-32 pb-40 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>

                <div className="container-fluid relative z-10">
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center text-left">

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold uppercase tracking-wider mb-8 backdrop-blur-md">
                                <ShieldCheck className="w-4 h-4" /> Data Protection Active
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 leading-tight">
                                {t('privacy.title')}
                            </h1>
                            <p className="text-xl text-gray-400 max-w-xl font-medium leading-relaxed">
                                {t('privacy.subtitle')}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative flex justify-center lg:justify-end"
                        >
                            <div className="relative z-10 w-full max-w-md">
                                <img 
                                    src="/images/privacy-hero.png" 
                                    alt="Privacy Protection Illustration" 
                                    className="w-full h-auto drop-shadow-[0_20px_50px_rgba(16,185,129,0.3)]"
                                />
                                {/* Floating elements for "Lassana" effect */}
                                <motion.div 
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-10 -right-5 p-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl hidden md:block"
                                >
                                    <Lock className="w-8 h-8 text-emerald-400" />
                                </motion.div>
                                <motion.div 
                                    animate={{ y: [0, 20, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                                    className="absolute -bottom-10 -left-10 p-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl hidden md:block"
                                >
                                    <UserCheck className="w-8 h-8 text-teal-400" />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Main Content Sections */}
            <div className="container-fluid py-20 -mt-24 relative z-20">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-100 p-8 md:p-16 space-y-20 max-w-5xl mx-auto"
                >

                    {/* Collection Section */}
                    <motion.section {...fadeIn} className="flex flex-col md:flex-row gap-10 group">
                        <div className="shrink-0">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] shadow-sm flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                                <FileText className="w-8 h-8" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">{t('privacy.sec1Title')}</h2>
                            <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium">
                                {t('privacy.sec1Desc')}
                            </p>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl hover:border-blue-200 transition-colors group/item">
                                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <UserCheck className="w-5 h-5 text-blue-500" /> {t('privacy.sec1Li1')}
                                    </h4>
                                    <p className="text-gray-500 font-medium">{t('privacy.sec1Li1Desc')}</p>
                                </div>
                                <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl hover:border-blue-200 transition-colors group/item">
                                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <Lock className="w-5 h-5 text-blue-500" /> {t('privacy.sec1Li2')}
                                    </h4>
                                    <p className="text-gray-500 font-medium">{t('privacy.sec1Li2Desc')}</p>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Zero 3rd Party Section */}
                    <motion.section {...fadeIn} className="flex flex-col md:flex-row gap-10 group">
                        <div className="shrink-0">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[1.5rem] shadow-sm flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 transform group-hover:-rotate-6">
                                <EyeOff className="w-8 h-8" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">{t('privacy.sec2Title')}</h2>
                            <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -mr-8 -mt-8"></div>
                                <p className="text-xl text-gray-700 font-bold leading-relaxed relative z-10">
                                    {t('privacy.sec2Desc1')}<span className="text-emerald-600 underline decoration-2 underline-offset-4">{t('privacy.sec2DescBold')}</span>{t('privacy.sec2Desc2')}
                                </p>
                            </div>
                        </div>
                    </motion.section>

                    {/* Encryption Section */}
                    <motion.section {...fadeIn} className="flex flex-col md:flex-row gap-10 group">
                        <div className="shrink-0">
                            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-[1.5rem] shadow-sm flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                                <Server className="w-8 h-8" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">{t('privacy.sec3Title')}</h2>
                            <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl relative overflow-hidden group/server">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white backdrop-blur-md">
                                        <Lock className="w-6 h-6 animate-pulse" />
                                    </div>
                                    <p className="text-gray-300 text-lg font-bold leading-relaxed">
                                        {t('privacy.sec3Desc')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* User Rights Section */}
                    <motion.section {...fadeIn} className="flex flex-col md:flex-row gap-10 group">
                        <div className="shrink-0">
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.5rem] shadow-sm flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 transform group-hover:-rotate-6">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">{t('privacy.sec4Title')}</h2>
                            <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium">
                                {t('privacy.sec4Desc')}
                            </p>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="p-8 bg-red-50/50 border border-red-100 rounded-3xl group/item transition-all hover:bg-red-50">
                                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-4 group-hover/item:scale-110 transition-transform">
                                        <Trash2 className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-2">{t('privacy.sec4Li1')}</h4>
                                    <p className="text-gray-600 font-medium">{t('privacy.sec4Li1Desc')}</p>
                                </div>
                                <div className="p-8 bg-indigo-50/50 border border-indigo-100 rounded-3xl group/item transition-all hover:bg-indigo-50">
                                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover/item:scale-110 transition-transform">
                                        <Download className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-2">{t('privacy.sec4Li2')}</h4>
                                    <p className="text-gray-600 font-medium">{t('privacy.sec4Li2Desc')}</p>
                                </div>
                            </div>
                        </div>
                    </motion.section>
                </motion.div>

                {/* Bottom Trust Badge */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-20 text-center"
                >
                    <div className="inline-block p-1 rounded-full bg-emerald-100/50 backdrop-blur-sm">
                        <div className="px-6 py-2 rounded-full bg-white flex items-center gap-3 shadow-sm border border-emerald-100">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Privacy Standards Certified - 2026</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

