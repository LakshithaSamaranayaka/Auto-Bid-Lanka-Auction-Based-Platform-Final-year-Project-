import { Link } from 'react-router-dom';
import { ArrowRight, Search, Zap, ShieldCheck, Tag, FileText, CheckCircle2, Trophy, MousePointerClick } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const HowItWorks = () => {
    const { t } = useTranslation();

    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        initial: {},
        whileInView: {
            transition: {
                staggerChildren: 0.15
            }
        },
        viewport: { once: true }
    };

    return (
        <div className="bg-slate-50 min-h-screen overflow-hidden">
            {/* Header Banner - Dark Mode Premium */}
            <div className="bg-gray-900 pt-32 pb-48 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>

                <div className="container-fluid relative z-10">
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center text-left">

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold uppercase tracking-wider mb-8 backdrop-blur-md">
                                <Zap className="w-4 h-4" /> {t('howItWorks.badge')}
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 leading-tight">
                                {t('howItWorks.title1')} <span className="text-orange-500 underline decoration-4 underline-offset-8">AutoBid</span> {t('howItWorks.title2')}
                            </h1>
                            <p className="text-xl text-gray-400 max-w-xl font-medium leading-relaxed">
                                {t('howItWorks.subtitle')}
                            </p>
                            
                            <div className="mt-10 flex flex-wrap gap-4">
                                <Link to="/register" className="px-10 py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-orange-500/30 hover:-translate-y-1 flex items-center gap-3">
                                    {t('howItWorks.registerBtn')} <ArrowRight className="w-6 h-6" />
                                </Link>
                                <Link to="/auctions" className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black text-lg transition-all backdrop-blur-md">
                                    {t('howItWorks.viewAuctionsBtn')}
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative flex justify-center lg:justify-end"
                        >
                            <div className="relative z-10 w-full max-w-md">
                                <img 
                                    src="/images/how-it-works-hero.png" 
                                    alt="How it Works Illustration" 
                                    className="w-full h-auto drop-shadow-[0_20px_50px_rgba(249,115,22,0.5)]"
                                />
                                {/* Floating elements for "Lassana" effect */}
                                <motion.div 
                                    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-10 -right-5 p-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl hidden md:block"
                                >
                                    <Trophy className="w-10 h-10 text-orange-400" />
                                </motion.div>
                                <motion.div 
                                    animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                    className="absolute -bottom-10 -left-10 p-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl hidden md:block"
                                >
                                    <MousePointerClick className="w-10 h-10 text-blue-400" />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Steps Timeline - Redesigned */}
            <div className="container-fluid py-20 -mt-24 relative z-20">
                <motion.div 
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="whileInView"
                    className="space-y-12 max-w-6xl mx-auto"
                >

                    {/* Step 1 */}
                    <motion.div variants={fadeIn} className="bg-white rounded-[3rem] p-8 md:p-14 shadow-2xl border border-gray-100 flex flex-col md:flex-row items-center gap-12 group hover:border-blue-200 transition-all">
                        <div className="w-28 h-28 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-xl border border-blue-100 font-black text-5xl transform group-hover:-rotate-6 transition-transform">
                            1
                        </div>
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                    <FileText className="w-8 h-8" />
                                </div>
                                <h3 className="text-4xl font-black text-gray-900 tracking-tight">{t('howItWorks.step1Title')}</h3>
                            </div>
                            <p className="text-xl text-gray-500 font-medium leading-relaxed">
                                {t('howItWorks.step1Desc')}
                            </p>
                            <Link to="/register" className="inline-flex items-center gap-3 text-blue-600 font-black text-lg hover:gap-5 transition-all">
                                {t('howItWorks.registerBtn')} <ArrowRight className="w-6 h-6" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Step 2 */}
                    <motion.div variants={fadeIn} className="bg-white rounded-[3rem] p-8 md:p-14 shadow-2xl border border-gray-100 flex flex-col md:flex-row items-center gap-12 group hover:border-orange-200 transition-all">
                        <div className="w-28 h-28 bg-orange-50 text-orange-600 rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-xl border border-orange-100 font-black text-5xl transform group-hover:rotate-6 transition-transform">
                            2
                        </div>
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                                    <Search className="w-8 h-8" />
                                </div>
                                <h3 className="text-4xl font-black text-gray-900 tracking-tight">{t('howItWorks.step2Title')}</h3>
                            </div>
                            <p className="text-xl text-gray-500 font-medium leading-relaxed">
                                {t('howItWorks.step2Desc')}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/auctions" className="px-8 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-lg">{t('howItWorks.viewAuctionsBtn')}</Link>
                                <Link to="/direct-buy" className="px-8 py-3 bg-slate-100 text-gray-800 font-black rounded-2xl hover:bg-orange-100 hover:text-orange-700 transition-all">{t('howItWorks.directBuyBtn')}</Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Step 3 */}
                    <motion.div variants={fadeIn} className="bg-white rounded-[3rem] p-8 md:p-14 shadow-2xl border border-gray-100 flex flex-col md:flex-row items-center gap-12 group hover:border-purple-200 transition-all">
                        <div className="w-28 h-28 bg-purple-50 text-purple-600 rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-xl border border-purple-100 font-black text-5xl transform group-hover:-rotate-6 transition-transform">
                            3
                        </div>
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                                    <Tag className="w-8 h-8" />
                                </div>
                                <h3 className="text-4xl font-black text-gray-900 tracking-tight">{t('howItWorks.step3Title')}</h3>
                            </div>
                            <p className="text-xl text-gray-500 font-medium leading-relaxed">
                                {t('howItWorks.step3Desc')}
                            </p>
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-purple-50 text-purple-700 font-black rounded-2xl">
                                <CheckCircle2 className="w-6 h-6" /> Real-time bid notifications active.
                            </div>
                        </div>
                    </motion.div>

                    {/* Step 4 - Final Destination */}
                    <motion.div variants={fadeIn} className="bg-gray-900 text-white rounded-[3rem] p-8 md:p-16 shadow-[0_50px_100px_-20px_rgba(34,197,94,0.3)] border border-gray-800 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-bl-[10rem] pointer-events-none transition-transform group-hover:scale-110"></div>
                        
                        <div className="w-28 h-28 bg-green-500/20 text-green-400 border-4 border-green-500/30 rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(34,197,94,0.3)] font-black text-5xl z-10">
                            4
                        </div>
                        <div className="flex-1 space-y-6 z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                                <h3 className="text-4xl font-black text-white tracking-tight">{t('howItWorks.step4Title')}</h3>
                            </div>
                            <p className="text-xl text-gray-400 font-medium leading-relaxed">
                                {t('howItWorks.step4Desc')}
                            </p>
                            <Link to="/refund-policy" className="inline-flex items-center gap-3 text-green-400 font-black text-lg hover:gap-5 transition-all">
                                {t('howItWorks.readPolicyBtn')} <ArrowRight className="w-6 h-6" />
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Bottom Trust Badge */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-20 text-center"
                >
                    <div className="inline-block p-1 rounded-full bg-slate-200/50 backdrop-blur-sm">
                        <div className="px-8 py-3 rounded-full bg-white flex items-center gap-4 shadow-xl border border-gray-100">
                            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className="text-sm font-black text-gray-600 uppercase tracking-[0.2em]">Verified Auction Workflow - Phase 2.0</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HowItWorks;

