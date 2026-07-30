import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function StickyQuickOrderButton() {
  const { totalQty } = useStore();
  const location = useLocation();

  // Hide the floating Shop Now button when already on the Quick Order page
  if (
    location.pathname === '/quick-order' ||
    location.pathname === '/quick_order' ||
    location.pathname === '/quick-purchase'
  ) {
    return null;
  }

  // Position floating Shop Now button at the bottom right corner
  const bottomClass = totalQty > 0 ? 'bottom-20 sm:bottom-24' : 'bottom-4 sm:bottom-6';

  return (
    <div className={`fixed right-3 sm:right-6 ${bottomClass} z-40 transition-all duration-300 select-none`}>
      <Link
        to="/quick-order"
        className="group block relative"
        title="Quick Purchase Fireworks"
      >
        <img
          src="/img/quickpurchase.png"
          alt="Shop Now Quick Purchase"
          className="h-24 sm:h-[120px] md:h-[144px] w-auto object-contain animate-pulse hover:animate-none hover:scale-110 active:scale-95 transition-transform duration-300 drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
        />
      </Link>
    </div>
  );
}
