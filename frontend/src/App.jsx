// Removed unused hooks
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts & Guard
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Auctions from './pages/Auctions';
import DirectBuy from './pages/DirectBuy';
import VehicleDetails from './pages/VehicleDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminAnalytics from './pages/SuperAdminAnalytics';
import AddVehicle from './pages/AddVehicle';
import RequestVehicle from './pages/RequestVehicle';
import Watchlist from './pages/Watchlist';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import RefundEscrowPolicy from './pages/RefundEscrowPolicy';
import KYCGuidelines from './pages/KYCGuidelines';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Careers from './pages/Careers';
import NotFound from './pages/NotFound';
import HowItWorks from './pages/HowItWorks';
import AuctionCalendar from './pages/AuctionCalendar';
import SellerVehicles from './pages/SellerVehicles';

import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import ScrollToTop from './components/ScrollToTop';

function App() {
    const { i18n } = useTranslation();

    useEffect(() => {
        // Update HTML lang attribute on change
        const updateLang = (lng) => {
            document.documentElement.lang = lng;
        };

        updateLang(i18n.language);
        i18n.on('languageChanged', updateLang);

        return () => {
            i18n.off('languageChanged', updateLang);
        };
    }, [i18n]);

    return (
        <BrowserRouter>
            <ScrollToTop />
            {/* Toast Notification Provider */}
            <Toaster
                position="top-right"
                toastOptions={{
                    style: { borderRadius: '12px', background: '#333', color: '#fff', fontWeight: 'bold' }
                }}
            />

            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="auctions" element={<Auctions />} />
                    <Route path="calendar" element={<AuctionCalendar />} />
                    <Route path="auctions/:id" element={<VehicleDetails />} />
                    <Route path="direct-buy" element={<DirectBuy />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="resetpassword/:token" element={<ResetPassword />} />
                    <Route path="privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="terms" element={<Terms />} />
                    <Route path="refund-policy" element={<RefundEscrowPolicy />} />
                    <Route path="kyc-guidelines" element={<KYCGuidelines />} />

                    {/* Protected Routes Block */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="watchlist" element={<Watchlist />} />
                        <Route path="sell" element={<AddVehicle />} />
                        <Route path="request-vehicle" element={<RequestVehicle />} />
                        <Route path="admin" element={<AdminDashboard />} />
                        <Route path="my-vehicles" element={<SellerVehicles />} />
                        <Route path="analytics" element={<SuperAdminAnalytics />} />
                    </Route>

                    <Route path="about" element={<About />} />
                    <Route path="how-it-works" element={<HowItWorks />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="faq" element={<FAQ />} />
                    <Route path="careers" element={<Careers />} />

                    {/* 404 Catch All */}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
