import { Award, ShieldCheck, Zap, Globe, TrendingUp, ArrowRight, Briefcase, CheckCircle2, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const About = () => {
    const { t } = useTranslation();

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        initial: {},
        whileInView: {
            transition: {
                staggerChildren: 0.1
            }
        },
        viewport: { once: true }
    };

    return (
        <div className="bg-slate-50 min-h-screen overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-gray-900 overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>
                
                <div className="container-fluid relative z-10">
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold uppercase tracking-wider mb-8 backdrop-blur-md">
                                <Globe className="w-4 h-4" /> {t('about.badge')}
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 leading-tight">
                                {t('about.title1')} <br /> 
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
                                    {t('about.title2')}
                                </span>
                            </h1>
                            <p className="text-xl text-gray-400 max-w-xl leading-relaxed mb-10">
                                {t('about.subtitle')}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/auctions" className="px-8 py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-orange-500/25 hover:-translate-y-1">
                                    Start Bidding
                                </Link>
                                <div className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-[10px] font-bold text-white">
                                                {String.fromCharCode(64 + i)}
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-sm font-medium text-gray-300">12k+ Trusted Users</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative"
                        >
                            <div className="relative z-10 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                                <img 
                                    src="/images/auction-hero.png" 
                                    alt="Car Auction Illustration" 
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
                            </div>
                            
                            {/* Floating Glass Cards */}
                            <motion.div 
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-11 -left-100 p-5.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl hidden md:block"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-11 bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Live Bids</p>
                                        <p className="text-xl font-black text-white">$45,200.00</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-5 -left-175 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl hidden md:block"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Escrow Locked</p>
                                        <p className="text-xl font-black text-white">100% Secured</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Platform Features */}
            <div className="container-fluid py-24 relative">

                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h2 {...fadeIn} className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                        Why Choose Our <span className="text-orange-600">Premium Platform?</span>
                    </motion.h2>
                    <motion.p {...fadeIn} className="text-3xl text-gray-900 font-medium">
                        We combine cutting-edge technology with rigorous security to give you the best auction experience.
                    </motion.p>
                </div>

                <motion.div 
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {[
                        { icon: ShieldCheck, title: t('about.f1Title'), desc: t('about.f1Desc'), color: "orange", bg: "bg-orange-50", text: "text-orange-600" },
                        { icon: Zap, title: t('about.f2Title'), desc: t('about.f2Desc'), color: "blue", bg: "bg-blue-50", text: "text-blue-600" },
                        { icon: Award, title: t('about.f3Title'), desc: t('about.f3Desc'), color: "emerald", bg: "bg-emerald-50", text: "text-emerald-600" }
                    ].map((item, index) => (
                        <motion.div
                            variants={fadeIn}
                            key={index}
                            className="bg-white p-10 rounded-[3.5rem] shadow-xl shadow-gray-600/50 border border-gray-100 hover:border-orange-200 transition-all duration-500 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[5rem] -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                            
                            <div className={`relative z-10 w-16 h-16 ${item.bg} ${item.text} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                <item.icon className="w-8 h-8" />
                            </div>
                            <h3 className="relative z-10 text-2xl font-bold text-gray-900 mb-4 tracking-tight">{item.title}</h3>
                            <p className="relative z-10 text-gray-800 leading-relaxed font-medium">{item.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Timeline Section */}
            <div className="bg-slate-100 py-32 relative">
                <div className="container-fluid">

                    <div className="text-center max-w-2xl mx-auto mb-24">
                        <motion.div {...fadeIn} className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full font-bold text-sm tracking-widest uppercase mb-4">Our History</motion.div>
                        <h2 className="text-5xl font-black text-gray-900 tracking-tight">{t('about.journeyTitle')}</h2>
                    </div>

                    <div className="relative">
                        {/* Desktop Timeline Line */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-300 to-transparent -translate-y-1/2 hidden lg:block"></div>
                        
                        <div className="grid lg:grid-cols-4 gap-12">
                            {[
                                { year: "2023", title: t('about.j1Title'), desc: t('about.j1Desc'), icon: Star },
                                { year: "2024", title: t('about.j2Title'), desc: t('about.j2Desc'), icon: ShieldCheck },
                                { year: "2025", title: t('about.j3Title'), desc: t('about.j3Desc'), icon: Zap },
                                { year: "2026", title: t('about.j4Title'), desc: t('about.j4Desc'), icon: Globe }
                            ].map((milestone, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    className="relative group pt-12 lg:pt-0"
                                >
                                    <div className="flex flex-col items-center">
                                        <div className="w-20 h-20 bg-white border-8 border-slate-100 rounded-full flex items-center justify-center text-orange-600 shadow-2xl relative z-10 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 mb-8 overflow-hidden">
                                            <span className="font-black text-lg">{milestone.year}</span>
                                        </div>
                                        <div className="bg-white p-8 rounded-4xl shadow-xl shadow-gray-400/50 border border-gray-100 text-center hover:shadow-2xl transition-all duration-500">
                                            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                                <milestone.icon className="w-5 h-5" />
                                            </div>
                                            <h4 className="font-bold text-gray-900 mb-2">{milestone.title}</h4>
                                            <p className="text-lg text-gray-700 font-medium leading-relaxed">{milestone.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Story / Mission Section */}
            <div className="py-32 bg-white">
                <div className="container-fluid">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative lg:order-2"
                        >
                            <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border-8 border-white">
                                <img 
                                    src="/images/trust-story.png" 
                                    alt="Trust and Growth" 
                                    className="w-full h-auto"
                                />
                            </div>
                            
                            {/* Decorative Blobs */}
                            <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-400/20 rounded-full blur-[80px] -z-10"></div>
                            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px] -z-10"></div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8 lg:order-1"
                        >
                            <div className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full font-bold text-xs tracking-widest uppercase">Our Mission</div>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                                {t('about.storyTitle')}
                            </h2>
                            <div className="space-y-6">
                                <p className="text-xl text-gray-600 leading-relaxed font-medium">
                                    {t('about.storyP1')}
                                </p>
                                <p className="text-xl text-gray-600 leading-relaxed font-medium">
                                    {t('about.storyP2')}
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6 pt-6">
                                <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">KYC Verified</h4>
                                        <p className="text-sm text-gray-500 font-medium leading-tight">Every user is 100% manually verified.</p>
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Escrow System</h4>
                                        <p className="text-sm text-gray-500 font-medium leading-tight">Funds are released only after inspection.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Call to Action Section */}
            <div className="container-fluid py-20 pb-40">

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl border border-white/5"
                >
                    {/* Background Texture */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    
                    <div className="relative z-10">
                        <motion.div 
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="w-24 h-24 bg-orange-500/10 text-orange-400 rounded-full flex items-center justify-center mx-auto mb-10 border border-orange-500/30"
                        >
                            <Users className="w-12 h-12" />
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-8">
                            {t('about.teamTitle')}
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                            {t('about.teamSub')}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link to="/careers" className="w-full sm:w-auto px-13 py-6 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-lg transition-all shadow-2xl shadow-orange-500/40 hover:-translate-y-1 flex items-center justify-center gap-2">
                                {t('about.teamBtn')} <ArrowRight className="w-6 h-6" />
                            </Link>
                            <Link to="/contact" className="w-full sm:w-auto px-14 py-6 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black text-lg transition-all backdrop-blur-sm">
                                Contact Team
                            </Link>
                        </div>
                    </div>
                    
                    {/* Floating Glow dots */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>
                </motion.div>
            </div>
        </div>
    );
};

export default About;

