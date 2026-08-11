import React from 'react';
import { useStore } from '../context/StoreContext';

export default function CartFooter({ onCheckoutClick }) {
  const {
    settings,
    totalQty,
    totalMrp,
    totalNet,
    totalUniqueProducts,
    clearCart,
    setCheckoutOpen,
  } = useStore();

  const enableMinOrder = settings.enable_min_order === 'yes';
  const minOrderValue = settings.min_order_value || 3800;

  const minOrderProgressPercent = () => {
    if (totalNet >= minOrderValue) return 100;
    return (totalNet / minOrderValue) * 100;
  };

  const minOrderProgressText = () => {
    if (totalNet >= minOrderValue) return 'Met!';
    const needed = minOrderValue - totalNet;
    return `Need ₹${needed.toFixed(2)} more`;
  };

  const formatCurrency = (val) => {
    return parseFloat(val || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  const handleClearCart = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (window.Swal) {
      window.Swal.fire({
        title: 'Clear Cart?',
        text: 'Are you sure you want to remove all items from your cart?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e51d1d',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Yes, clear it!',
        cancelButtonText: 'No, keep it',
      }).then((result) => {
        if (result.isConfirmed) {
          clearCart();
          window.Swal.fire({
            title: 'Cleared!',
            text: 'Your cart has been cleared successfully.',
            icon: 'success',
            confirmButtonColor: '#e51d1d',
            timer: 1500,
            showConfirmButton: false,
          });
        }
      });
    } else {
      if (window.confirm('Are you sure you want to clear your cart?')) {
        clearCart();
      }
    }
  };

  if (totalQty === 0) return null;

  const isCheckoutDisabled = enableMinOrder && totalNet < minOrderValue;

  const handleCheckoutBtnClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isCheckoutDisabled) {
      const needed = minOrderValue - totalNet;
      if (window.Swal) {
        window.Swal.fire({
          icon: 'warning',
          title: 'Minimum Order Not Met',
          html: `<div className="text-xs text-slate-600">Your total net booking is <strong>₹${formatCurrency(totalNet)}</strong>. The minimum order value is <strong>₹${formatCurrency(minOrderValue)}</strong>.<br/><br/><span className="text-crimson-600 font-bold">Please add ₹${formatCurrency(needed)} more items to your cart to proceed with checkout.</span></div>`,
          confirmButtonColor: '#dc2626',
          confirmButtonText: 'Continue Shopping',
        });
      } else {
        alert(`Minimum order value is ₹${formatCurrency(minOrderValue)}. Please add ₹${formatCurrency(needed)} more items to proceed.`);
      }
      return;
    }

    if (typeof onCheckoutClick === 'function') {
      onCheckoutClick();
    } else {
      setCheckoutOpen(true);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200/90 shadow-[0_-5px_25px_rgba(0,0,0,0.18)] py-2.5 sm:py-3 px-3 sm:px-6 select-none print:hidden pointer-events-auto">
      {/* Top slim progress bar for min order limit */}
      {enableMinOrder && totalNet < minOrderValue && (
        <div className="w-full bg-slate-100 h-1 absolute top-0 left-0 right-0 overflow-hidden">
          <div
            className="bg-gradient-to-r from-crimson-600 to-amber-500 h-full transition-all duration-300"
            style={{ width: `${minOrderProgressPercent()}%` }}
          ></div>
        </div>
      )}

      <div className="container mx-auto max-w-6xl flex items-center justify-between gap-2 sm:gap-4">

        {/* Left: Totals Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4 text-slate-800">
          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 font-bold whitespace-nowrap">
            <span className="uppercase tracking-wider text-[9px] sm:text-[10px] text-slate-400">Total:</span>
            <strong className="text-crimson-600 font-black text-xs sm:text-sm">{totalQty}</strong>
            <span className="text-slate-300">/</span>
            <strong className="text-slate-700">{totalUniqueProducts}</strong>
            <span className="text-[9px] text-slate-400 uppercase hidden xs:inline">Items</span>
          </div>

          <span className="hidden sm:inline text-slate-300">|</span>

          <div className="flex items-center gap-1 whitespace-nowrap">
            <span className="uppercase tracking-wider text-[9px] sm:text-[10px] text-slate-400 font-extrabold">Net:</span>
            <strong className="text-sm sm:text-lg font-black text-crimson-600">₹{formatCurrency(totalNet)}</strong>
          </div>
        </div>

        {/* Center: Min Order Status Message (Desktop only) */}
        {enableMinOrder && totalNet < minOrderValue && (
          <div className="hidden lg:flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-[10px] text-amber-800 font-bold">
            <i className="fa-solid fa-circle-info text-amber-600"></i>
            <span>Min order check: <strong className="text-crimson-600">{minOrderProgressText()}</strong></span>
          </div>
        )}

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          
          {/* Clear Cart Button */}
          <button
            type="button"
            onClick={handleClearCart}
            className="px-2.5 py-2 sm:px-4 sm:py-2 rounded-xl text-[10px] sm:text-xs font-extrabold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1 bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900 active:scale-95 shadow-sm cursor-pointer"
            title="Clear all cart items"
          >
            <i className="fa-solid fa-trash-can text-crimson-600 text-xs sm:text-sm"></i>
            <span className="hidden xs:inline">Clear</span>
          </button>

          {/* Checkout Now Button */}
          <button
            type="button"
            onClick={handleCheckoutBtnClick}
            className={`px-3.5 py-2 sm:px-6 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
              !isCheckoutDisabled
                ? 'bg-gradient-to-r from-crimson-600 to-crimson-500 hover:from-crimson-700 hover:to-crimson-600 text-white shadow-lg shadow-crimson-600/30 hover:scale-105 active:scale-95'
                : 'bg-slate-300 border border-slate-400 text-slate-700 hover:bg-slate-400/40'
            }`}
          >
            <i className="fa-solid fa-basket-shopping text-xs sm:text-base"></i>
            <span>Checkout Now</span>
          </button>

        </div>
      </div>
    </div>
  );
}


