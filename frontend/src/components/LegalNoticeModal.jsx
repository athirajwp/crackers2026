import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export default function LegalNoticeModal() {
  const { settings, loading } = useStore();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen || loading || settings?.enable_legal_notice === 'no') return null;

  const storeName = settings?.store_name || 'Kavin Crackers';
  const licenseNo = settings?.license_no || '----';

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto select-none print:hidden">
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full border border-amber-200/80 shadow-2xl overflow-hidden relative my-auto transform transition-all animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner with Festive Theme Gradient */}
        <div className="bg-gradient-to-r from-crimson-700 via-crimson-600 to-crimson-800 text-white p-4 sm:p-5 text-center relative border-b border-crimson-900/40">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-3 right-3 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs transition-colors cursor-pointer"
            title="Close Notice"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur border border-white/20 mb-1.5 sm:mb-2 shadow-inner">
            <i className="fa-solid fa-scale-balanced text-gold-400 text-lg sm:text-xl"></i>
          </div>

          <h3 className="text-base sm:text-xl font-black tracking-tight text-white leading-snug uppercase">
            Statutory Legal Compliance Notice
          </h3>
          <p className="text-[9px] sm:text-[10px] text-gold-300 uppercase tracking-widest font-extrabold mt-0.5">
            Supreme Court Order Compliance
          </p>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 max-h-[58vh] sm:max-h-[65vh] overflow-y-auto text-xs sm:text-sm leading-relaxed text-slate-700 font-medium">
          
          <div className="bg-amber-50/90 border border-amber-200 rounded-xl sm:rounded-2xl p-3 flex items-start gap-2.5">
            <i className="fa-solid fa-triangle-exclamation text-amber-600 text-sm sm:text-base flex-shrink-0 mt-0.5"></i>
            <div className="text-[11px] sm:text-xs text-amber-950 font-bold leading-snug">
              As per 2018 Supreme Court order, online sale of firecrackers is not permitted! We value our customers and respect jurisdiction.
            </div>
          </div>

          <p className="text-slate-600 text-xs sm:text-[13px] leading-relaxed">
            This website is for product information and enquiry purposes only. No online sale or online payment for firecrackers is made through this website.
          </p>

          <p className="text-slate-600 text-xs sm:text-[13px] leading-relaxed">
            <strong className="text-crimson-600 font-black font-cinzel tracking-wide">{storeName}</strong> as a company follows 100% legal & statutory compliances and all our shops & go-downs are maintained as per the explosive acts. We send the parcels through registered and legal transport service providers as like every other major company in Sivakasi is doing so.
          </p>

        </div>

        {/* Footer Action */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 text-center">
          <button
            type="button"
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-crimson-600 to-crimson-500 hover:from-crimson-700 hover:to-crimson-600 text-white font-extrabold py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl sm:rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-crimson-600/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-circle-check text-gold-300 text-sm"></i>
            <span>I Understand &amp; Agree</span>
          </button>
        </div>

      </div>
    </div>
  );
}
