import React, { useState, useEffect } from 'react';

export default function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup whenever the website is opened / loaded
    setIsOpen(true);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      {/* Blurred Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-amber-50 via-white to-amber-50/50 rounded-2xl sm:rounded-3xl shadow-2xl border border-amber-300/60 overflow-hidden my-auto transform transition-all duration-300 scale-100">
        {/* Top Decorative Header bar */}
        <div className="bg-gradient-to-r from-crimson-700 via-crimson-600 to-amber-600 px-6 py-4 sm:py-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 backdrop-blur-sm border border-amber-300/40 flex items-center justify-center text-amber-300 shrink-0">
              <i className="fa-solid fa-scale-balanced text-xl"></i>
            </div>
            <div>
              <h3 className="font-bold text-lg sm:text-xl tracking-wide text-amber-100 drop-shadow-sm">
                Statutory Disclaimer & Compliance
              </h3>
              <p className="text-xs text-amber-200/90 font-medium">Please read before proceeding</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-amber-100 flex items-center justify-center transition-colors shrink-0"
            aria-label="Close modal"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar text-slate-700 text-sm sm:text-base leading-relaxed">
          <div className="p-4 rounded-xl bg-amber-100/70 border border-amber-300/70 text-amber-900 flex items-start gap-3">
            <i className="fa-solid fa-triangle-exclamation text-amber-600 text-xl mt-0.5 shrink-0"></i>
            <p className="font-semibold text-xs sm:text-sm">
              Supreme Court Guidelines & Legal Notice
            </p>
          </div>

          <p className="text-slate-700 text-justify">
            As per 2018 Supreme Court Order, Online Sale of Firecrackers are NOT permitted. We Value our customers and at the same time, we respect the jurisdiction. We request our customers to Select Your Products in Estimate Page to see your Estimation and Submit the required crackers through the Get Estimate Button. We will contact you within 2 hrs and Confirm the Order through Phone Call. Please Add and Submit Your enquiries and enjoy your Diwali with Jai Balaji Crackers. Jai Balaji Crackers is a shop following 100% legal & statutory compliances and all our shops, go-downs are maintained as per the explosive acts. We send the parcels through registered and legal transport service providers as like every other major Companies in Sivakasi is doing so.
          </p>
        </div>

        {/* Modal Footer / Action Button */}
        <div className="px-6 py-4 sm:py-5 bg-gradient-to-r from-amber-100/80 to-amber-50 border-t border-amber-200/80 flex items-center justify-end gap-3">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-crimson-600 to-amber-600 hover:from-crimson-700 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg shadow-crimson-700/20 hover:shadow-crimson-700/40 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-circle-check text-amber-300"></i>
            <span>I Understand & Continue</span>
          </button>
        </div>
      </div>
    </div>
  );
}
