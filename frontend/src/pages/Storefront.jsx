import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useStore } from '../context/StoreContext';
import HeroSlider from '../components/HeroSlider';
import CategoryCarousel from '../components/CategoryCarousel';
import StatsHighlights from '../components/StatsHighlights';
import ProductTable from '../components/ProductTable';
import CartFooter from '../components/CartFooter';
import CheckoutDrawer from '../components/CheckoutDrawer';
import diwaliKidsHD from '../assets/diwali-kids-hd.png';
import { getImageUrl } from '../utils/imageUrl';

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

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: false,
      mirror: true,
    });
    AOS.refresh();
  }, []);

  const logoSrc = getImageUrl(settings.store_logo, '');

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
        <div className="rounded-3xl border border-[#fde6d0] p-6 md:p-8 shadow-sm space-y-8 overflow-hidden" style={{background: 'linear-gradient(135deg, #fff8f0 0%, #fdebd0 40%, #fef3e2 70%, #fff8f0 100%)'}}>

          {/* Welcome Text & Image Block */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Text Content */}
            <div className="md:col-span-7 space-y-4 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 bg-gold-50 border border-gold-200 text-gold-800 text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-sm">
                <i className="fa-solid fa-star text-gold-600"></i> Sivakasi Direct Wholesale Shop
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                Welcome to <span className="text-crimson-500 font-cinzel tracking-wider">{settings.store_name || 'Cracker Shope'}</span>
              </h2>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
                We are Sivakasi's premier online fireworks ordering platform, dedicated to delivering 100% original, certified high-quality crackers directly from the manufacturing hub of Sivakasi. Choose from our extensive collection of sparkling sparklers, traditional ground chakkars, vibrant flower pots, thunderous sound crackers, multi-shot aerial repeaters, and fancy sky displays at unbeatable factory rates with <strong className="text-crimson-600 font-extrabold">Flat {settings.discount_percent}% Wholesale Discount!</strong>
              </p>
            </div>

            {/* Right: Diwali Kids Image with Vibrant Glowing Sparklers */}
            <div className="md:col-span-5 flex justify-center items-center relative group">
              <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg flex items-center justify-center">

                {/* Left Boy Sparkler Glowing Sparks Burst */}
                <div className="absolute top-[8%] left-[8%] w-16 h-16 pointer-events-none z-20 flex items-center justify-center">
                  <div className="absolute w-10 h-10 rounded-full bg-amber-400/50 blur-md animate-ping"></div>
                  <div className="absolute w-5 h-5 rounded-full bg-crimson-500/60 blur-sm animate-pulse"></div>
                  <i className="fa-solid fa-sparkles text-amber-400 text-2xl animate-spin" style={{ animationDuration: '3s' }}></i>
                  <i className="fa-solid fa-star text-rose-500 text-xs absolute -top-2 -left-2 animate-bounce"></i>
                  <i className="fa-solid fa-star text-gold-300 text-sm absolute -bottom-1 -right-2 animate-ping"></i>
                  <i className="fa-solid fa-bolt text-amber-300 text-xs absolute top-0 -right-3 animate-pulse"></i>
                </div>

                {/* Right Girl Sparkler Glowing Sparks Burst */}
                <div className="absolute top-[10%] right-[8%] w-16 h-16 pointer-events-none z-20 flex items-center justify-center">
                  <div className="absolute w-10 h-10 rounded-full bg-rose-400/50 blur-md animate-ping" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute w-5 h-5 rounded-full bg-gold-400/60 blur-sm animate-pulse"></div>
                  <i className="fa-solid fa-sparkles text-rose-500 text-2xl animate-spin" style={{ animationDuration: '2.5s' }}></i>
                  <i className="fa-solid fa-star text-amber-400 text-xs absolute -top-2 -right-2 animate-bounce"></i>
                  <i className="fa-solid fa-star text-cyan-300 text-sm absolute -bottom-2 -left-1 animate-ping"></i>
                  <i className="fa-solid fa-bolt text-purple-400 text-xs absolute bottom-1 -right-3 animate-pulse"></i>
                </div>

                <img
                  src={diwaliKidsHD}
                  alt="Diwali Fireworks Celebration"
                  className="w-full h-auto max-h-72 md:max-h-80 lg:max-h-96 object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>


          {/* Booking Info Alert Bar */}
          <div className="bg-white/80 backdrop-blur border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-700 shadow-sm">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-wand-magic-sparkles text-gold-600 text-sm"></i>
              <span>✨ Light up your celebrations for less! Get Sivakasi fireworks straight from our factory at the best wholesale prices</span>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Link to="/quick-order" className="w-full sm:w-auto text-center bg-crimson-600 hover:bg-crimson-700 text-white px-5 py-2 rounded-xl text-[10px] uppercase tracking-wider font-extrabold transition-colors shadow">
                Quick Order
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

      {/* 4. Stats & Highlights Banner Section */}
      <StatsHighlights />

      {/* 4. Why Choose Us — Logo Center Section */}
      <section className="container mx-auto px-4 py-8 select-none z-10 relative">
        <div className="rounded-3xl overflow-hidden" style={{background: 'linear-gradient(135deg, #fff8f0 0%, #fdebd0 40%, #fef3e2 70%, #fff8f0 100%)'}}>
          <div className="p-8 md:p-14">

            {/* Heading */}
            <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-12" data-aos="fade-down" data-aos-duration="1000">
              <span className="text-slate-800">Festival celebration with</span><br />
              <span className="text-crimson-500 font-cinzel tracking-wide">{settings.store_name || 'Our Store'}</span>
            </h2>

            {/* MOBILE: 2 items top | logo middle | 2 items bottom | DESKTOP: 3-column */}

            {/* Mobile Top Row — Quality + Genuine Price */}
            <div className="grid grid-cols-2 gap-6 md:hidden mb-6">
              {/* Quality */}
              <div className="flex flex-col items-center text-center gap-2" data-aos="fade-right" data-aos-duration="800">
                <div className="relative w-14 h-14 flex items-center justify-center mb-1">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-md">
                    <i className="fa-solid fa-check text-white text-lg font-black"></i>
                  </div>
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 flex items-center justify-center">
                    <i className="fa-solid fa-ribbon text-crimson-500 text-sm"></i>
                  </div>
                </div>
                <h4 className="text-sm font-black text-crimson-500">Quality</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">Quality &amp; innovation are the key behind our success</p>
              </div>
              {/* Genuine Price */}
              <div className="flex flex-col items-center text-center gap-2" data-aos="fade-left" data-aos-duration="800">
                <div className="w-16 h-16 flex items-center justify-center mb-1">
                  <i className="fa-solid fa-tag text-pink-500 text-6xl rotate-[-30deg]"></i>
                </div>
                <h4 className="text-sm font-black text-crimson-500">Genuine Price</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">Quality products at economic price is the main motto for us</p>
              </div>
            </div>

            {/* Mobile Logo — centered between rows if custom logo exists */}
            {logoSrc && (
              <div className="flex md:hidden items-center justify-center my-4" data-aos="zoom-in" data-aos-duration="800">
                <img
                  src={logoSrc}
                  alt={settings.store_name || "Company Logo"}
                  className="w-48 object-contain drop-shadow-xl"
                />
              </div>
            )}

            {/* Mobile Bottom Row — Safe to Use + Customer Satisfaction */}
            <div className="grid grid-cols-2 gap-6 md:hidden mt-6">
              {/* Safe to Use */}
              <div className="flex flex-col items-center text-center gap-2" data-aos="fade-right" data-aos-duration="800" data-aos-delay="200">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-md mb-1">
                  <i className="fa-solid fa-shield-check text-white text-xl"></i>
                </div>
                <h4 className="text-sm font-black text-crimson-500">Safe to Use</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">Crackers we offer are safe &amp; made from fine quality raw materials</p>
              </div>
              {/* Customer Satisfaction */}
              <div className="flex flex-col items-center text-center gap-2" data-aos="fade-left" data-aos-duration="800" data-aos-delay="200">
                <div className="flex items-end gap-1 mb-1">
                  <i className="fa-solid fa-star text-amber-400 text-3xl md:text-[34px]"></i>
                  <i className="fa-solid fa-star text-amber-400 text-4xl md:text-[42px]"></i>
                  <i className="fa-solid fa-star text-amber-300 text-3xl md:text-[34px]"></i>
                </div>
                <h4 className="text-sm font-black text-crimson-500">Customer Satisfaction</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">Our quality and timely delivery has attracted customers easily</p>
              </div>
            </div>

            {/* DESKTOP: 3-column layout — hidden on mobile */}
            <div className="hidden md:grid grid-cols-3 gap-4 items-center">
              {/* Left Features */}
              <div className="flex flex-col gap-10">
                {/* Quality */}
                <div className="flex flex-col items-center text-center gap-2" data-aos="fade-right" data-aos-duration="800" data-aos-delay="100">
                  <div className="relative w-14 h-14 flex items-center justify-center mb-1">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-md">
                      <i className="fa-solid fa-check text-white text-lg font-black"></i>
                    </div>
                    <div className="absolute -bottom-1 -left-1 w-5 h-5 flex items-center justify-center">
                      <i className="fa-solid fa-ribbon text-crimson-500 text-sm"></i>
                    </div>
                  </div>
                  <h4 className="text-base font-black text-crimson-500">Quality</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium max-w-[180px]">Quality &amp; innovation are the key behind our success</p>
                </div>
                {/* Safe to Use */}
                <div className="flex flex-col items-center text-center gap-2" data-aos="fade-right" data-aos-duration="800" data-aos-delay="300">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-md mb-1">
                    <i className="fa-solid fa-shield-check text-white text-xl"></i>
                  </div>
                  <h4 className="text-base font-black text-crimson-500">Safe to Use</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium max-w-[180px]">Crackers we offer are safe &amp; are made from fine quality raw materials</p>
                </div>
              </div>

              {/* Center Logo */}
              <div className="flex items-center justify-center" data-aos="zoom-in" data-aos-duration="1000" data-aos-delay="200">
                {logoSrc ? (
                  <img
                    src={logoSrc}
                    alt={settings.store_name || "Company Logo"}
                    className="w-72 lg:w-80 object-contain drop-shadow-xl"
                  />
                ) : null}
              </div>

              {/* Right Features */}
              <div className="flex flex-col gap-10">
                {/* Genuine Price */}
                <div className="flex flex-col items-center text-center gap-2" data-aos="fade-left" data-aos-duration="800" data-aos-delay="100">
                  <div className="w-16 h-16 flex items-center justify-center mb-1">
                    <i className="fa-solid fa-tag text-pink-500 text-6xl rotate-[-30deg]"></i>
                  </div>
                  <h4 className="text-base font-black text-crimson-500">Genuine Price</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium max-w-[180px]">Quality products at economic price is the main motto for us</p>
                </div>
                {/* Customer Satisfaction */}
                <div className="flex flex-col items-center text-center gap-2" data-aos="fade-left" data-aos-duration="800" data-aos-delay="300">
                  <div className="flex items-end gap-1 mb-1">
                    <i className="fa-solid fa-star text-amber-400 text-3xl md:text-[34px]"></i>
                    <i className="fa-solid fa-star text-amber-400 text-4xl md:text-[42px]"></i>
                    <i className="fa-solid fa-star text-amber-300 text-3xl md:text-[34px]"></i>
                  </div>
                  <h4 className="text-base font-black text-crimson-500">Customer Satisfaction</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium max-w-[180px]">Our quality and timely delivery has attracted customers easily</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

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
              <i className="fa-solid fa-list-check mr-2"></i> Open Quick Order
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
