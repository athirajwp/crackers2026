import React from 'react';
import HeroSlider from '../components/HeroSlider';
import BestSellersSlider from '../components/BestSellersSlider';
import ProductTable from '../components/ProductTable';
import CartFooter from '../components/CartFooter';
import CheckoutDrawer from '../components/CheckoutDrawer';
import { useStore } from '../context/StoreContext';

export default function QuickOrder() {
  const {
    settings,
    loading,
    checkoutOpen,
    setCheckoutOpen,
    searchQuery,
    setSearchQuery,
    viewMode,
    changeViewMode,
    totalFilteredProductsCount,
    totalQty,
    totalNet,
  } = useStore();

  const formatCurrency = (val) => {
    return parseFloat(val || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

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

      {/* Quick Order Banner Slider (Visible ONLY if banner images uploaded via Admin) */}
      <HeroSlider
        customImages={[
          settings?.quick_order_banner_1,
          settings?.quick_order_banner_2,
          settings?.quick_order_banner_3,
        ]}
        hideIfEmpty={true}
      />

      {/* 1. Sticky Yellow Search & Filter Bar — Top of Quick Order Page */}
      <div className="sticky top-0 z-30 bg-gold-500 shadow-lg select-none border-b-2 border-gold-600">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 py-3">

          {/* Left/Center: Search Input */}
          <div className="relative w-full md:max-w-[420px] flex items-center">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <i className="fa-solid fa-magnifying-glass text-xs"></i>
            </span>
            <input
              type="text"
              placeholder="Search wholesale firecrackers by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-0 focus:ring-2 focus:ring-crimson-600 rounded-xl py-2.5 pl-10 pr-24 text-xs text-slate-700 placeholder-slate-400 focus:outline-none transition-all shadow-inner font-semibold"
            />
            <button className="absolute right-1 bg-crimson-600 hover:bg-crimson-700 text-white font-extrabold text-[10px] uppercase tracking-wider py-1.5 px-4 rounded-lg shadow transition-colors">
              Search
            </button>
          </div>

          {/* View Mode Toggle Controls & Product Count */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4 select-none">
            <div className="text-xs text-slate-900 font-extrabold whitespace-nowrap">
              Showing <strong className="text-crimson-850 font-black">{totalFilteredProductsCount}</strong> products
            </div>
            <div className="flex items-center bg-white p-0.5 rounded-xl border border-gold-600/60 shadow-sm">
              <button
                type="button"
                onClick={() => changeViewMode('flex')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all duration-200 ${
                  viewMode === 'flex'
                    ? 'bg-crimson-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
                title="Flex View"
              >
                <i className="fa-solid fa-list-ul text-[10px]"></i>
                <span>Flex</span>
              </button>
              <button
                type="button"
                onClick={() => changeViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-crimson-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
                title="Grid View"
              >
                <i className="fa-solid fa-table-cells text-[10px]"></i>
                <span>Grid</span>
              </button>
            </div>
          </div>

          {/* Right: Cart Net Tally Badge */}
          <button
            onClick={() => setCheckoutOpen(true)}
            className="hidden lg:flex items-center gap-3.5 bg-crimson-600 hover:bg-crimson-700 text-white py-1.5 px-4 rounded-xl shadow-inner transition-colors flex-shrink-0"
          >
            <div className="relative">
              <i className="fa-solid fa-bag-shopping text-sm text-gold-500"></i>
              {totalQty > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-slate-900 text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-crimson-600 shadow-sm animate-bounce">
                  {totalQty}
                </span>
              )}
            </div>
            <div className="flex flex-col text-right font-extrabold text-xs">
              <span className="text-[8px] text-gold-200 uppercase leading-none font-semibold">Total Net</span>
              <span className="text-white mt-0.5 leading-none">₹{formatCurrency(totalNet)}</span>
            </div>
          </button>

        </div>
      </div>

      {/* 2. Most Sold Products Slider — Right below Sticky Nav Bar */}
      <div className="container mx-auto px-4 pt-2.5 sm:pt-3.5 select-none">
        <BestSellersSlider />
      </div>

      {/* 3. Product Catalog Table Section */}
      <div className="pt-0">
        <ProductTable />
      </div>

      {/* Cart Summary Sticky Footer Bar */}
      <CartFooter />

      {/* Sliding Checkout Drawer */}
      <CheckoutDrawer isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  );
}
