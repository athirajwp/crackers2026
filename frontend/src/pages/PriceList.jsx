import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { getImageUrl } from '../utils/imageUrl';

export default function PriceList() {
  const { categories, settings, loading } = useStore();

  const formatCurrency = (val) => {
    return parseFloat(val).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  // Inject html2pdf script dynamically if not present
  useEffect(() => {
    if (!window.html2pdf) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const downloadPDF = () => {
    if (!window.html2pdf) {
      window.Swal.fire({
        title: 'Loading PDF Compiler...',
        text: 'The PDF compilation engine is loading, please try again in a moment.',
        icon: 'info',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    // Display premium SweetAlert compilator loader
    window.Swal.fire({
      title: 'Generating PDF...',
      text: 'Compiling wholesale registry sheets, please wait...',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        window.Swal.showLoading();
      },
    });

    const element = document.getElementById('price-list-document');
    const cleanStoreName = (settings.store_name || 'Cracker_Demo')
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();

    const opt = {
      margin: [0.4, 0.3, 0.4, 0.3],
      filename: `${cleanStoreName}_wholesale_price_list.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    window.html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        window.Swal.fire({
          title: 'Compilation Complete!',
          text: 'Wholesale Price List downloaded successfully.',
          icon: 'success',
          confirmButtonColor: '#e51d1d',
          timer: 2000,
          showConfirmButton: false,
        });
      })
      .catch((err) => {
        console.error('PDF Compilation Error:', err);
        window.Swal.fire({
          title: 'Generation Failed!',
          text: 'Unable to compile PDF client-side. Please use the Print List option.',
          icon: 'error',
          confirmButtonColor: '#e51d1d',
        });
      });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <i className="fa-solid fa-spinner animate-spin text-3xl text-crimson-600"></i>
        <p className="text-sm font-semibold text-slate-500">Loading price list...</p>
      </div>
    );
  }

  let snoDesktop = 1;
  let snoMobile = 1;

  const cardBgStyle = { backgroundColor: settings?.card_bg_color || '#FFFFFF' };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 select-none">
      {/* Header control bar (Hidden during print) */}
      <div className="flex flex-col md:flex-row justify-between items-center border border-[#E2DDD9] rounded-2xl p-5 shadow-sm mb-8 gap-4 print:hidden" style={cardBgStyle}>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <i className="fa-solid fa-list-check text-crimson-600"></i> Wholesale Price List
          </h2>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
            Official Price Registry - Flat {settings.discount_percent}% Discount Applied
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Download PDF button */}
          <button
            onClick={downloadPDF}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-crimson-50 border border-crimson-200 hover:bg-crimson-100 text-crimson-750 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm"
          >
            <i className="fa-solid fa-file-pdf text-crimson-650"></i> Download PDF
          </button>
          {/* Print button */}
          <button
            onClick={() => window.print()}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-100 border border-slate-200 hover:border-slate-355 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm"
          >
            <i className="fa-solid fa-print text-slate-500"></i> Print List
          </button>
          {/* Order Now button */}
          <Link
            to="/"
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-crimson-600 to-crimson-500 hover:from-crimson-700 hover:to-crimson-600 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow transition-all hover:scale-105 active:scale-95 text-center"
          >
            <i className="fa-solid fa-basket-shopping"></i> Order Online Now
          </Link>
        </div>
      </div>

      {/* Official Printable Invoice/Price Registry Document */}
      <div
        id="price-list-document"
        className="border border-[#E2DDD9] rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden print:border-0 print:shadow-none print:p-0"
        style={cardBgStyle}
      >
        {/* Header Branding (Visible on Print and Screen) */}
        <div className="border-b border-[#E2DDD9] pb-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            
            {/* Left: Company Logo & Title Block */}
            <div className="flex items-center gap-4">
              {/* Company Logo */}
              {settings.store_logo ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-slate-200 p-2 flex items-center justify-center shadow-xs flex-shrink-0">
                  <img
                    src={getImageUrl(settings.store_logo)}
                    alt={settings.store_name || "Company Logo"}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-crimson-600 via-crimson-700 to-crimson-900 text-white flex items-center justify-center shadow-md flex-shrink-0 border border-crimson-500">
                  <i className="fa-solid fa-fire-flame-curved text-2xl sm:text-3xl text-gold-400"></i>
                </div>
              )}

              {/* Title & Tagline */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-crimson-700 leading-none font-cinzel">
                    {settings.store_name}
                  </h1>
                  <span className="bg-amber-100 border border-amber-300 text-amber-900 text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow-2xs">
                    Wholesale Price List
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 tracking-widest uppercase font-bold">
                  Premium Sivakasi Fireworks Wholesale Registry
                </p>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold px-2 py-0.5 rounded-md">
                    <i className="fa-solid fa-circle-check text-emerald-600 mr-1"></i>
                    Flat {settings.discount_percent}% Wholesale Discount
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Contact Information Box */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 text-xs text-slate-600 space-y-1.5 min-w-[260px] shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-crimson-100 text-crimson-700 flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-phone text-[10px]"></i>
                </div>
                <span className="font-bold text-slate-800">
                  {[settings.store_phone, settings.store_phone_2, settings.store_whatsapp].filter(Boolean).map(num => '+' + String(num).replace(/^\++/g, '')).join(', ') || '+91 9998887776'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-envelope text-[10px]"></i>
                </div>
                <span className="font-semibold text-slate-700 truncate max-w-[220px]">
                  {settings.store_email || 'crackerdemo@gmail.com'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-location-dot text-[10px]"></i>
                </div>
                <span className="font-semibold text-slate-700 line-clamp-1">
                  {settings.store_address || 'Virudhunagar to Sivakasi Main Road, Sivakasi'}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Table Registry Container */}
        <div className="border border-[#E2DDD9] rounded-2xl overflow-hidden shadow-inner print:border-0">
          {/* Desktop Table (Visible on MD screens and during printing) */}
          <table className="hidden md:table w-full text-left text-xs border-collapse print:table">
            <thead>
              <tr className="bg-gradient-to-r from-crimson-700 via-crimson-600 to-crimson-800 border-b border-crimson-900 text-white font-extrabold uppercase tracking-wider text-[9.5px]">
                <th className="py-3 px-3 sm:px-4 w-16 text-center">Code</th>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4 w-32 text-center">Pack / Box size</th>
                <th className="py-3 px-4 w-24 text-right">MRP (₹)</th>
                <th className="py-3 px-4 w-24 text-right">Discount ({settings.discount_percent}% Off)</th>
                <th className="py-3 px-4 w-28 text-right pr-6 font-bold">Net Price (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 font-semibold text-slate-600">
              {categories.map((category) => (
                <React.Fragment key={category.id}>
                  {/* Category Header Row */}
                  <tr className="bg-slate-100/60 font-black text-slate-700 text-[10px] uppercase tracking-wider border-y border-slate-200">
                    <td colSpan={6} className="py-3.5 px-4">
                      <i className="fa-solid fa-circle-chevron-right text-crimson-600 mr-2 text-[9px]"></i>
                      {category.name}
                    </td>
                  </tr>

                  {/* Product Rows */}
                  {(() => {
                    const sortedProducts = [...category.products].sort((a, b) => {
                      const codeA = (!isNaN(a.product_code) && parseInt(a.product_code, 10) > 0) ? parseInt(a.product_code, 10) : 99999;
                      const codeB = (!isNaN(b.product_code) && parseInt(b.product_code, 10) > 0) ? parseInt(b.product_code, 10) : 99999;
                      return codeA - codeB;
                    });
                    return sortedProducts.map((product) => {
                      const currentSno = snoDesktop++;
                      return (
                        <tr key={product.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="py-3 px-3 sm:px-4 text-center font-mono font-bold text-slate-800 bg-slate-50/50">
                            {product.product_code || currentSno}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-800">{product.name}</td>
                          <td className="py-3 px-4 text-center font-mono text-slate-500 font-bold">
                            {product.pack_size}
                          </td>
                          <td className="py-3 px-4 text-right line-through text-slate-400 font-mono">
                            {settings.show_mrp !== 'no' ? `₹${formatCurrency(product.mrp)}` : '—'}
                          </td>
                          <td className="py-3 px-4 text-right text-emerald-600 font-mono">
                            ₹{formatCurrency(product.mrp * (settings.discount_percent / 100))}
                          </td>
                          <td className="py-3 px-4 text-right pr-6 font-extrabold text-crimson-600 font-mono">
                            ₹{formatCurrency(product.selling_price)}
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* Mobile Card List (Visible on mobile/small screens, hidden during print) */}
          <div className="md:hidden divide-y divide-slate-150 print:hidden bg-white">
            {categories.map((category) => (
              <React.Fragment key={category.id}>
                {/* Category Header Block */}
                <div className="bg-slate-100/60 font-black text-slate-700 text-[10px] uppercase tracking-wider py-3 px-4 border-y border-slate-200">
                  <i className="fa-solid fa-circle-chevron-right text-crimson-600 mr-2 text-[9px]"></i>
                  {category.name}
                </div>

                {/* Product Blocks */}
                {(() => {
                  const sortedProducts = [...category.products].sort((a, b) => {
                    const codeA = (!isNaN(a.product_code) && parseInt(a.product_code, 10) > 0) ? parseInt(a.product_code, 10) : 99999;
                    const codeB = (!isNaN(b.product_code) && parseInt(b.product_code, 10) > 0) ? parseInt(b.product_code, 10) : 99999;
                    return codeA - codeB;
                  });
                  return sortedProducts.map((product) => {
                    const currentSno = snoMobile++;
                    return (
                      <div key={product.id} className="py-3.5 px-4 flex flex-col gap-1.5 hover:bg-slate-50/30 transition-colors">
                        <div className="flex justify-between items-start gap-3">
                          <div className="text-xs font-bold text-slate-800 flex items-center flex-wrap gap-1">
                            <span className="font-mono text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded text-[10px] font-bold">{product.product_code || currentSno}</span>
                            <span>{product.name}</span>
                          </div>
                          <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-lg flex-shrink-0">
                            {product.pack_size}
                          </span>
                        </div>

                        <div className="flex justify-between items-center mt-1">
                          <div className="flex items-center gap-2">
                            {settings.show_mrp !== 'no' && (
                              <span className="line-through text-[11px] text-slate-400 font-mono">
                                ₹{formatCurrency(product.mrp)}
                              </span>
                            )}
                            <span className="text-[9px] text-emerald-600 bg-emerald-50 font-bold px-1.5 py-0.5 rounded-md">
                              {settings.discount_percent}% OFF
                            </span>
                          </div>
                          <div className="text-right flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-450">Net:</span>
                            <span className="text-xs font-black text-crimson-600 font-mono">
                              ₹{formatCurrency(product.selling_price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
