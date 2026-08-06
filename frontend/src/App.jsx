import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { StoreProvider, useStore } from './context/StoreContext';
import { getImageUrl } from './utils/imageUrl';
import Header from './components/Header';
import Footer from './components/Footer';
import Storefront from './pages/Storefront';
import About from './pages/About';
import Terms from './pages/Terms';
import PriceList from './pages/PriceList';
import TrackOrder from './pages/TrackOrder';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Contact from './pages/Contact';
import QuickOrder from './pages/QuickOrder';
import Fireworks from './components/Fireworks';
import StickyQuickOrderButton from './components/StickyQuickOrderButton';
import CheckoutDrawer from './components/CheckoutDrawer';
import LoadingScreen from './components/LoadingScreen';

// Admin imports
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminProducts from './pages/admin/AdminProducts';
import AdminInventory from './pages/admin/AdminInventory';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetails from './pages/admin/AdminOrderDetails';
import AdminOrderEditItems from './pages/admin/AdminOrderEditItems';
import AdminInvoice from './pages/admin/AdminInvoice';
import AdminSettings from './pages/admin/AdminSettings';
import AdminBranding from './pages/admin/AdminBranding';
import AdminReports from './pages/admin/AdminReports';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminProfile from './pages/admin/AdminProfile';
import AdminBilling from './pages/admin/AdminBilling';

// Super Admin (admin_sys) React imports
import AdminSysLayout from './pages/admin_sys/AdminSysLayout';
import AdminSysLogin from './pages/admin_sys/AdminSysLogin';
import AdminSysCompany from './pages/admin_sys/AdminSysCompany';
import AdminSysProfile from './pages/admin_sys/AdminSysProfile';

function PublicLayout() {
  const { loading, settings, checkoutOpen, setCheckoutOpen, totalQty } = useStore();
  const [companyInfo, setCompanyInfo] = useState({ name: '', logo: '' });

  useEffect(() => {
    if (settings?.enable_aos === 'no') {
      AOS.init({ disable: true });
    } else {
      AOS.init({
        disable: false,
        duration: 800,
        easing: 'ease-out-cubic',
        once: false,
        offset: 40,
      });
      AOS.refresh();
    }

    const el = document.getElementById('laravel-company');
    if (el) {
      try {
        const data = JSON.parse(el.textContent);
        if (data) {
          setCompanyInfo({
            name: data.name || '',
            logo: data.logo || ''
          });
        }
      } catch (e) {}
    }
  }, [settings?.enable_aos]);

  const displayName = settings?.store_name || companyInfo.name || 'Sivakasi Fireworks';
  const logoPath = settings?.store_logo || companyInfo.logo || '';
  const displayLogo = logoPath ? getImageUrl(logoPath) : null;

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-crimson-50 relative overflow-hidden">
      {/* Background soft festive glow bursts */}
      <div className="absolute left-0 top-0 w-96 h-96 rounded-full pointer-events-none opacity-20" style={{background: 'radial-gradient(circle, rgba(220,38,38,0.18) 0%, rgba(234,179,8,0.12) 50%, transparent 70%)', filter: 'blur(40px)'}}></div>
      <div className="absolute right-0 top-1/4 w-[500px] h-[500px] rounded-full pointer-events-none opacity-15" style={{background: 'radial-gradient(circle, rgba(251,191,36,0.25) 0%, rgba(220,38,38,0.12) 50%, transparent 70%)', filter: 'blur(50px)'}}></div>
      <div className="absolute left-1/4 bottom-1/4 w-[400px] h-[400px] rounded-full pointer-events-none opacity-15" style={{background: 'radial-gradient(circle, rgba(220,38,38,0.15) 0%, rgba(251,191,36,0.12) 50%, transparent 70%)', filter: 'blur(40px)'}}></div>

      {settings?.enable_fireworks === 'yes' && <Fireworks />}
      <Header />
      <main className="flex-grow relative z-10">
        <Outlet />
      </main>

      {/* Left Floating Action Contact Buttons (Call & WhatsApp) — 10% larger, hidden when cart/checkout active */}
      {!checkoutOpen && totalQty === 0 && (
        <div className="fixed left-4 bottom-5 z-40 flex flex-col gap-2.5 select-none print:hidden">
          {/* Call Button */}
          <a
            href={`tel:${settings.store_phone || ''}`}
            className="group flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-crimson-600 hover:bg-crimson-700 text-white rounded-full shadow-lg shadow-crimson-900/30 hover:scale-110 active:scale-95 transition-all duration-300"
            title="Call Us Now"
          >
            <i className="fa-solid fa-phone-volume text-sm sm:text-base animate-bounce"></i>
          </a>

          {/* WhatsApp Button */}
          <a
            href={`https://wa.me/${(settings.store_whatsapp || '919998887776').replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-900/30 hover:scale-110 active:scale-95 transition-all duration-300"
            title="Chat on WhatsApp"
          >
            <i className="fa-brands fa-whatsapp text-base sm:text-lg"></i>
          </a>
        </div>
      )}

      <StickyQuickOrderButton />
      <Footer />
      <CheckoutDrawer isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          {/* Public Pages Layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<QuickOrder />} />
            <Route path="/home" element={<Storefront />} />
            <Route path="/quick-order" element={<QuickOrder />} />
            <Route path="/quick_order" element={<QuickOrder />} />
            <Route path="/quick-purchase" element={<QuickOrder />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/price-list" element={<PriceList />} />
            <Route path="/price_list" element={<PriceList />} />
            <Route path="/track" element={<TrackOrder />} />
            <Route path="/checkout/success/:orderNumber" element={<CheckoutSuccess />} />
          </Route>

          {/* Standalone Admin Pages */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/orders/:id/invoice" element={<AdminInvoice />} />

          {/* Protected Admin Console Pages */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
          <Route path="/admin/orders/:id/edit-items" element={<AdminOrderEditItems />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/inventory" element={<AdminInventory />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/branding" element={<AdminBranding />} />
          <Route path="/admin/billing" element={<AdminBilling />} />
          <Route path="/admin/profile" element={<AdminProfile />} />

          {/* Super Admin Console Pages (admin_sys in React) */}
          <Route path="/admin_sys/login" element={<AdminSysLogin />} />
          <Route path="/admin_sys" element={<AdminSysLayout />}>
            <Route index element={<AdminSysCompany />} />
            <Route path="company" element={<AdminSysCompany />} />
            <Route path="profile" element={<AdminSysProfile />} />
          </Route>
        </Routes>
      </Router>
    </StoreProvider>
  );
}

export default App;
