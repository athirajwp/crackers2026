import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useStore } from '../context/StoreContext';

export default function BestSellersSlider({ onPreviewProduct }) {
  const {
    categories,
    settings,
    cart,
    increaseQty,
    decreaseQty,
    updateQty,
  } = useStore();

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Gather all products from categories
  const allProducts = (categories || []).flatMap((cat) =>
    (cat.products || []).map((p) => ({
      ...p,
      categoryName: cat.name,
      categorySlug: cat.slug,
    }))
  );

  // Filter most sold / best seller products
  const flaggedBestsellers = allProducts.filter(
    (p) => p.is_bestseller || p.is_featured || p.is_popular || p.featured || (p.sales_count && p.sales_count > 0)
  );

  // Fallback to top products if no specific bestseller flag is set
  const bestsellers = flaggedBestsellers.length >= 4 ? flaggedBestsellers : allProducts.slice(0, 12);

  const itemsPerPage = isMobile ? 3 : 4;
  const totalPages = Math.max(1, Math.ceil(bestsellers.length / itemsPerPage));

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
  }, []);

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (totalPages <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalPages);
    }, 4000);
    return () => clearInterval(timer);
  }, [totalPages]);

  const handlePrev = () => {
    setActiveSlide((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % totalPages);
  };

  const formatCurrency = (val) => {
    return parseFloat(val || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  const getSlideItems = (page) => {
    const startIdx = page * itemsPerPage;
    return bestsellers.slice(startIdx, startIdx + itemsPerPage);
  };

  if (bestsellers.length === 0) return null;

  return (
    <div className="w-full mb-5 select-none" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">
      <div 
        className="rounded-2xl border border-[#fde6d0] p-3 sm:p-4 md:p-5 shadow-xs relative overflow-hidden" 
        style={{ background: 'linear-gradient(135deg, #fff8f0 0%, #fdebd0 40%, #fef3e2 70%, #fff8f0 100%)' }}
      >
        {/* Soft Sparkle Background Details */}
        <div className="absolute inset-0 pointer-events-none opacity-15">
          <div className="absolute top-2 left-6 w-2 h-2 bg-amber-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-4 right-10 w-2.5 h-2.5 bg-crimson-500 rotate-45 animate-pulse"></div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5 relative z-10">
          <div className="space-y-0.5 text-center sm:text-left">
            <span className="inline-flex items-center gap-1 bg-gold-50 border border-gold-200 text-gold-800 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-2xs">
              <i className="fa-solid fa-fire text-crimson-600 animate-pulse text-[8px]"></i> Fast-Selling Crackers
            </span>
            <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-900 tracking-tight">
              Most Sold <span className="text-crimson-600 font-cinzel">Products</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Sivakasi's highest-demanded festive crackers — add directly to your quick order
            </p>
          </div>

          {/* Navigation Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center sm:justify-end gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={handlePrev}
                className="w-7 h-7 rounded-lg bg-white border border-amber-200 text-slate-700 hover:bg-crimson-600 hover:text-white hover:border-crimson-600 shadow-2xs flex items-center justify-center transition-all active:scale-95"
                aria-label="Previous most sold products"
              >
                <i className="fa-solid fa-chevron-left text-[10px]"></i>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-7 h-7 rounded-lg bg-white border border-amber-200 text-slate-700 hover:bg-crimson-600 hover:text-white hover:border-crimson-600 shadow-2xs flex items-center justify-center transition-all active:scale-95"
                aria-label="Next most sold products"
              >
                <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </button>
            </div>
          )}
        </div>

        {/* Products Grid Slider (3 items on Mobile, 4 items on Desktop) */}
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-3 relative z-10">
          {getSlideItems(activeSlide).map((prod) => {
            const cartItem = cart[prod.id];
            const qty = cartItem ? cartItem.qty : 0;
            const discountPercent = settings.discount_percent || 60;
            const mrp = parseFloat(prod.mrp || 0);
            const sellingPrice = parseFloat(prod.selling_price || 0);

            return (
              <div
                key={`${activeSlide}-${prod.id}`}
                className={`bg-white border rounded-lg sm:rounded-xl p-1.5 sm:p-2.5 shadow-2xs hover:shadow-xs transition-all duration-300 flex flex-col justify-between relative group ${
                  qty > 0 ? 'border-crimson-500 ring-2 ring-crimson-500/20' : 'border-slate-200/80 hover:border-gold-400'
                }`}
              >
                {/* Top Badges */}
                <div className="flex items-center justify-between gap-0.5 mb-1">
                  <span className="bg-gradient-to-r from-crimson-600 to-crimson-700 text-white text-[7px] sm:text-[8.5px] font-black px-1 sm:px-1.5 py-0.5 rounded uppercase tracking-tight sm:tracking-wider shadow-2xs flex items-center gap-0.5 truncate">
                    <i className="fa-solid fa-fire text-[6.5px] sm:text-[7.5px] text-gold-400"></i> <span className="hidden sm:inline">Most Sold</span><span className="sm:hidden">Hot</span>
                  </span>
                  {mrp > sellingPrice && (
                    <span className="bg-gold-500 text-slate-950 text-[7px] sm:text-[8.5px] font-black px-1 sm:px-1.5 py-0.5 rounded uppercase tracking-tight sm:tracking-wider shadow-2xs">
                      {discountPercent}%
                    </span>
                  )}
                </div>

                {/* Product Image Block */}
                <div
                  onClick={() => prod.image && onPreviewProduct && onPreviewProduct(prod)}
                  className="w-full h-16 sm:h-28 bg-slate-50 rounded-md sm:rounded-lg border border-slate-100 flex items-center justify-center overflow-hidden mb-1 sm:mb-2 cursor-pointer group-hover:bg-amber-50/30 transition-colors relative"
                >
                  {prod.image ? (
                    <img
                      src={`/${prod.image}`}
                      alt={prod.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                      }}
                      className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300 filter drop-shadow-2xs"
                    />
                  ) : null}
                  <div
                    className={`${prod.image ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-amber-500`}
                  >
                    <i className="fa-solid fa-fire-burner text-lg sm:text-2xl"></i>
                  </div>
                </div>

                {/* Product Info */}
                <div className="mb-1 sm:mb-2">
                  <h4 className="font-black text-[9.5px] sm:text-xs text-slate-900 leading-tight sm:leading-snug line-clamp-1 hover:text-crimson-600 transition-colors">
                    {prod.name}
                  </h4>
                </div>

                {/* Quick Add / Quantity Controls */}
                <div className="pt-1 border-t border-slate-100">
                  {qty === 0 ? (
                    <button
                      type="button"
                      onClick={() => increaseQty(prod)}
                      className="w-full bg-crimson-600 hover:bg-crimson-700 active:scale-98 text-white font-extrabold text-[9px] sm:text-[11px] py-1 px-1 sm:py-1.5 sm:px-2 rounded sm:rounded-lg transition-all shadow-2xs flex items-center justify-center gap-0.5"
                    >
                      <i className="fa-solid fa-plus text-[8px] sm:text-[9px]"></i>
                      <span className="truncate">Add</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between bg-crimson-50 border border-crimson-200 rounded sm:rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => decreaseQty(prod.id)}
                        className="w-4 h-4 sm:w-6 sm:h-6 bg-white text-crimson-700 border border-crimson-200 rounded flex items-center justify-center hover:bg-crimson-600 hover:text-white transition-colors active:scale-95 shadow-2xs"
                      >
                        <i className="fa-solid fa-minus text-[7px] sm:text-[9px]"></i>
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={qty}
                        onChange={(e) => updateQty(prod, parseInt(e.target.value) || 0)}
                        className="w-5 sm:w-8 text-center font-black text-[9.5px] sm:text-xs text-crimson-900 bg-transparent focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => increaseQty(prod)}
                        className="w-4 h-4 sm:w-6 sm:h-6 bg-crimson-600 text-white rounded flex items-center justify-center hover:bg-crimson-700 transition-colors active:scale-95 shadow-2xs"
                      >
                        <i className="fa-solid fa-plus text-[7px] sm:text-[9px]"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Dots */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-3.5 relative z-10">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeSlide === i
                    ? 'w-5 bg-crimson-600'
                    : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
