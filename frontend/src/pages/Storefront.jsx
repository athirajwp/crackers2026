import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import HeroSlider from '../components/HeroSlider';
import CategoryCarousel from '../components/CategoryCarousel';
import ProductTable from '../components/ProductTable';
import CartFooter from '../components/CartFooter';
import CheckoutDrawer from '../components/CheckoutDrawer';
import diwaliKidsHD from '../assets/diwali-kids-hd.jpg';

export default function Storefront() {
  const {
    settings,
    loading,
    checkoutOpen,
    setCheckoutOpen,
    categories,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    totalQty,
    totalNet,
    viewMode,
    changeViewMode,
    totalFilteredProductsCount,
  } = useStore();

  const [deptMenuOpen, setDeptMenuOpen] = useState(false);

  const handleCategorySelect = (slug) => {
    setActiveCategory(slug);
    setDeptMenuOpen(false);
    const el = document.getElementById('quick-order');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const formatCurrency = (val) => {
    return parseFloat(val || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <i className="fa-solid fa-spinner animate-spin text-3xl text-crimson-600"></i>
        <p className="text-sm font-semibold text-slate-500">Loading Sivakasi Fireworks store...</p>
      </div>
    );
  }

  return (
    <div className="relative text-slate-800">

      {/* 1. Hero Image Slider Section */}
      <HeroSlider />

      {/* 2. Welcome & Value Proposition Grid */}
      <section className="container mx-auto px-4 py-8 select-none z-10 relative">
        <div className="bg-[#EFEBE8] border border-[#E2DDD9] rounded-3xl p-6 md:p-8 shadow-sm space-y-8">

          {/* Welcome Text & Image Block */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Text Content */}
            <div className="md:col-span-7 space-y-4 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 bg-gold-50 border border-gold-200 text-gold-800 text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-sm">
                <i className="fa-solid fa-star text-gold-600"></i> Sivakasi Direct Wholesale Shop
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                Welcome to <span className="text-crimson-500">{settings.store_name?.toUpperCase() || 'CRACKER SHOPE'}</span>
              </h2>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
                We are Sivakasi's premier online fireworks ordering platform, dedicated to delivering 100% original, certified high-quality crackers directly from the manufacturing hub of Sivakasi. Choose from our extensive collection of sparkling sparklers, traditional ground chakkars, vibrant flower pots, thunderous sound crackers, multi-shot aerial repeaters, and fancy sky displays at unbeatable factory rates with <strong className="text-crimson-600 font-extrabold">Flat {settings.discount_percent}% Wholesale Discount!</strong>
              </p>
            </div>

            {/* Right: Diwali Kids Image */}
            <div className="md:col-span-5 flex justify-center items-center overflow-hidden">
              <img
                src={diwaliKidsHD}
                alt="Diwali Fireworks Celebration"
                className="w-full max-w-sm md:max-w-md lg:max-w-lg max-h-72 md:max-h-80 lg:max-h-96 object-contain drop-shadow-sm transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* Value Proposition Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gold-500 flex items-center justify-center flex-shrink-0 text-slate-900 shadow-sm">
                <i className="fa-solid fa-truck-fast text-lg text-crimson-600"></i>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Fast Lorry Delivery</h4>
                <p className="text-[10.5px] text-slate-500 leading-normal font-semibold">Safe transport directly from Sivakasi to your doorstep.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gold-500 flex items-center justify-center flex-shrink-0 text-slate-900 shadow-sm">
                <i className="fa-solid fa-tags text-lg text-crimson-600"></i>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Flat {settings.discount_percent}% Off</h4>
                <p className="text-[10.5px] text-slate-500 leading-normal font-semibold">Direct factory pricing with maximum booking discounts.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gold-500 flex items-center justify-center flex-shrink-0 text-slate-900 shadow-sm">
                <i className="fa-solid fa-credit-card text-lg text-crimson-600"></i>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Secure Billing</h4>
                <p className="text-[10.5px] text-slate-500 leading-normal font-semibold">100% verified booking and convenient offline banking options.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gold-500 flex items-center justify-center flex-shrink-0 text-slate-900 shadow-sm">
                <i className="fa-solid fa-shield-halved text-lg text-crimson-600"></i>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">PESO Certified</h4>
                <p className="text-[10.5px] text-slate-500 leading-normal font-semibold">100% compliant with PESO and Supreme Court guidelines.</p>
              </div>
            </div>
          </div>

          {/* Booking Info Alert Bar */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation text-gold-600 text-sm"></i>
              <span>Minimum order value is <strong className="text-crimson-600 font-extrabold">₹{formatCurrency(settings.min_order_value)}</strong>. Add crackers to your cart to checkout.</span>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Link to="/quick-order" className="w-full sm:w-auto text-center bg-crimson-600 hover:bg-crimson-700 text-white px-5 py-2 rounded-xl text-[10px] uppercase tracking-wider font-extrabold transition-colors shadow">
                Start Order
              </Link>
              <Link to="/price-list" className="w-full sm:w-auto text-center bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-5 py-2 rounded-xl text-[10px] uppercase tracking-wider font-extrabold transition-colors">
                Price List
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Shop Our Products 3D Carousel Section */}
      <CategoryCarousel />

      {/* 4. Quick Order Banner Card */}
      <section className="container mx-auto px-4 py-8 select-none z-10 relative">
        <div className="bg-gradient-to-r from-crimson-700 via-crimson-600 to-crimson-800 text-white rounded-3xl p-8 shadow-lg text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 border border-crimson-800">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur border border-white/20 text-gold-400 text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full">
              <i className="fa-solid fa-bolt text-gold-400"></i> Fast Wholesale Ordering
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Ready to Order Firecrackers at Factory Wholesale Prices?
            </h3>
            <p className="text-xs md:text-sm text-crimson-100 font-medium leading-relaxed">
              Browse our complete catalog with live search, category filtering, and instant bulk quantity calculation on our Quick Order page!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
            <Link
              to="/quick-order"
              className="bg-gold-500 hover:bg-gold-400 text-slate-950 font-black px-7 py-3.5 rounded-2xl text-xs uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all text-center"
            >
              <i className="fa-solid fa-list-check mr-2"></i> Open Quick Order Sheet
            </Link>
            <Link
              to="/price-list"
              className="bg-white/10 hover:bg-white/20 text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs uppercase tracking-widest border border-white/20 backdrop-blur transition-all text-center"
            >
              <i className="fa-solid fa-file-pdf mr-2"></i> Download Price List
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Sticky Floating Footer Cart Tally (if items in cart) */}
      <CartFooter onCheckoutClick={() => setCheckoutOpen(true)} />

      {/* 5. Slide-out Checkout Drawer */}
      <CheckoutDrawer isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />

    </div>
  );
}
