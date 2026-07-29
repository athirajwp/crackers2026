import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function CategoryCarousel() {
  const navigate = useNavigate();
  const { setActiveCategory } = useStore();

  const handleCategoryClick = (categorySlug) => {
    if (setActiveCategory) setActiveCategory(categorySlug);
    navigate('/quick-order');
  };

  const productItems = [
    {
      name: 'Rockets',
      slug: 'rockets',
      image: '/img/categories/rockets.png',
      fallbackIcon: 'fa-rocket',
      description: 'High Flying Sky Repeaters',
      gradient: 'from-amber-400 to-rose-500'
    },
    {
      name: 'Sparklers',
      slug: 'sparklers',
      image: '/img/categories/sparklers.png',
      fallbackIcon: 'fa-wand-magic-sparkles',
      description: 'Electric & Color Sparklers',
      gradient: 'from-yellow-300 to-amber-500'
    },
    {
      name: 'Fountains',
      slug: 'fountains-novelties',
      image: '/img/categories/fountains.png',
      fallbackIcon: 'fa-volcano',
      description: 'Vibrant Multi-Color Fountains',
      gradient: 'from-emerald-400 to-teal-600'
    },
    {
      name: 'Gift Boxes',
      slug: 'gift-boxes',
      image: '/img/categories/giftboxes.png',
      fallbackIcon: 'fa-box-open',
      description: 'Exclusive Diwali Gift Sets',
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      name: 'Ground Chakkar',
      slug: 'ground-chakkars',
      image: '/img/categories/chakkars.png',
      fallbackIcon: 'fa-dharmachakra',
      description: 'Spinning Wheel Chakkars',
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      name: 'Flower Pots',
      slug: 'flower-pots',
      image: '/img/categories/flowerpots.png',
      fallbackIcon: 'fa-fire-burner',
      description: 'Classic & Special Pots',
      gradient: 'from-red-500 to-orange-600'
    },
    {
      name: 'Sound Crackers',
      slug: 'sound-crackers',
      image: '/img/categories/soundcrackers.png',
      fallbackIcon: 'fa-explosion',
      description: 'Loud Festive Crackers',
      gradient: 'from-blue-500 to-indigo-600'
    }
  ];

  // Carousel pagination page index (0 or 1)
  const [activePage, setActivePage] = useState(0);

  // Auto slide every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePage((prev) => (prev === 0 ? 1 : 0));
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative bg-gradient-to-b from-[#FAF7F2] via-[#F4EFEA] to-[#FAF7F2] py-10 md:py-14 overflow-hidden select-none shadow-sm border-y border-[#E6E0D5]">
      
      {/* Background Soft Floating Gold Sparks */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-4 left-10 w-2 h-2 bg-amber-400 rounded-full animate-ping"></div>
        <div className="absolute top-12 right-20 w-3 h-3 bg-amber-500 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-6 left-1/4 w-2 h-4 bg-gold-500 -rotate-12"></div>
        <div className="absolute top-10 left-1/3 w-3 h-1.5 bg-amber-400 rotate-45"></div>
        <div className="absolute bottom-10 right-1/3 w-2 h-3 bg-amber-500 rotate-12"></div>
        <div className="absolute top-6 right-10 w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* Section Header */}
        <div className="text-center space-y-2 mb-8 md:mb-12">
          <span className="inline-flex items-center gap-1.5 bg-gold-100 border border-gold-300/80 text-gold-900 text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-sm">
            <i className="fa-solid fa-sparkles text-gold-600"></i> Sivakasi Fireworks Range
          </span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 uppercase font-sans">
            Shop Our <span className="text-crimson-600">Products</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-semibold tracking-wider uppercase">
            Click any category to start quick ordering
          </p>
        </div>

        {/* 3D Organic Platforms Grid / Slider Container */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 items-center max-w-6xl mx-auto">
          {productItems
            .slice(activePage * 4, activePage * 4 + 4)
            .map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleCategoryClick(item.slug)}
                className="group cursor-pointer flex flex-col items-center justify-between transition-transform duration-500 hover:-translate-y-2"
              >
                {/* Soft Organic White Platform Card */}
                <div className="relative w-full aspect-[4/3] bg-white rounded-[45%_55%_60%_40%/50%_45%_55%_50%] shadow-[0_10px_25px_rgba(0,0,0,0.08)] flex items-center justify-center p-4 transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(234,179,8,0.25)] group-hover:scale-105 border-4 border-amber-50">
                  
                  {/* Platform Inner Soft Glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-amber-50/20 rounded-[45%_55%_60%_40%/50%_45%_55%_50%]"></div>

                  {/* 3D Product Image / Illustration */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                      className="max-h-28 md:max-h-32 object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.15)]"
                    />
                    <div className="hidden w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 items-center justify-center text-white shadow-lg">
                      <i className={`fa-solid ${item.fallbackIcon} text-3xl`}></i>
                    </div>
                  </div>
                </div>

                {/* Rounded Yellow Category Button */}
                <button
                  type="button"
                  className="mt-4 w-full max-w-[200px] bg-gold-500 hover:bg-gold-400 text-slate-950 font-black py-2.5 px-4 rounded-full text-xs md:text-sm shadow-md group-hover:shadow-gold-500/40 transition-all duration-300 uppercase tracking-wider text-center border border-gold-400"
                >
                  {item.name}
                </button>
              </div>
            ))}
        </div>

        {/* Carousel Navigation Dots */}
        <div className="flex items-center justify-center gap-3 mt-10">
          <button
            onClick={() => setActivePage(0)}
            className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
              activePage === 0 ? 'bg-crimson-600 scale-125 shadow-md shadow-crimson-900/30' : 'bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label="Carousel page 1"
          />
          <button
            onClick={() => setActivePage(1)}
            className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
              activePage === 1 ? 'bg-crimson-600 scale-125 shadow-md shadow-crimson-900/30' : 'bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label="Carousel page 2"
          />
        </div>

      </div>
    </section>
  );
}
