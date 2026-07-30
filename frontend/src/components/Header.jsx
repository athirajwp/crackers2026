import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { getImageUrl } from '../utils/imageUrl';

export default function Header() {
  const {
    settings,
    totalQty,
    totalNet,
    setCheckoutOpen,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const alerts = [
    settings.marquee_alert_1,
    settings.marquee_alert_2,
    settings.marquee_alert_3,
    settings.marquee_alert_4,
    settings.marquee_alert_5,
    settings.marquee_alert_6,
  ].filter(Boolean);

  if (alerts.length === 0) {
    alerts.push(
      "Special Offer: 60% Discount on all items!",
      "Free Delivery on orders above Rs. 5000!"
    );
  }

  const isActive = (path) => location.pathname === path;

  const formatCurrency = (val) => {
    return parseFloat(val || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  const getGoogleMapsUrl = () => {
    if (settings.store_map_iframe) {
      let url = '';
      const match = settings.store_map_iframe.match(/src=["']([^"']+)["']/);
      if (match && match[1]) {
        url = match[1];
      } else if (settings.store_map_iframe.trim().startsWith('http')) {
        url = settings.store_map_iframe.trim();
      }
      
      if (url) {
        // Try to parse 'q' query parameter (e.g., embed/v1/place?q=...)
        try {
          const parsedUrl = new URL(url);
          const qParam = parsedUrl.searchParams.get('q');
          if (qParam) {
            return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(qParam)}`;
          }
        } catch(e) {}

        // Match pb format !2s... (standard Google Maps Embed pb query string)
        const queryMatch = url.match(/!2s([^!&]+)/);
        if (queryMatch && queryMatch[1]) {
          try {
            const decodedQuery = decodeURIComponent(queryMatch[1]);
            return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(decodedQuery)}`;
          } catch (e) {}
        }
        
        // Return parsed URL directly if we couldn't extract a search query
        return url;
      }
    }
    
    // Fallback: standard Google Maps search using the store address
    const addressQuery = encodeURIComponent(settings.store_address || 'Virudhunagar to Sivakasi Main Road, Sivakasi');
    return `https://www.google.com/maps/search/?api=1&query=${addressQuery}`;
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: 'fa-house', isLink: true },
    { to: '/quick-order', label: 'Quick Order', icon: 'fa-list-check', isLink: true },
    { to: '/price-list', label: 'Price List', icon: 'fa-tags', isLink: true },
    { to: '/track', label: 'Track Order', icon: 'fa-truck-fast', isLink: true },
    { to: '/about', label: 'About Us', icon: 'fa-circle-info', isLink: true },
    { to: '/contact', label: 'Contact', icon: 'fa-envelope', isLink: true },
  ];

  return (
    <>
      {/* ROW 1: Top Marquee & Admin Bar */}
      <div className="bg-crimson-600 text-slate-100 text-[10px] sm:text-xs py-2 font-bold shadow-sm select-none border-b border-crimson-700">
        <div className="container mx-auto px-4 flex justify-between items-center gap-4">
          <div className="flex-grow overflow-hidden relative">
            <marquee behavior="scroll" direction="left" scrollamount="4" className="w-full">
              <div className="flex items-center gap-12 py-0.5">
                {alerts.map((alert, idx) => (
                  <span key={idx} className="inline-flex items-center gap-2 whitespace-nowrap">
                    <i className="fa-solid fa-star text-gold-500 animate-pulse text-[9px]"></i>
                    <span dangerouslySetInnerHTML={{ __html: alert }}></span>
                    {idx < alerts.length - 1 && <span className="text-slate-300 font-bold mx-2">|</span>}
                  </span>
                ))}
              </div>
            </marquee>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <a href={`/admin/login${location.search}`} target="_blank" rel="noreferrer" className="hover:text-gold-500 transition-colors flex items-center gap-1.5 whitespace-nowrap">
              <i className="fa-solid fa-user-shield text-gold-500"></i>
              <span>Admin Portal Login</span>
            </a>
          </div>
        </div>
      </div>

      {/* ROW 2: Light Festive Brand Bar — theme color background in light mode */}
      <div className="relative bg-crimson-50 border-b border-crimson-100 py-1.5 sm:py-2 select-none overflow-hidden">

        {/* Left soft festive glow */}
        <div className="absolute left-0 top-0 h-full w-48 pointer-events-none" style={{background: 'radial-gradient(ellipse at 10% 50%, rgba(220,38,38,0.08) 0%, rgba(234,179,8,0.05) 40%, transparent 70%)'}}></div>
        <div className="absolute left-8 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full pointer-events-none opacity-20" style={{background: 'radial-gradient(circle, rgba(251,191,36,0.4) 0%, rgba(220,38,38,0.2) 50%, transparent 70%)', filter: 'blur(12px)'}}></div>

        {/* Right soft festive glow */}
        <div className="absolute right-0 top-0 h-full w-48 pointer-events-none" style={{background: 'radial-gradient(ellipse at 90% 50%, rgba(220,38,38,0.08) 0%, rgba(234,179,8,0.05) 40%, transparent 70%)'}}></div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full pointer-events-none opacity-20" style={{background: 'radial-gradient(circle, rgba(251,191,36,0.4) 0%, rgba(220,38,38,0.2) 50%, transparent 70%)', filter: 'blur(12px)'}}></div>

        <div className="container mx-auto px-4 relative z-10">

          {/* MOBILE LAYOUT (< 768px): Logo left | Address center | Phone button right */}
          <div className="flex md:hidden items-center justify-between gap-2 py-1">
            {/* LEFT: Circular Logo */}
            <Link to="/" className="group flex-shrink-0">
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-105 p-1 shadow-sm border border-gold-400/40">
                {settings.store_logo ? (
                  <img
                    src={getImageUrl(settings.store_logo)}
                    alt={settings.store_name || 'Company Logo'}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <i className="fa-solid fa-fire text-2xl text-gold-500"></i>
                )}
              </div>
            </Link>

            {/* CENTER: Address Block */}
            <a
              href={getGoogleMapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex flex-col items-center justify-center text-center gap-0.5 group/address hover:scale-105 transition-transform duration-200 px-1"
            >
              <h3 className="text-crimson-700 font-extrabold text-[11px] uppercase tracking-wider group-hover/address:text-crimson-600 transition-colors">Address</h3>
              <p className="text-slate-800 text-[10px] sm:text-[11px] font-bold leading-tight max-w-[170px] sm:max-w-xs">
                {settings.store_address || 'Virudhunagar to Sivakasi Main Road, Sivakasi'}
              </p>
              <span className="text-[9px] sm:text-[10px] font-black text-gold-600 group-hover/address:text-gold-500 flex items-center gap-1 mt-0.5 underline decoration-dotted transition-colors">
                <i className="fa-solid fa-location-dot animate-bounce text-[9px]"></i> Shop Location
              </span>
            </a>

            {/* RIGHT: Mobile Numbers */}
            <div className="flex flex-col items-center text-center gap-0.5 flex-shrink-0">
              <h3 className="text-crimson-700 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider">
                Mobile Numbers
              </h3>
              <div className="flex flex-col items-center justify-center gap-0.5">
                {settings.store_phone ? (
                  <a
                    href={`tel:${settings.store_phone}`}
                    className="text-slate-900 text-[10px] sm:text-xs font-black hover:text-crimson-700 transition-colors block"
                  >
                    {settings.store_phone}
                  </a>
                ) : (
                  <span className="text-slate-900 text-[10px] sm:text-xs font-black">+91 99449 91600</span>
                )}
                {settings.store_phone_2 && (
                  <a
                    href={`tel:${settings.store_phone_2}`}
                    className="text-slate-900 text-[10px] sm:text-xs font-black hover:text-crimson-700 transition-colors block"
                  >
                    {settings.store_phone_2}
                  </a>
                )}
                {settings.store_phone_3 && (
                  <a
                    href={`tel:${settings.store_phone_3}`}
                    className="text-slate-900 text-[10px] sm:text-xs font-black hover:text-crimson-700 transition-colors block"
                  >
                    {settings.store_phone_3}
                  </a>
                )}
                {settings.store_phone_4 && (
                  <a
                    href={`tel:${settings.store_phone_4}`}
                    className="text-slate-900 text-[10px] sm:text-xs font-black hover:text-crimson-700 transition-colors block"
                  >
                    {settings.store_phone_4}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* DESKTOP LAYOUT (>= 768px): 3-Column horizontal centered bar */}
          <div className="hidden md:flex items-center justify-center gap-12 lg:gap-16 py-1">
            {/* LEFT: Circular Logo */}
            <Link to="/" className="group flex-shrink-0">
              <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-105 p-1.5 shadow-sm">
                {settings.store_logo ? (
                  <img
                    src={getImageUrl(settings.store_logo)}
                    alt={settings.store_name || 'Company Logo'}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <i className="fa-solid fa-fire text-3xl text-gold-500"></i>
                )}
              </div>
            </Link>

            {/* CENTER: Address */}
            <a
              href={getGoogleMapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center text-center gap-1 group/address hover:scale-105 transition-transform duration-200"
            >
              <h3 className="text-crimson-700 font-extrabold text-sm uppercase tracking-widest group-hover/address:text-crimson-600 transition-colors">Address</h3>
              <p className="text-slate-800 text-sm font-bold leading-relaxed max-w-sm">
                {settings.store_address || 'Virudhunagar to Sivakasi Main Road, Sivakasi'}
              </p>
              <span className="text-xs font-black text-gold-600 group-hover/address:text-gold-500 flex items-center gap-1 mt-0.5 underline decoration-dotted transition-colors">
                <i className="fa-solid fa-location-dot animate-bounce text-[10px]"></i> Shop Location
              </span>
            </a>

            {/* RIGHT: Mobile Numbers */}
            <div className="flex flex-col items-center text-center gap-0.5 flex-shrink-0">
              <h3 className="text-crimson-700 font-extrabold text-xs uppercase tracking-widest">Mobile Numbers</h3>
              <div className="flex flex-col items-center justify-center gap-0.5">
                {settings.store_phone && (
                  <a href={`tel:${settings.store_phone}`} className="text-slate-900 text-xs font-black hover:text-crimson-700 transition-colors block">
                    {settings.store_phone}
                  </a>
                )}
                {settings.store_phone_2 && (
                  <a href={`tel:${settings.store_phone_2}`} className="text-slate-900 text-xs font-black hover:text-crimson-700 transition-colors block">
                    {settings.store_phone_2}
                  </a>
                )}
                {settings.store_phone_3 && (
                  <a href={`tel:${settings.store_phone_3}`} className="text-slate-900 text-xs font-black hover:text-crimson-700 transition-colors block">
                    {settings.store_phone_3}
                  </a>
                )}
                {settings.store_phone_4 && (
                  <a href={`tel:${settings.store_phone_4}`} className="text-slate-900 text-xs font-black hover:text-crimson-700 transition-colors block">
                    {settings.store_phone_4}
                  </a>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ROW 3: Main Navigation Bar */}
      <div className="bg-crimson-600 select-none shadow-md border-t border-crimson-700/60">
        <div className="container mx-auto">

          {/* Mobile Navigation Bar (Left: Social Media Links | Middle: Cart | Right: Nav Dot Button) */}
          <div className="flex md:hidden items-center justify-between px-3 py-1.5 gap-2">
            {/* Left: Social Media Links */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <a
                href={`https://wa.me/${settings.store_whatsapp || settings.store_phone || '919998887776'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-lg bg-emerald-500/90 hover:bg-emerald-500 text-white flex items-center justify-center transition-all shadow-xs hover:scale-110"
                title="WhatsApp"
              >
                <i className="fa-brands fa-whatsapp text-xs"></i>
              </a>
              <a
                href={settings.instagram_url || 'https://instagram.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 text-white flex items-center justify-center transition-all shadow-xs hover:scale-110"
                title="Instagram"
              >
                <i className="fa-brands fa-instagram text-xs"></i>
              </a>
              <a
                href={settings.facebook_url || 'https://facebook.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center transition-all shadow-xs hover:scale-110"
                title="Facebook"
              >
                <i className="fa-brands fa-facebook-f text-xs"></i>
              </a>
              <a
                href={settings.youtube_url || 'https://youtube.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-lg bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-xs hover:scale-110"
                title="YouTube"
              >
                <i className="fa-brands fa-youtube text-xs"></i>
              </a>
            </div>

            {/* Middle: Cart Button */}
            <div className="flex-1 flex justify-center px-1">
              <button
                onClick={() => setCheckoutOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 active:bg-white/30 text-white font-extrabold text-[10px] uppercase tracking-wider border border-white/20 transition-all backdrop-blur shadow-sm"
              >
                <i className="fa-solid fa-bag-shopping text-gold-400 text-[10px]"></i>
                <span>Cart</span>
                {totalQty > 0 && (
                  <span className="bg-gold-400 text-crimson-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ml-0.5">
                    {totalQty}
                  </span>
                )}
              </button>
            </div>

            {/* Right: Nav Dot Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 border border-white/20 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center backdrop-blur transition-all shadow-sm flex-shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              <i className={mobileMenuOpen ? 'fa-solid fa-xmark text-base text-gold-400' : 'fa-solid fa-bars text-base text-gold-400'}></i>
            </button>
          </div>

          {/* Desktop Navigation Bar */}
          <div className="hidden md:flex items-center justify-between px-6">
            <div className="flex items-center justify-center flex-1">
              {navLinks.map((link, idx) => {
                const active = link.isLink && isActive(link.to);
                const linkClass = `flex items-center gap-2 px-5 py-3.5 text-[11px] font-extrabold uppercase tracking-widest whitespace-nowrap transition-all duration-150 border-r border-crimson-500
                  ${active
                    ? 'bg-gold-500 text-crimson-800 shadow-inner'
                    : 'text-white hover:bg-crimson-700 hover:text-gold-300'}`;

                return link.isLink ? (
                  <Link key={link.to} to={link.to} className={linkClass}>
                    <i className={`fa-solid ${link.icon} text-[10px]`}></i>
                    <span>{link.label}</span>
                  </Link>
                ) : (
                  <a key={link.to} href={link.to} className={linkClass}>
                    <i className={`fa-solid ${link.icon} text-[10px]`}></i>
                    <span>{link.label}</span>
                  </a>
                );
              })}
            </div>

            {/* Desktop Social Media Icons */}
            <div className="flex items-center gap-2 border-l border-crimson-500/80 pl-4 py-2">
              <a
                href={`https://wa.me/${settings.store_whatsapp || settings.store_phone || '919998887776'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-lg bg-emerald-500/90 hover:bg-emerald-500 text-white flex items-center justify-center transition-all shadow-xs hover:scale-110"
                title="WhatsApp"
              >
                <i className="fa-brands fa-whatsapp text-xs"></i>
              </a>
              <a
                href={settings.instagram_url || 'https://instagram.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 text-white flex items-center justify-center transition-all shadow-xs hover:scale-110"
                title="Instagram"
              >
                <i className="fa-brands fa-instagram text-xs"></i>
              </a>
              <a
                href={settings.facebook_url || 'https://facebook.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center transition-all shadow-xs hover:scale-110"
                title="Facebook"
              >
                <i className="fa-brands fa-facebook-f text-xs"></i>
              </a>
              <a
                href={settings.youtube_url || 'https://youtube.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-lg bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-xs hover:scale-110"
                title="YouTube"
              >
                <i className="fa-brands fa-youtube text-xs"></i>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-md select-none">
          {navLinks.map((link) => (
            link.isLink ? (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-5 py-3 text-xs font-bold border-b border-slate-100 transition-colors
                  ${isActive(link.to) ? 'bg-gold-50 text-crimson-600 border-l-4 border-l-gold-500' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <i className={`fa-solid ${link.icon} text-crimson-500 text-sm w-4`}></i>
                <span className="uppercase tracking-wide">{link.label}</span>
              </Link>
            ) : (
              <a
                key={link.to}
                href={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-5 py-3 text-xs font-bold border-b border-slate-100 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <i className={`fa-solid ${link.icon} text-crimson-500 text-sm w-4`}></i>
                <span className="uppercase tracking-wide">{link.label}</span>
              </a>
            )
          ))}
        </div>
      )}
    </>
  );
}
