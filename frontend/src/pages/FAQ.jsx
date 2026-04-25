import { HelpCircle, ChevronDown, ChevronUp, MessageCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FAQ = () => {
    const { t } = useTranslation();
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = t('faq.list', { returnObjects: true });

    const toggleFAQ = (index) => {
        if (openIndex === index) {
            setOpenIndex(null);
        } else {
            setOpenIndex(index);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Header Banner */}
            <div className="bg-gray-900 py-24 relative overflow-hidden flex justify-center items-center text-center">
                <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 animate-pulse" style={{ animationDuration: '5s' }}></div>
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] translate-y-1/2 animate-pulse" style={{ animationDuration: '7s' }}></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="container-fluid relative z-10"
                >
                    <div className="w-20 h-20 bg-white/10 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl backdrop-blur-sm border border-white/10">
                        <HelpCircle className="w-10 h-10 text-indigo-300" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
                        {t('faq.title')}
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto font-medium">{t('faq.subtitle')}</p>
                </motion.div>
            </div>

            <div className="container-fluid py-16 -mt-12 relative z-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8 md:p-14 max-w-4xl mx-auto"
                >

                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                key={index}
                                className="border border-gray-200 rounded-3xl overflow-hidden hover:border-indigo-200 transition-colors shadow-sm"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full text-left px-8 py-6 flex justify-between items-center bg-gray-50/50 hover:bg-indigo-50/30 transition-colors focus:outline-none"
                                >
                                    <span className="font-bold text-gray-900 text-lg md:text-xl pr-4">{faq.question}</span>
                                    {openIndex === index ? (
                                        <div className="bg-indigo-100 p-2 rounded-full text-indigo-600 shrink-0"><ChevronUp className="w-5 h-5" /></div>
                                    ) : (
                                        <div className="bg-white border border-gray-200 p-2 rounded-full text-gray-400 shrink-0"><ChevronDown className="w-5 h-5" /></div>
                                    )}
                                </button>
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="px-8 pb-6 pt-2 bg-gray-50/50"
                                        >
                                            <p className="text-gray-600 leading-relaxed font-medium text-lg border-t border-gray-200 pt-6">
                                                {faq.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 bg-indigo-50/50 p-8 rounded-3xl">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3">
                                <MessageCircle className="w-8 h-8 text-indigo-500" /> {t('faq.stillHaveQuestions')}
                            </h3>
                            <p className="text-gray-600 font-medium">{t('faq.supportDesc')}</p>
                        </div>
                        <Link to="/contact" className="shrink-0 px-8 py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-xl hover:-translate-y-1 flex items-center gap-2">
                            {t('faq.contactSupport')} <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default FAQ;
