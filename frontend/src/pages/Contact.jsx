import { Mail, MessageSquare, PhoneCall, MapPin, Send, HelpCircle, ShieldCheck, ChevronRight, Clock, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Contact = () => {
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
                staggerChildren: 0.1
            }
        },
        viewport: { once: true }
    };

    return (
        <div className="bg-slate-50 min-h-screen overflow-hidden">
            {/* Header Banner - Orange Theme */}
            <div className="bg-gray-900 pt-32 pb-44 relative overflow-hidden">
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
                                <HelpCircle className="w-4 h-4" /> {t('contact.badge')}
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 leading-tight">
                                {t('contact.title')}
                            </h1>
                            <p className="text-xl text-gray-400 max-w-xl font-medium leading-relaxed">
                                {t('contact.subtitle')}
                            </p>
                            
                            <div className="mt-10 flex flex-wrap gap-6">
                                <div className="flex items-center gap-3 text-orange-400 font-bold">
                                    <Clock className="w-5 h-5" /> 24/7 Priority Support
                                </div>
                                <div className="flex items-center gap-3 text-blue-400 font-bold">
                                    <Globe className="w-5 h-5" /> Global Assistance
                                </div>
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
                                    src="/images/contact-hero.png" 
                                    alt="Contact Support Illustration" 
                                    className="w-full h-auto drop-shadow-[0_20px_50px_rgba(249,115,22,0.4)]"
                                />
                                {/* Floating elements for "Lassana" effect */}
                                <motion.div 
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-10 -right-5 p-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl hidden md:block"
                                >
                                    <MessageSquare className="w-8 h-8 text-orange-400" />
                                </motion.div>
                                <motion.div 
                                    animate={{ y: [0, 15, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                    className="absolute -bottom-10 -left-10 p-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl hidden md:block"
                                >
                                    <Mail className="w-8 h-8 text-blue-400" />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="container-fluid py-20 -mt-24 relative z-20">

                <div className="grid lg:grid-cols-12 gap-10">
                    
                    {/* Info Blocks - LEFT SIDE */}
                    <motion.div 
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="whileInView"
                        className="lg:col-span-4 space-y-6"
                    >
                        {[
                            { title: t('contact.chatTitle'), desc: t('contact.chatDesc'), icon: MessageSquare, color: "orange" },
                            { title: t('contact.emailTitle'), desc: t('contact.emailDesc1'), icon: Mail, color: "blue", subDesc: t('contact.emailDesc2') },
                            { title: t('contact.hqTitle'), desc: t('contact.hqDesc1'), icon: MapPin, color: "emerald", subDesc: t('contact.hqDesc2') }
                        ].map((item, i) => (
                            <motion.div 
                                key={i}
                                variants={fadeIn}
                                className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex gap-6 hover:border-orange-200 transition-all group"
                            >
                                <div className={`p-4 bg-${item.color}-50 text-${item.color}-600 rounded-2xl group-hover:bg-${item.color}-600 group-hover:text-white transition-all transform group-hover:rotate-12`}>
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-gray-900">{item.title}</h3>
                                    <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                                    {item.subDesc && <p className="text-gray-950 font-black">{item.subDesc}</p>}
                                </div>
                            </motion.div>
                        ))}

                        {/* Call Card */}
                        <motion.div 
                            variants={fadeIn}
                            className="bg-gray-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-[4rem] group-hover:scale-110 transition-transform"></div>
                            <div className="relative z-10 flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <PhoneCall className="w-6 h-6 text-orange-500" />
                                    <span className="text-orange-400 font-black uppercase text-sm tracking-widest">{t('contact.dialTitle')}</span>
                                </div>
                                <p className="text-4xl font-black text-white tracking-tighter">+94 11 234 5678</p>
                                <p className="text-gray-400 font-bold">{t('contact.dialDesc')}</p>
                            </div>
                        </motion.div>

                        {/* Small Map Container */}
                        <motion.div variants={fadeIn} className="bg-white p-2 rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden h-72 relative group hover:p-0 transition-all duration-700">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.5827218357!2d79.77380311640626!3d6.9214421!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a70ad%3A0x2db2e1906c352a9c!2sColombo!5e0!3m2!1sen!2slk!4v1709400000000!5m2!1sen!2slk"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="rounded-[2.4rem] saturate-50 group-hover:saturate-100 transition-all duration-700 h-full w-full object-cover"
                            ></iframe>
                            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-black shadow-xl flex items-center gap-2 text-gray-800 border border-gray-100 uppercase tracking-tighter">
                                <MapPin className="w-3 h-3 text-red-500" /> Find our HQ
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Contact Form - RIGHT SIDE */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="lg:col-span-8"
                    >
                        <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-100 p-8 md:p-16 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-[10rem] pointer-events-none"></div>
                            
                            <div className="relative z-10">
                                <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">{t('contact.formTitle')}</h2>
                                <p className="text-gray-500 font-bold mb-12">We usually respond within 2-4 hours during business days.</p>

                                <form className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-sm font-black text-gray-900 uppercase tracking-widest pl-1">{t('contact.fullName')}</label>
                                            <input 
                                                type="text" 
                                                placeholder="John Doe" 
                                                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:bg-white focus:border-orange-500 transition-all font-bold text-gray-900 shadow-sm"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-black text-gray-900 uppercase tracking-widest pl-1">{t('contact.email')}</label>
                                            <input 
                                                type="email" 
                                                placeholder="john@example.com" 
                                                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:bg-white focus:border-orange-500 transition-all font-bold text-gray-900 shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-black text-gray-900 uppercase tracking-widest pl-1">{t('contact.category')}</label>
                                        <div className="relative">
                                            <select className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:bg-white focus:border-orange-500 transition-all font-bold text-gray-900 appearance-none shadow-sm cursor-pointer">
                                                <option>{t('contact.cat1')}</option>
                                                <option>{t('contact.cat2')}</option>
                                                <option>{t('contact.cat3')}</option>
                                                <option>{t('contact.cat4')}</option>
                                                <option>{t('contact.cat5')}</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <ChevronRight className="w-6 h-6 text-gray-400 rotate-90" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-black text-gray-900 uppercase tracking-widest pl-1">{t('contact.msg')}</label>
                                        <textarea 
                                            rows="5" 
                                            placeholder={t('contact.msgHolder')} 
                                            className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:bg-white focus:border-orange-500 transition-all font-bold text-gray-900 resize-none shadow-sm"
                                        ></textarea>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6">
                                        <button 
                                            type="submit" 
                                            className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-6 bg-orange-500 hover:bg-orange-600 text-white rounded-3xl font-black text-xl transition-all shadow-2xl shadow-orange-500/40 hover:-translate-y-2 group"
                                        >
                                            {t('contact.submit')} 
                                            <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </button>
                                        <div className="flex items-center gap-4 bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100">
                                            <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                            <span className="text-xs font-black text-emerald-800 uppercase tracking-widest">{t('contact.encryption')}</span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

