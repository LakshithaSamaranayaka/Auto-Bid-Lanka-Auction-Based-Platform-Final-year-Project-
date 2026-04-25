import { Scale, RefreshCcw, DollarSign, Wallet, ArrowRight, ShieldCheck, CheckCircle2, Car, Lock, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const RefundEscrowPolicy = () => {
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
                staggerChildren: 0.2
            }
        },
        viewport: { once: true }
    };

    return (
        <div className="bg-slate-50 min-h-screen overflow-hidden">
            {/* Header Banner - Blue & Gold Theme */}
            <div className="bg-gray-900 pt-32 pb-40 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>

                <div className="container-fluid relative z-10">
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center text-left">

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold uppercase tracking-wider mb-8 backdrop-blur-md">
                                <ShieldCheck className="w-4 h-4" /> 100% Secure Escrow
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 leading-tight">
                                {t('refund.title')}
                            </h1>
                            <p className="text-xl text-blue-200/80 max-w-xl font-medium leading-relaxed">
                                {t('refund.subtitle')}
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
                                    src="/images/refund-hero.png" 
                                    alt="Refund and Escrow Illustration" 
                                    className="w-full h-auto drop-shadow-[0_20px_50px_rgba(59,130,246,0.3)]"
                                />
                                {/* Floating elements for "Lassana" effect */}
                                <motion.div 
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-10 -right-5 p-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl hidden md:block"
                                >
                                    <DollarSign className="w-8 h-8 text-amber-400" />
                                </motion.div>
                                <motion.div 
                                    animate={{ y: [0, 20, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                                    className="absolute -bottom-10 -left-10 p-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl hidden md:block"
                                >
                                    <Lock className="w-8 h-8 text-blue-400" />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Escrow Workflow */}
            <div className="container-fluid py-20 -mt-24 relative z-20">

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-100 p-8 md:p-16 space-y-20 overflow-hidden"
                >
                    <section>
                        <div className="text-center max-w-3xl mx-auto mb-16 px-4">
                            <h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tight flex items-center justify-center gap-4">
                                <ShieldCheck className="w-10 h-10 text-blue-600" /> {t('refund.howWorksTitle')}
                            </h2>
                            <p className="text-lg text-gray-500 font-medium leading-relaxed">
                                Our escrow system ensures that neither major buyers nor sellers are ever at risk during a transaction.
                            </p>
                        </div>

                        <motion.div 
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="whileInView"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-3 gap-12 relative"
                        >
                            {/* Desktop Connectors */}
                            <div className="hidden md:block absolute top-[60px] left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-blue-100 via-blue-500 to-blue-100 opacity-20 z-0"></div>

                            {[
                                { step: "1", title: t('refund.step1Title'), desc: t('refund.step1Desc'), icon: DollarSign, color: "blue" },
                                { step: "2", title: t('refund.step2Title'), desc: t('refund.step2Desc'), icon: Car, color: "indigo" },
                                { step: "3", title: t('refund.step3Title'), desc: t('refund.step3Desc'), icon: Wallet, color: "emerald" }
                            ].map((item, i) => (
                                <motion.div 
                                    variants={fadeIn}
                                    key={i} 
                                    className="relative z-10 flex flex-col items-center text-center group"
                                >
                                    <div className={`w-28 h-28 bg-white border-8 border-slate-50 rounded-[2.5rem] flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:shadow-blue-500/10 transition-all duration-500 relative mb-8`}>
                                        <div className={`absolute -top-3 -right-3 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-black text-lg border-4 border-white`}>
                                            {item.step}
                                        </div>
                                        <item.icon className={`w-10 h-10 text-${item.color}-600`} />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-4">{item.title}</h3>
                                    <p className="text-gray-500 font-medium leading-relaxed px-4">{item.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>

                    {/* Refund Scenarios Section */}
                    <section className="bg-slate-50 -mx-8 -mb-8 md:-mx-16 md:-mb-16 p-8 md:p-16 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/50 rounded-bl-[10rem] pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/50 rounded-tr-[8rem] pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row items-center gap-4 mb-12 text-center md:text-left">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-lg border border-orange-100">
                                    <RefreshCcw className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">{t('refund.refundScenariosTitle')}</h2>
                                    <p className="text-gray-500 font-bold">{t('refund.refundScenariosDesc')}</p>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-8">
                                {[
                                    { title: t('refund.scenario1Title'), desc: t('refund.scenario1Desc') },
                                    { title: t('refund.scenario2Title'), desc: t('refund.scenario2Desc') }
                                ].map((scenario, i) => (
                                    <motion.div 
                                        key={i}
                                        {...fadeIn}
                                        className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 hover:border-orange-200 transition-all group"
                                    >
                                        <div className="flex gap-6">
                                            <div className="shrink-0">
                                                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all transform group-hover:rotate-12">
                                                    <CheckCircle2 className="w-6 h-6" />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <h4 className="text-2xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">
                                                    {scenario.title}
                                                </h4>
                                                <p className="text-lg text-gray-500 font-medium leading-relaxed">
                                                    {scenario.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-20 text-center">
                                <motion.div {...fadeIn} className="inline-block p-1 rounded-3xl bg-white/50 border border-white/80 shadow-2xl backdrop-blur-md">
                                    <div className="bg-gray-900 rounded-[2rem] p-10 md:px-20 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[4rem]"></div>
                                        <div className="relative z-10">
                                            <HelpCircle className="w-12 h-12 text-blue-400 mx-auto mb-6" />
                                            <p className="text-white text-xl font-bold mb-8 max-w-lg mx-auto leading-relaxed">
                                                Still have questions about our escrow process? Our support team is here to help 24/7.
                                            </p>
                                            <Link to="/contact" className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-500/30 hover:-translate-y-1">
                                                {t('refund.contactBtn')} <ArrowRight className="w-6 h-6" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </section>
                </motion.div>

                {/* Bottom Trust Badge */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-sm tracking-widest uppercase">
                        <Lock className="w-4 h-4" /> FDIC-Insured Escrow Vault Integration
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default RefundEscrowPolicy;

