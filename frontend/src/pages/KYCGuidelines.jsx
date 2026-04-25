import { ShieldAlert, FileKey, CheckSquare, FileText, UploadCloud, Gavel } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const KYCGuidelines = () => {
    const { t } = useTranslation();
    return (
        <div className="bg-slate-50 min-h-screen">

            {/* Header Banner */}
            <div className="bg-orange-600 py-24 relative overflow-hidden flex justify-center items-center text-center">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDuration: '6s' }}></div>
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-red-500/20 rounded-full blur-[100px] translate-y-1/2 translate-x-1/4 animate-pulse" style={{ animationDuration: '4s' }}></div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="container-fluid relative z-10"
                >
                    <div className="w-20 h-20 bg-white/20 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/20 transform rotate-3">
                        <ShieldAlert className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">{t('kycDocs.title')}</h1>
                    <p className="text-lg text-orange-100 max-w-2xl mx-auto font-medium">{t('kycDocs.subtitle')}</p>
                </motion.div>
            </div>

            <div className="container-fluid py-16 -mt-12 relative z-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8 md:p-14 space-y-12 max-w-4xl mx-auto"
                >


                    <div className="flex justify-center md:justify-start items-center gap-3">
                        <FileKey className="w-8 h-8 text-orange-500" />
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">{t('kycDocs.acceptableDocs')}</h2>
                    </div>

                    <p className="text-gray-600 text-lg leading-relaxed max-w-3xl font-medium">
                        {t('kycDocs.acceptableDesc1')} <strong className="text-gray-900">{t('kycDocs.acceptableDescBold1')}</strong>
                        {t('kycDocs.acceptableDesc2')} <strong className="text-gray-900">{t('kycDocs.acceptableDescBold2')}</strong>
                        {t('kycDocs.acceptableDesc3')}
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="border-2 border-dashed border-gray-200 p-8 rounded-3xl flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-5 hover:border-orange-400 hover:bg-orange-50 transition-colors cursor-pointer group shadow-sm">
                            <div className="p-4 bg-gray-100 rounded-2xl text-gray-500 group-hover:bg-orange-500 group-hover:text-white transition-all transform group-hover:scale-110">
                                <FileText className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 mt-2 md:mt-0">{t('kycDocs.nicTitle')}</h3>
                                <p className="text-gray-500 font-medium">{t('kycDocs.nicDesc')}</p>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="border-2 border-dashed border-gray-200 p-8 rounded-3xl flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-5 hover:border-orange-400 hover:bg-orange-50 transition-colors cursor-pointer group shadow-sm">
                            <div className="p-4 bg-gray-100 rounded-2xl text-gray-500 group-hover:bg-orange-500 group-hover:text-white transition-all transform group-hover:scale-110">
                                <FileText className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 mt-2 md:mt-0">{t('kycDocs.passportTitle')}</h3>
                                <p className="text-gray-500 font-medium">{t('kycDocs.passportDesc')}</p>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-blue-50/50 border-2 border-blue-100 p-8 rounded-3xl border-l-[6px] border-l-blue-500 flex flex-col sm:flex-row items-center sm:items-start gap-6 mt-8 hover:shadow-lg transition-shadow">
                        <UploadCloud className="w-10 h-10 text-blue-600 shrink-0" />
                        <div className="w-full">
                            <h4 className="text-xl font-bold text-blue-900 mb-4 text-center sm:text-left">{t('kycDocs.uploadReqTitle')}</h4>
                            <div className="grid sm:grid-cols-2 gap-4 text-blue-800 font-medium">
                                <div className="flex items-center gap-3"><CheckSquare className="w-5 h-5 text-blue-500" /> {t('kycDocs.req1')}</div>
                                <div className="flex items-center gap-3"><CheckSquare className="w-5 h-5 text-blue-500" /> {t('kycDocs.req2')}</div>
                                <div className="flex items-center gap-3"><CheckSquare className="w-5 h-5 text-blue-500" /> {t('kycDocs.req3')}</div>
                                <div className="flex items-center gap-3"><CheckSquare className="w-5 h-5 text-blue-500" /> {t('kycDocs.req4')}</div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="pt-12 border-t border-gray-100 text-center">
                        <h3 className="text-2xl font-black text-gray-900 mb-4 items-center justify-center gap-2">{t('kycDocs.readyTitle')}</h3>
                        <p className="text-gray-500 font-medium mb-8 text-lg">{t('kycDocs.readyDesc')}</p>
                        <Link to="/dashboard" className="inline-flex items-center gap-2 px-10 py-5 bg-gray-900 hover:bg-black text-white font-bold text-lg rounded-2xl transition-all shadow-xl hover:-translate-y-1 hover:shadow-2xl">
                            {t('kycDocs.goDashboardBtn')} <Gavel className="w-5 h-5" />
                        </Link>
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

export default KYCGuidelines;
