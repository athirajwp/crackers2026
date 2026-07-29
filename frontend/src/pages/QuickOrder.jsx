import React from 'react';
import ProductTable from '../components/ProductTable';
import CartFooter from '../components/CartFooter';
import CheckoutDrawer from '../components/CheckoutDrawer';
import { useStore } from '../context/StoreContext';

export default function QuickOrder() {
  const { loading, checkoutOpen, setCheckoutOpen } = useStore();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <i className="fa-solid fa-spinner animate-spin text-3xl text-crimson-600"></i>
        <p className="text-sm font-semibold text-slate-500">Loading Quick Order Sheet...</p>
      </div>
    );
  }

  return (
    <div className="relative text-slate-800 animate-fade-in">
      {/* Quick Order Header Title Banner */}
      <div className="bg-gradient-to-r from-crimson-700 via-crimson-600 to-crimson-800 text-white py-6 shadow-md border-b border-crimson-800 select-none">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 px-3 py-0.5 rounded-full text-[10px] uppercase font-black tracking-widest text-gold-400">
              <i className="fa-solid fa-list-check text-gold-400"></i> Wholesale Quick Purchase Sheet
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
              Direct Factory Wholesale Quick Order Sheet
            </h1>
          </div>
        </div>
      </div>

      {/* Product Catalog Table Section */}
      <div className="pt-2">
        <ProductTable />
      </div>

      {/* Cart Summary Sticky Footer Bar */}
      <CartFooter />

      {/* Sliding Checkout Drawer */}
      <CheckoutDrawer isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  );
}
