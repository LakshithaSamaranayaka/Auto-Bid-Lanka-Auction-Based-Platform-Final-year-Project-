import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import { Gavel, Car, User, LogIn, LogOut, Globe, Heart, Menu, X, LayoutDashboard, HelpCircle, CalendarDays, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { t, i18n } = useTranslation();

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Hide navbar on scroll down, show on scroll up
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
                setIsMenuOpen(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        setIsMenuOpen(false);
    };

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'si' : 'en';
        i18n.changeLanguage(newLang);
    };

    const navLinks = [
        { name: t('nav.auctions'), path: '/auctions', icon: <Gavel className="w-5 h-5" /> },
        { name: t('nav.howItWorks'), path: '/how-it-works', icon: <HelpCircle className="w-5 h-5" /> },
        { name: t('nav.calendar') || 'Calendar', path: '/calendar', icon: <CalendarDays className="w-5 h-5" /> },
        { name: t('nav.directBuy'), path: '/direct-buy', icon: <Car className="w-5 h-5" /> },
        { name: t('nav.aboutUs'), path: '/about', icon: <Info className="w-5 h-5" /> },
    ];

    // ─── Mobile Drawer (rendered via portal to avoid z-index/stacking issues) ───
    const MobileDrawer = () => createPortal(
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                style={{ zIndex: 9998 }}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Drawer Panel */}
            <div
                className={`fixed top-0 right-0 bottom-0 w-[300px] sm:w-[360px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ zIndex: 9999 }}
            >
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
                        <div className="p-1.5 bg-orange-500 rounded-lg">
                            <Gavel className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-black text-xl tracking-tighter text-gray-900">
                            AutoBid<span className="text-orange-500">Lanka</span>
                        </span>
                    </Link>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-900"
                        aria-label="Close menu"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* User Info (if logged in) */}
                {isAuthenticated && (
                    <div className="mx-4 mt-4 p-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl flex items-center gap-3 shrink-0">
                        <div className="w-11 h-11 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-black text-lg border-2 border-orange-200 shrink-0">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="font-black text-white text-sm truncate">{user?.name}</p>
                            <p className="text-gray-400 text-[10px] font-medium truncate">{user?.email}</p>
                        </div>
                        <span className="ml-auto text-[9px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 px-2 py-1 rounded-lg border border-orange-500/20 shrink-0">
                            {user?.role}
                        </span>
                    </div>
                )}

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto py-4 px-4 space-y-6">
                    {/* Navigation Links */}
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-2">
                            {t('footer.quickLinks') || 'Navigate'}
                        </p>
                        <div className="space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all text-sm ${
                                        location.pathname === link.path
                                            ? 'bg-orange-50 text-orange-600'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <span className={location.pathname === link.path ? 'text-orange-500' : 'text-gray-400'}>
                                        {link.icon}
                                    </span>
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Account Section */}
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-2">Account</p>
                        <div className="space-y-1">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-4 px-4 py-3.5 text-gray-700 hover:bg-gray-50 rounded-2xl font-bold transition-all text-sm"
                                    >
                                        <LayoutDashboard className="w-5 h-5 text-gray-400" />
                                        {t('nav.dashboard') || 'Dashboard'}
                                    </Link>
                                    <Link
                                        to="/watchlist"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-4 px-4 py-3.5 text-gray-700 hover:bg-gray-50 rounded-2xl font-bold transition-all text-sm"
                                    >
                                        <Heart className="w-5 h-5 text-gray-400" />
                                        Watchlist
                                    </Link>
                                    {(user?.role === 'seller' || user?.role === 'admin') && (
                                        <Link
                                            to="/my-vehicles"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-4 px-4 py-3.5 text-gray-700 hover:bg-gray-50 rounded-2xl font-bold transition-all text-sm"
                                        >
                                            <Car className="w-5 h-5 text-gray-400" />
                                            Manage My Vehicles
                                        </Link>
                                    )}
                                    {(user?.role === 'seller' || user?.role === 'admin') && (
                                        <Link
                                            to="/sell"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-4 px-4 py-3.5 text-gray-900 bg-orange-50 hover:bg-orange-100 rounded-2xl font-bold transition-all text-sm mt-1"
                                        >
                                            <span className="p-1.5 bg-orange-500 rounded-lg text-white">
                                                <Car className="w-4 h-4" />
                                            </span>
                                            {t('nav.sell') || 'List Vehicle'}
                                        </Link>
                                    )}
                                    {user?.role === 'admin' && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-4 px-4 py-3.5 text-red-600 hover:bg-red-50 rounded-2xl font-bold transition-all text-sm"
                                        >
                                            <LayoutDashboard className="w-5 h-5 text-red-400" />
                                            {t('nav.adminPanel') || 'Admin Panel'}
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-4 px-4 py-3.5 text-gray-600 hover:bg-red-50 hover:text-red-500 rounded-2xl font-bold w-full text-left transition-all text-sm mt-2"
                                    >
                                        <LogOut className="w-5 h-5 text-gray-400" />
                                        {t('nav.logout') || 'Logout'}
                                    </button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 px-4 py-4 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-2xl font-black transition-all text-sm"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        {t('nav.login') || 'Login'}
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 px-4 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black shadow-lg shadow-orange-500/20 transition-all text-sm"
                                    >
                                        {t('nav.register') || 'Register'}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Language Switcher Footer */}
                <div className="px-4 pb-6 pt-4 bg-gray-50 border-t border-gray-100 shrink-0">
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center justify-between w-full p-4 bg-white hover:bg-gray-50 text-gray-900 rounded-2xl font-black transition-all border border-gray-100 shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-orange-500" />
                            <span className="text-sm">{i18n.language === 'en' ? 'English (US)' : 'සිංහල (SL)'}</span>
                        </div>
                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-2 py-1 rounded-md border border-orange-100">
                            Switch
                        </span>
                    </button>
                </div>
            </div>
        </>,
        document.body
    );

    return (
        <>
            <header
                className={`bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-orange-50 transition-all duration-500 ${
                    isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
                }`}
            >
                <div className="container-fluid">
                    <div className="flex justify-between items-center h-16 sm:h-20">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-1.5 sm:gap-2.5 group z-50">
                            <div className="p-1.5 sm:p-2 bg-gradient-to-tr from-orange-500 to-orange-400 rounded-xl group-hover:shadow-lg group-hover:shadow-orange-500/20 transition-all">
                                <Gavel className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <span className="text-lg sm:text-2xl font-[1000] text-gray-900 tracking-tighter leading-none">
                                AutoBid<span className="text-orange-500">Lanka</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-gray-600 hover:text-orange-500 font-medium transition-colors text-sm ${
                                        location.pathname === link.path ? 'text-orange-600 font-bold' : ''
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Desktop-only actions */}
                            <div className="hidden md:flex items-center gap-2 sm:gap-3">
                                {isAuthenticated ? (
                                    <>
                                        {user?.role === 'admin' && (
                                            <Link
                                                to="/analytics"
                                                className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold rounded-lg text-sm transition-colors"
                                            >
                                                {t('nav.analytics')}
                                            </Link>
                                        )}
                                        {user?.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 font-bold rounded-lg text-sm transition-colors"
                                            >
                                                {t('nav.adminPanel')}
                                            </Link>
                                        )}
                                        {(user?.role === 'seller' || user?.role === 'admin') && (
                                            <Link
                                                to="/sell"
                                                className="px-3 py-1.5 bg-gray-900 text-white hover:bg-black font-semibold rounded-lg text-sm transition-colors"
                                            >
                                                {t('nav.sell')}
                                            </Link>
                                        )}
                                    </>
                                ) : null}
                                <button
                                    onClick={toggleLanguage}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-bold text-sm transition-colors border border-gray-200"
                                >
                                    <Globe className="w-4 h-4 text-orange-500" />
                                    <span className="hidden lg:inline">{t('nav.language')}</span>
                                </button>
                            </div>

                            {/* Auth Icons */}
                            {isAuthenticated ? (
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <Link
                                        to="/watchlist"
                                        className="p-2 text-gray-400 hover:text-orange-500 transition-colors rounded-lg hover:bg-orange-50"
                                        title="Watchlist"
                                    >
                                        <Heart className="w-5 h-5" />
                                    </Link>
                                    <Link
                                        to="/dashboard"
                                        className="flex items-center gap-2 p-1.5 text-gray-700 hover:text-orange-600 font-bold transition-colors hover:bg-orange-50 rounded-xl"
                                    >
                                        <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="hidden xl:inline text-sm">{t('nav.dashboard')}</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 hidden sm:block"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="hidden md:flex items-center gap-1 sm:gap-3">
                                    <Link
                                        to="/login"
                                        className="flex items-center gap-2 text-gray-600 hover:text-orange-500 font-bold transition-colors px-2 py-2 text-sm"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        {t('nav.login')}
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl font-black transition-all shadow-lg shadow-gray-900/10 text-xs sm:text-sm"
                                    >
                                        {t('nav.register')}
                                    </Link>
                                </div>
                            )}

                            {/* Hamburger Button - visible below lg breakpoint */}
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="p-2 ml-1 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-colors lg:hidden"
                                aria-label="Open menu"
                                aria-expanded={isMenuOpen}
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer via Portal */}
            <MobileDrawer />
        </>
    );
};

export default Navbar;
