import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { getImageUrl } from '../utils/imageUrl';
import HeroSlider from '../components/HeroSlider';

export default function Contact() {
  const { settings } = useStore();
  const cardBgStyle = { backgroundColor: settings?.card_bg_color || '#FFFFFF' };

  const contactBannerImages = [
    settings?.contact_banner_1 || settings?.contact_banner,
    settings?.contact_banner_2,
    settings?.contact_banner_3,
  ].filter(Boolean);

  return (
    <div className="relative text-slate-800 select-none bg-transparent pb-16">

      {/* 1. Banner Image Slider (Only visible if uploaded from admin panel) */}
      <HeroSlider customImages={contactBannerImages} hideIfEmpty={true} />

      {/* 2. Main Content Section (Separated Container Layout) */}
      <section className="container mx-auto px-4 py-8 md:py-12 z-10 relative">
        <div className="border border-[#E2DDD9] rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl space-y-12" style={cardBgStyle}>

          {/* Section Sub-Header Title */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 bg-gold-50 border border-gold-300 text-gold-900 text-xs font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-sm">
              <i className="fa-solid fa-envelope text-gold-600"></i> Get In Touch
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-cinzel text-slate-900 tracking-tight">
              We Are Here To Help You
            </h2>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-semibold">
              Reach out to us directly through phone, WhatsApp, or visit our licensed Sivakasi store location.
            </p>
          </div>

          {/* Two-Column Layout: Contact Details & Embedded Google Map */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

            {/* Left Column: Contact Details Card (lg:col-span-6) */}
            <div className="lg:col-span-6 bg-white/90 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <i className="fa-solid fa-location-dot text-xl text-crimson-600"></i>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Our Address</h4>
                  <p className="text-xs md:text-sm text-slate-600 font-semibold leading-relaxed">
                    {settings.store_address || 'Virudhunagar to Sivakasi Main Road, Sivakasi, Tamil Nadu - 626189'}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <i className="fa-solid fa-phone text-xl text-crimson-600"></i>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Phone Numbers</h4>
                  <div className="text-xs md:text-sm text-slate-600 font-semibold leading-relaxed space-y-1">
                    {settings.store_phone && (
                      <a href={`tel:${settings.store_phone}`} className="hover:text-crimson-600 transition-colors block">
                        {settings.store_phone}
                      </a>
                    )}
                    {settings.store_phone_2 && (
                      <a href={`tel:${settings.store_phone_2}`} className="hover:text-crimson-600 transition-colors block">
                        {settings.store_phone_2}
                      </a>
                    )}
                    {settings.store_phone_3 && (
                      <a href={`tel:${settings.store_phone_3}`} className="hover:text-crimson-600 transition-colors block">
                        {settings.store_phone_3}
                      </a>
                    )}
                    {settings.store_phone_4 && (
                      <a href={`tel:${settings.store_phone_4}`} className="hover:text-crimson-600 transition-colors block">
                        {settings.store_phone_4}
                      </a>
                    )}
                    {!settings.store_phone && !settings.store_phone_2 && !settings.store_phone_3 && !settings.store_phone_4 && (
                      <a href="tel:+919998887776" className="hover:text-crimson-600 transition-colors block">
                        +91 9998887776
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <i className="fa-brands fa-whatsapp text-2xl text-emerald-600"></i>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">WhatsApp Direct Booking</h4>
                  <p className="text-xs md:text-sm text-slate-600 font-semibold leading-relaxed">
                    <a
                      href={`https://wa.me/${(settings.store_whatsapp || '919998887776').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-emerald-600 transition-colors font-mono font-bold"
                    >
                      {'+' + (settings.store_whatsapp || '91 9998887776').replace(/^\++/g, '')}
                    </a>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <i className="fa-solid fa-envelope text-xl text-crimson-600"></i>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Email Address</h4>
                  <p className="text-xs md:text-sm text-slate-600 font-semibold leading-relaxed">
                    <a href={`mailto:${settings.store_email}`} className="hover:text-crimson-600 transition-colors">
                      {settings.store_email || 'crackershop@gmail.com'}
                    </a>
                  </p>
                </div>
              </div>

              {/* License Info Card */}
              {(settings.license_name || settings.license_no) && (
                <div className="border-t border-slate-200 pt-5 mt-2">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <i className="fa-solid fa-scale-balanced text-xl text-crimson-600"></i>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Statutory License Details</h4>
                      {settings.license_name && (
                        <p className="text-xs text-slate-600 font-semibold">
                          Name: <strong className="text-slate-900 font-black">{settings.license_name}</strong>
                        </p>
                      )}
                      {settings.license_no && (
                        <p className="text-xs text-slate-600 font-semibold">
                          No: <strong className="text-slate-900 font-black font-mono">{settings.license_no}</strong>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Embedded Google Map (lg:col-span-6) */}
            <div className="lg:col-span-6 bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-md min-h-[380px] flex flex-col">
              {settings.store_map_iframe ? (
                <div dangerouslySetInnerHTML={{ __html: settings.store_map_iframe }} className="w-full h-full min-h-[380px] flex-1 [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:min-h-[380px]" />
              ) : (
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31484.78768782782!2d77.78440079999999!3d9.4475475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cee41fe51a8d%3A0xe964a2754897f1f!2sSivakasi%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1717830000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '380px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Store Location Map"
                  className="w-full h-full flex-1"
                ></iframe>
              )}
            </div>

          </div>



          {/* 4. Social Media Links Section */}
          {(settings.facebook_link || settings.instagram_link || settings.youtube_link || settings.whatsapp_link || settings.twitter_link) && (
            <div className="border-t border-slate-200/60 pt-8 space-y-5">
              <div className="text-center space-y-1">
                <span className="text-[11px] font-black text-crimson-600 uppercase tracking-widest block">Follow Us</span>
                <h4 className="text-base font-black font-cinzel text-slate-900 tracking-tight">Connect With Us On Social Media</h4>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                {settings.facebook_link && (
                  <a
                    href={settings.facebook_link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#1877F2] hover:bg-[#1565d8] text-white text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 active:scale-95"
                  >
                    <i className="fa-brands fa-facebook text-base"></i>
                    <span>Facebook</span>
                  </a>
                )}
                {settings.instagram_link && (
                  <a
                    href={settings.instagram_link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-br from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] hover:opacity-95 text-white text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 active:scale-95"
                  >
                    <i className="fa-brands fa-instagram text-base"></i>
                    <span>Instagram</span>
                  </a>
                )}
                {settings.youtube_link && (
                  <a
                    href={settings.youtube_link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#FF0000] hover:bg-[#cc0000] text-white text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 active:scale-95"
                  >
                    <i className="fa-brands fa-youtube text-base"></i>
                    <span>YouTube</span>
                  </a>
                )}
                {settings.whatsapp_link && (
                  <a
                    href={settings.whatsapp_link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#1da851] text-white text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 active:scale-95"
                  >
                    <i className="fa-brands fa-whatsapp text-base"></i>
                    <span>WhatsApp</span>
                  </a>
                )}
                {settings.twitter_link && (
                  <a
                    href={settings.twitter_link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-700 text-white text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 active:scale-95"
                  >
                    <i className="fa-brands fa-x-twitter fa-twitter text-base"></i>
                    <span>X / Twitter</span>
                  </a>
                )}
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
