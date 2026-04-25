import { BookOpen, Gavel, FileCheck, Zap, AlertTriangle, ShieldAlert, Scale, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Terms = () => {
    const { t } = useTranslation();

    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    return (
        <div className="bg-slate-50 min-h-screen overflow-hidden">
            {/* Header Banner - Redesigned with Image */}
            <div className="bg-gray-900 pt-32 pb-40 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>

                <div className="container-fluid relative z-10">
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center text-left">

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold uppercase tracking-wider mb-8 backdrop-blur-md">
                                <ShieldAlert className="w-4 h-4" /> Legal Framework
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 leading-tight">
                                {t('terms.title')}
                            </h1>
                            <p className="text-xl text-gray-400 max-w-xl font-medium leading-relaxed">
                                {t('terms.subtitle')}
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
                                    src="/images/terms-hero.png" 
                                    alt="Terms and Conditions Illustration" 
                                    className="w-full h-auto drop-shadow-[0_20px_50px_rgba(59,130,246,0.5)]"
                                />
                                {/* Floating elements for "Lassana" effect */}
                                <motion.div 
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-10 -left-10 p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl hidden md:block"
                                >
                                    <FileCheck className="w-8 h-8 text-blue-400" />
                                </motion.div>
                                <motion.div 
                                    animate={{ y: [0, 15, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                    className="absolute -bottom-10 -right-5 p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl hidden md:block"
                                >
                                    <Scale className="w-8 h-8 text-indigo-400" />
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

                    {/* Bidding Contract Section */}
                    <motion.section {...fadeIn} className="flex flex-col md:flex-row gap-10 group">
                        <div className="shrink-0">
                            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-[1.5rem] shadow-sm flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 transform group-hover:-rotate-6">
                                <Gavel className="w-8 h-8" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-3xl font-black text-gray-900 mb-6 tracking-tight flex items-center gap-3">
                                {t('terms.sec1Title')}
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium">
                                {t('terms.sec1Desc')}
                            </p>
                            <div className="bg-orange-50/50 border-l-8 border-orange-500 p-8 rounded-r-3xl relative overflow-hidden group/alert">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover/alert:scale-110"></div>
                                <div className="relative z-10">
                                    <strong className="text-orange-950 block mb-3 text-xl flex items-center gap-3">
                                        <AlertTriangle className="w-6 h-6 text-orange-600" /> {t('terms.sec1AlertTitle')}
                                    </strong>
                                    <p className="text-orange-900 font-bold leading-relaxed">{t('terms.sec1AlertDesc')}</p>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Anti-Sniping Section */}
                    <motion.section {...fadeIn} className="flex flex-col md:flex-row gap-10 group">
                        <div className="shrink-0">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] shadow-sm flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                                <Zap className="w-8 h-8" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">{t('terms.sec2Title')}</h2>
                            <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium">
                                {t('terms.sec2Desc')}
                            </p>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {[t('terms.sec2Li1'), t('terms.sec2Li2')].map((item, i) => (
                                    <div key={i} className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex items-center gap-4 hover:border-blue-200 transition-colors">
                                        <div className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center shrink-0 text-blue-600 font-black">
                                            {i + 1}
                                        </div>
                                        <p className="text-gray-700 font-bold leading-tight">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.section>

                    {/* Fees Section */}
                    <motion.section {...fadeIn} className="flex flex-col md:flex-row gap-10 group">
                        <div className="shrink-0">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[1.5rem] shadow-sm flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 transform group-hover:-rotate-6">
                                <FileCheck className="w-8 h-8" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">{t('terms.sec3Title')}</h2>
                            <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl relative overflow-hidden group/fee">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-emerald-500/5 opacity-0 group-hover/fee:opacity-100 transition-opacity"></div>
                                <p className="text-xl text-gray-600 leading-relaxed font-bold relative z-10">
                                    {t('terms.sec3Desc')}
                                </p>
                            </div>
                        </div>
                    </motion.section>

                    {/* Arbitration Section */}
                    <motion.section {...fadeIn} className="flex flex-col md:flex-row gap-10 group">
                        <div className="shrink-0">
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.5rem] shadow-sm flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                                <Gavel className="w-8 h-8" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">{t('terms.sec4Title')}</h2>
                            <p className="text-lg text-gray-600 leading-relaxed font-medium mb-8">
                                {t('terms.sec4Desc')}
                            </p>
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-indigo-50 text-indigo-700 rounded-full font-bold text-sm">
                                <CheckCircle2 className="w-5 h-5" /> All rulings by Administration are final and binding.
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
                    <div className="inline-block p-1 rounded-full bg-gray-200/50 backdrop-blur-sm">
                        <div className="px-6 py-2 rounded-full bg-white flex items-center gap-3 shadow-sm border border-gray-100">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Last Updated: March 2026</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Terms;

