import { Link } from 'react-router-dom';
import { Gavel, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8 border-t-4 border-orange-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand & Intro */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="p-1.5 bg-orange-500 rounded-lg">
                                <Gavel className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">
                                AutoBid <span className="text-orange-500">Lanka</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            {t('footer.desc')}
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors"><Facebook className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors"><Linkedin className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white tracking-wide uppercase text-sm">{t('footer.quickLinks')}</h3>
                        <ul className="space-y-3">
                            <li><Link to="/auctions" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">{t('footer.liveAuctions')}</Link></li>
                            <li><Link to="/direct-buy" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">{t('footer.directBuy')}</Link></li>
                            <li><Link to="/how-it-works" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">{t('footer.howItWorks')}</Link></li>
                            <li><Link to="/sell" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">{t('footer.sellCar')}</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">{t('footer.about')}</Link></li>
                            <li><Link to="/faq" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">{t('footer.faq')}</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">{t('footer.contactHelp')}</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white tracking-wide uppercase text-sm">{t('footer.legal')}</h3>
                        <ul className="space-y-3">
                            <li><Link to="/privacy-policy" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">{t('footer.privacy')}</Link></li>
                            <li><Link to="/terms" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">{t('footer.terms')}</Link></li>
                            <li><Link to="/refund-policy" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">{t('footer.refund')}</Link></li>
                            <li><Link to="/kyc-guidelines" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">{t('footer.kyc')}</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white tracking-wide uppercase text-sm">{t('footer.contactUs')}</h3>
                        <ul className="space-y-4 pt-1">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
                                <span className="text-gray-400 text-sm">No. 456, Auto Plaza, Galle Road, Colombo 03, Sri Lanka</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-orange-500 shrink-0" />
                                <span className="text-gray-400 text-sm">+94 11 234 5678</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-orange-500 shrink-0" />
                                <span className="text-gray-400 text-sm">support@autobidlanka.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm text-center md:text-left">
                        &copy; {new Date().getFullYear()} {t('footer.copyright')}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs">{t('footer.secure')}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
