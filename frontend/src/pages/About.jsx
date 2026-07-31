import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useStore } from '../context/StoreContext';
import { getImageUrl } from '../utils/imageUrl';
import HeroSlider from '../components/HeroSlider';

export default function About() {
  const { settings } = useStore();
  const [activeImage, setActiveImage] = useState(null);

  const cardBgStyle = { backgroundColor: settings?.card_bg_color || '#FFFFFF' };

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: 'ease-in-out',
      once: false,
      mirror: true,
    });
    AOS.refresh();
  }, []);

  const aboutBannerImages = [
    settings?.about_banner_1 || settings?.about_banner,
    settings?.about_banner_2,
    settings?.about_banner_3,
    settings?.page_header_banner,
    settings?.slider_image_1,
    settings?.slider_image_2,
    settings?.slider_image_3,
  ].filter(Boolean);

  // Gallery images list from admin settings or default fallbacks
  const galleryImages = [];
  for (let i = 1; i <= 10; i++) {
    const imgKey = `gallery_image_${i}`;
    if (settings && settings[imgKey]) {
      galleryImages.push(settings[imgKey]);
    }
  }

  const defaultGallery = [
    "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1473163928189-364b2c4e1135?auto=format&fit=crop&w=600&q=80"
  ];

  const displayImages = galleryImages.length > 0 ? galleryImages : defaultGallery;

  const mainAboutImage = settings?.aboutus_image_1 
    ? (settings.aboutus_image_1.startsWith('data:') || settings.aboutus_image_1.startsWith('http') 
        ? settings.aboutus_image_1 
        : getImageUrl(settings.aboutus_image_1))
    : 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80';

  const paragraphs = settings?.about_us
    ? settings.about_us.split('\n').filter((p) => p.trim() !== '')
    : [
        'We are a leading fire crackers manufacturer and supplier based in Sivakasi, Tamilnadu, India. We step into the production and distribution of 150+ high-grade fire crackers products. With our years of rich experience in the fireworks field, we offer a quality-assured array of crackers designed for maximum joy and safety.',
        'Our comprehensive range of products includes Sparklers, Ground Chakkars, Flower Pots, Fountains, Fancy Fireworks, Sound Crackers, Rockets, Bombs, Twinkling Stars, Repeating Shots, Aerial Colour Novelties, and Fireworks Gift Boxes.'
      ];

  const badgeText = settings?.about_us_badge || 'Sivakasi Pioneers';
  const titleText = settings?.about_us_title || 'Quality Firecrackers Direct From Sivakasi';

  return (
    <div className="relative text-slate-800 select-none bg-transparent pb-16">

      {/* 1. Home Page Style Banner Image Slider */}
      <HeroSlider customImages={aboutBannerImages} />

      {/* 2. Main Story & Profile Section (Separated Container Layout) */}
      <section className="container mx-auto px-4 py-8 md:py-12 z-10 relative">
        <div className="border border-[#E2DDD9] rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl space-y-12" style={cardBgStyle} data-aos="fade-up">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Image with Technician Badge */}
            <div className="lg:col-span-5 relative group" data-aos="fade-right" data-aos-delay="100">
              {/* Animated Decorative Backdrop Glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-gold-500 to-crimson-600 rounded-3xl opacity-20 group-hover:opacity-30 blur-xl transition-all duration-500"></div>

              {/* Main Image Frame */}
              <div className="relative bg-white border border-slate-200 p-3 rounded-3xl shadow-lg overflow-hidden">
                <img
                  src={mainAboutImage}
                  alt="Sivakasi Fireworks Facility"
                  className="w-full h-72 sm:h-80 md:h-96 object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Overlay Badge 1: Heritage Year */}
                <div className="absolute top-6 left-6 bg-slate-900/85 backdrop-blur-md border border-gold-500/40 text-gold-400 text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                  <i className="fa-solid fa-award text-gold-400"></i>
                  <span>EST. 1999 • Sivakasi</span>
                </div>
              </div>

              {/* Floating Highlight Card (Deepam Inspired Badge) */}
              <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-6 sm:-right-4 bg-white border-2 border-gold-200 p-4 rounded-2xl shadow-xl flex items-center gap-4 max-w-xs transition-transform duration-300 hover:scale-105 z-30">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500 to-crimson-600 flex items-center justify-center text-white text-xl flex-shrink-0 shadow-md">
                  <i className="fa-solid fa-user-shield"></i>
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Expert Team</h4>
                  <p className="text-[11px] text-slate-600 font-semibold leading-tight mt-0.5">
                    We have an experienced pyro technicians team
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column: Text Content & Bullet Highlights */}
            <div className="lg:col-span-7 space-y-6" data-aos="fade-left" data-aos-delay="200">
              
              {/* Badge & Title */}
              <div className="space-y-2">
                <span className="inline-flex items-center gap-2 bg-gold-50 border border-gold-300 text-gold-900 text-xs font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-sm">
                  <i className="fa-solid fa-sparkles text-gold-600"></i>
                  {badgeText}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-cinzel text-slate-900 tracking-tight leading-tight">
                  {titleText}
                </h2>
              </div>

              {/* Dynamic Paragraphs */}
              <div className="space-y-3.5 text-slate-600 text-sm md:text-base leading-relaxed font-normal">
                {paragraphs.map((p, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>

              {/* Deepam Fireworks Bullet Checklist Grid */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm font-bold text-slate-800">
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 p-3 rounded-xl hover:border-gold-300 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-crimson-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <i className="fa-solid fa-check text-xs"></i>
                  </div>
                  <span>Branded Crackers at reasonable price</span>
                </div>

                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 p-3 rounded-xl hover:border-gold-300 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-crimson-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <i className="fa-solid fa-shield-heart text-xs"></i>
                  </div>
                  <span>100% Safe & Certified Standard</span>
                </div>

                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 p-3 rounded-xl hover:border-gold-300 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-crimson-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <i className="fa-solid fa-truck-fast text-xs"></i>
                  </div>
                  <span>High Quality & Timely Delivery</span>
                </div>

                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 p-3 rounded-xl hover:border-gold-300 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-crimson-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <i className="fa-solid fa-face-smile-beam text-xs"></i>
                  </div>
                  <span>100% Satisfaction Guaranteed</span>
                </div>
              </div>

              {/* Call to Action Button */}
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 text-white text-xs md:text-sm font-black uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  <span>Explore Products</span>
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-white border-2 border-slate-200 hover:border-gold-400 text-slate-800 text-xs md:text-sm font-black uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <i className="fa-solid fa-headset text-crimson-600"></i>
                  <span>Contact Support</span>
                </Link>
              </div>

            </div>

          </div>

          {/* 3. Grid of Key Feature Cards */}
          <div className="pt-8 border-t border-slate-200/60" data-aos="fade-up">
            <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
              <span className="text-[11px] font-black text-crimson-600 uppercase tracking-widest block">
                Why Choose Us
              </span>
              <h3 className="text-xl md:text-2xl font-black font-cinzel text-slate-900 tracking-tight">
                Our Commitment to Excellence
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card 1 */}
              <div className="bg-white border border-slate-200 rounded-2.5xl p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden group hover:-translate-y-1" data-aos="fade-up" data-aos-delay="100">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-500 to-crimson-600"></div>
                <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-200 flex items-center justify-center mb-4 text-crimson-600 shadow-sm group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-medal text-lg text-crimson-600"></i>
                </div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">100% Quality Assurance</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Every firecracker undergoes stringent quality check parameters before packing. We guarantee vibrant colors, loud pops, and long spark durations.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-slate-200 rounded-2.5xl p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden group hover:-translate-y-1" data-aos="fade-up" data-aos-delay="200">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-500 to-crimson-600"></div>
                <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-200 flex items-center justify-center mb-4 text-crimson-600 shadow-sm group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-shield-halved text-lg text-crimson-600"></i>
                </div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">Safety Disclaimers</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  We promote safety-first fireworks. All packages include instruction guidelines on handling, lighting, and safe disposal for children and adults.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white border border-slate-200 rounded-2.5xl p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden group hover:-translate-y-1 sm:col-span-2 lg:col-span-1" data-aos="fade-up" data-aos-delay="300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-500 to-crimson-600"></div>
                <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-200 flex items-center justify-center mb-4 text-crimson-600 shadow-sm group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-truck-ramp-box text-lg text-crimson-600"></i>
                </div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">Direct Reliable Shipping</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Our logistics network covers major areas across Tamil Nadu, Karnataka, Kerala, Andhra Pradesh, and Telangana via trusted transport carriers.
                </p>
              </div>

            </div>
          </div>

          {/* 4. Photo Gallery Section */}
          <div className="border-t border-slate-200/60 pt-10 space-y-8" data-aos="fade-up">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-2 bg-gold-50 border border-gold-200 text-gold-900 text-[11px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-sm">
                <i className="fa-solid fa-camera-retro text-gold-600 text-xs"></i> Photo Gallery
              </span>
              <h3 className="text-2xl md:text-3xl font-black font-cinzel text-slate-900 tracking-tight">
                Our Facilities & Celebrations
              </h3>
              <p className="text-xs md:text-sm text-slate-500 max-w-xl mx-auto font-semibold leading-relaxed">
                Take a look at our manufacturing facilities, storage hubs, and celebration moments powered by our crackers.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {displayImages.map((src, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveImage(src)}
                  data-aos="zoom-in"
                  data-aos-delay={(idx % 3) * 100}
                  className="group relative bg-white border-2 border-slate-100 hover:border-gold-400 rounded-2xl md:rounded-3xl p-2 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 cursor-pointer overflow-hidden"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-gold-500 to-crimson-600 rounded-3xl opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500 pointer-events-none"></div>

                  <div className="relative w-full h-40 sm:h-48 md:h-[210px] overflow-hidden rounded-xl md:rounded-2xl bg-slate-100">
                    <img 
                      src={src.startsWith('http') || src.startsWith('data:') ? src : getImageUrl(src)} 
                      alt={`Gallery view ${idx + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                      <span className="text-[11px] font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                        <i className="fa-solid fa-sparkles text-gold-400"></i> View Photo
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-gold-500 text-slate-900 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                        <i className="fa-solid fa-magnifying-glass-plus text-xs"></i>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Statutory Compliance & Licensing Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 mt-8" data-aos="fade-up">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500 flex items-center justify-center text-slate-900 flex-shrink-0 shadow-sm">
                <i className="fa-solid fa-scale-balanced text-lg text-crimson-600"></i>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Statutory Compliant Dealers</h4>
                <p className="text-[11px] text-slate-500 font-semibold leading-normal">
                  We strictly follow all safety, storage, and transport guidelines regulated by government licensing authorities.
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 font-bold text-xs text-slate-700 w-full md:w-auto">
              <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-inner flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">License:</span>
                <strong className="text-slate-800 font-black">{settings?.license_name || 'Fireworks Factory License'}</strong>
              </div>
              <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-inner flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">No:</span>
                <strong className="text-slate-850 font-black font-mono">{settings?.license_no || 'LE-4/SIVAKASI/2024'}</strong>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Lightbox / Zoom Popup Modal */}
      {activeImage && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 cursor-pointer"
          onClick={() => setActiveImage(null)}
        >
          <div 
            className="relative bg-white border border-slate-200 rounded-3xl p-3 max-w-4xl max-h-[90vh] shadow-2xl select-none cursor-default animate-scale-up flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-crimson-600 hover:bg-crimson-500 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 z-10"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
            <img 
              src={activeImage.startsWith('http') || activeImage.startsWith('data:') ? activeImage : getImageUrl(activeImage)} 
              alt="Gallery Zoomed" 
              className="max-w-full max-h-[80vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

    </div>
  );
}
