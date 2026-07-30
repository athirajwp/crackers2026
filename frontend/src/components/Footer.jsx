import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { getImageUrl } from '../utils/imageUrl';

export default function Footer() {
  const { settings, totalQty } = useStore();
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const storeName = settings?.store_name || 'Kavin Crackers';
  const storePhone = settings?.store_phone || '(+91) 99449 91600';
  const storeEmail = settings?.store_email || 'jackyjohnson18@gmail.com';
  const storeAddress = settings?.store_address || '9/346/6, Anuppankulam, Sivakasi Satur Main Road, Sivakasi, Anuppankulam, Tamil Nadu - 626 189';
  const licenseNo = settings?.license_no || '----';

  const isQuickOrderPage =
    location.pathname === '/quick-order' ||
    location.pathname === '/quick_order' ||
    location.pathname === '/quick-purchase';

  // Position Scroll To Top button cleanly ABOVE the floating Shop Now image button with high z-index to prevent overlap or div hiding
  const scrollTopBottomClass = isQuickOrderPage
    ? (totalQty > 0 ? 'bottom-24 sm:bottom-28' : 'bottom-6 sm:bottom-8')
    : (totalQty > 0 ? 'bottom-44 sm:bottom-52' : 'bottom-28 sm:bottom-32');

  return (
    <>
      <footer className="relative bg-[#0B132B] text-white select-none border-t border-slate-800 mt-auto pt-14 pb-8 overflow-hidden">
        {/* Soft Background Festive Glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">

          {/* TOP SECTION: 3-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

            {/* LEFT COLUMN: Store Title, Tagline & Vertical Quick Links */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  {storeName}
                </h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium mt-2 max-w-sm">
                  {settings?.store_description || 'We take immense pride in delivering the highest quality crackers that exceed your expectations.'}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg md:text-xl font-bold text-white tracking-tight">
                  Quick Links
                </h4>
                <ul className="space-y-2.5 text-xs md:text-sm font-semibold text-slate-200">
                  <li>
                    <Link to="/" className="hover:text-gold-400 transition-colors block">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="hover:text-gold-400 transition-colors block">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/price-list" className="hover:text-gold-400 transition-colors block">
                      Crackers Pricelist
                    </Link>
                  </li>
                  <li>
                    <Link to="/safety-tips" className="hover:text-gold-400 transition-colors block">
                      Safety Tips
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:text-gold-400 transition-colors block">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* CENTER COLUMN: Store Logo Display (No Circle Ring) */}
            <div className="flex flex-col items-center justify-center text-center py-4">
              <Link to="/" className="group inline-block">
                <div className="w-48 sm:w-56 md:w-64 max-h-56 flex items-center justify-center p-2 transition-transform duration-300 group-hover:scale-105">
                  {settings?.store_logo ? (
                    <img
                      src={getImageUrl(settings.store_logo)}
                      alt={storeName}
                      className="w-full h-full max-h-52 object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gold-400 py-4">
                      <i className="fa-solid fa-fire text-5xl mb-2"></i>
                      <span className="font-black text-xl text-white tracking-wider uppercase text-center">
                        {storeName}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </div>

            {/* RIGHT COLUMN: Contact Info */}
            <div className="space-y-5">
              <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Contact Info
              </h3>

              <div className="space-y-1.5">
                <h4 className="text-xs md:text-sm font-semibold text-slate-300">
                  Shop Location
                </h4>
                <p className="text-xs md:text-sm text-slate-200 font-semibold leading-relaxed max-w-sm">
                  {storeAddress}
                </p>
              </div>

              <div className="space-y-1">
                <a
                  href={`tel:${storePhone}`}
                  className="text-xs md:text-sm text-slate-200 font-bold hover:text-gold-400 transition-colors block"
                >
                  {storePhone}
                </a>
              </div>

              <div className="space-y-1">
                <a
                  href={`mailto:${storeEmail}`}
                  className="text-xs md:text-sm text-slate-200 font-bold hover:text-gold-400 transition-colors block"
                >
                  {storeEmail}
                </a>
              </div>
            </div>

          </div>

          {/* MIDDLE SECTION: Supreme Court Legal Notice */}
          <div className="mt-14 pt-8 border-t border-slate-800 max-w-5xl mx-auto text-center px-2 sm:px-4">
            <p className="text-xs sm:text-[13px] text-slate-300 font-semibold leading-relaxed">
              As per 2018 supreme court order, online sale of firecrackers are not permitted! We value our customers and at the same time, respect jurisdiction. We request you to add your products to the cart and submit the required crackers through the enquiry button. We will contact you within 24 hrs and confirm the order through WhatsApp or phone call. Please add and submit your enquiries and enjoy your Diwali with {storeName}. Our License No.{licenseNo ? ` ${licenseNo}` : '----'}. {storeName} as a company following 100% legal & statutory compliances and all our shops, go-downs are maintained as per the explosive acts. We send the parcels through registered and legal transport service providers as like every other major companies in Sivakasi is doing so.
            </p>
          </div>

          {/* BOTTOM SECTION: Copyright Bar */}
          <div className="mt-8 pt-4 border-t border-slate-800 text-center text-xs text-slate-400 font-medium">
            Copyright © {new Date().getFullYear()}, {storeName}. All Rights Reserved.
          </div>

        </div>
      </footer>

      {/* Floating Back to Top Button on Bottom Right (Positioned above Shop Now button with z-[99]) */}
      {showScrollTop && (
        <div className={`fixed ${scrollTopBottomClass} right-3 sm:right-6 z-[99] select-none pointer-events-auto transition-all duration-300`}>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-11 h-11 bg-gold-500 text-slate-900 rounded-xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border border-gold-400/30 group"
            title="Scroll to Top"
          >
            <i className="fa-solid fa-arrow-up text-sm group-hover:-translate-y-0.5 transition-transform font-black text-slate-950"></i>
          </button>
        </div>
      )}
    </>
  );
}
