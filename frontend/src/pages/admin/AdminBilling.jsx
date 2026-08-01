import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { getImageUrl } from '../../utils/imageUrl';

const Swal = window.Swal;

export default function AdminBilling() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart / Bill Items
  const [billItems, setBillItems] = useState([]);
  
  // Customer details
  const [customer, setCustomer] = useState({
    name: 'Counter Customer',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    city: 'Sivakasi',
    payment_method: 'Cash',
    payment_status: 'paid',
    order_status: 'confirmed',
    notes: '',
  });

  // Custom Extra Discount
  const [extraDiscount, setExtraDiscount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/admin/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
        if (data.categories) setCategories(data.categories);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load products for billing:', err);
        setLoading(false);
      });
  }, []);

  // Filtered products list
  const filteredProducts = products.filter((prod) => {
    const matchesCat = selectedCategory === 'all' || String(prod.category_id) === String(selectedCategory);
    const matchesSearch = !searchQuery.trim() || 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (prod.product_code && prod.product_code.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Add product to bill
  const addToBill = (product) => {
    setBillItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.product_id === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].qty += 1;
        return updated;
      } else {
        const defaultPrice = parseFloat(product.selling_price || product.mrp || 0);
        return [
          ...prev,
          {
            product_id: product.id,
            name: product.name,
            pack_size: product.pack_size || '',
            mrp: parseFloat(product.mrp || 0),
            price: defaultPrice,
            qty: 1,
            image: product.image,
          },
        ];
      }
    });
  };

  // Adjust item qty
  const updateQty = (productId, newQty) => {
    if (newQty <= 0) {
      removeItem(productId);
      return;
    }
    setBillItems((prev) =>
      prev.map((item) => (item.product_id === productId ? { ...item, qty: newQty } : item))
    );
  };

  // Adjust unit price
  const updatePrice = (productId, newPrice) => {
    const parsedPrice = parseFloat(newPrice);
    setBillItems((prev) =>
      prev.map((item) =>
        item.product_id === productId ? { ...item, price: isNaN(parsedPrice) ? 0 : parsedPrice } : item
      )
    );
  };

  // Remove item
  const removeItem = (productId) => {
    setBillItems((prev) => prev.filter((item) => item.product_id !== productId));
  };

  // Clear bill
  const clearBill = () => {
    setBillItems([]);
    setExtraDiscount(0);
  };

  // Bill Calculations
  const totalMrpSubtotal = billItems.reduce((acc, item) => acc + item.mrp * item.qty, 0);
  const totalItemSellingPrice = billItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const catalogDiscount = totalMrpSubtotal - totalItemSellingPrice;
  const extraDiscountVal = parseFloat(extraDiscount) || 0;
  const finalPayable = Math.max(0, totalItemSellingPrice - extraDiscountVal);
  const totalDiscountAmount = catalogDiscount + extraDiscountVal;

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  // Create Bill & Submit Order
  const handleGenerateBill = async (e) => {
    e.preventDefault();
    if (billItems.length === 0) {
      if (Swal) Swal.fire('Empty Bill', 'Please add at least one product to the bill.', 'warning');
      return;
    }
    if (!customer.name.trim()) {
      if (Swal) Swal.fire('Missing Information', 'Please enter Customer Name.', 'warning');
      return;
    }

    setSubmitting(true);

    const payload = {
      name: customer.name,
      phone: customer.phone,
      whatsapp: customer.whatsapp || customer.phone,
      email: customer.email,
      address: customer.address,
      city: customer.city,
      payment_method: customer.payment_method,
      payment_status: customer.payment_status,
      order_status: customer.order_status,
      notes: customer.notes,
      discount_amount: totalDiscountAmount,
      net_amount: finalPayable,
      items: billItems.map((item) => ({
        product_id: item.product_id,
        qty: item.qty,
        price: item.price,
      })),
    };

    try {
      const res = await fetch('/api/admin/orders/create-billing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setSubmitting(false);

      if (res.ok && data.success) {
        if (Swal) {
          Swal.fire({
            title: 'Bill Created!',
            text: `Order #${data.order_id} generated successfully.`,
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Print Invoice',
            cancelButtonText: 'New Bill',
            confirmButtonColor: '#dc2626',
          }).then((result) => {
            if (result.isConfirmed) {
              window.open(`/admin/orders/${data.order_id}/invoice`, '_blank');
            }
          });
        }
        clearBill();
      } else {
        if (Swal) Swal.fire('Error', data.message || data.error || 'Failed to create bill', 'error');
      }
    } catch (err) {
      setSubmitting(false);
      console.error('Billing error:', err);
      if (Swal) Swal.fire('Error', 'Server request failed', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-5rem)] flex flex-col space-y-3 select-none overflow-hidden pb-2">
        
        {/* Compact Header Title */}
        <div className="flex justify-between items-center bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-crimson-600 flex items-center justify-center text-white text-xs font-black shadow-xs">
              <i className="fa-solid fa-receipt"></i>
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900 tracking-tight leading-none">
                POS Counter Billing & Invoice Generator
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearBill}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[11px] rounded-lg transition-all"
            >
              <i className="fa-solid fa-rotate-left mr-1"></i> Reset
            </button>
            <button
              onClick={() => navigate('/admin/orders')}
              className="px-3 py-1 bg-crimson-50 hover:bg-crimson-100 text-crimson-700 font-extrabold text-[11px] rounded-lg transition-all border border-crimson-200"
            >
              <i className="fa-solid fa-list-check mr-1"></i> Orders
            </button>
          </div>
        </div>

        {/* Single View 2-Column POS Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0 overflow-hidden">
          
          {/* Left Column: Product Search & Catalog (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col min-h-0 overflow-hidden">
            
            {/* Search & Category Filter Header */}
            <div className="flex items-center justify-between gap-2 pb-3 mb-2 border-b border-slate-100 flex-shrink-0">
              <div className="relative flex-1">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search product name or code..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-crimson-400 rounded-lg text-xs font-semibold outline-none transition-all"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 focus:border-crimson-400 rounded-lg px-2.5 py-1.5 text-xs font-bold outline-none cursor-pointer"
              >
                <option value="all">All Categories ({products.length})</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Scrollable Products List/Grid */}
            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs font-bold">Loading product catalog...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-bold">No matching products found.</div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 min-h-0">
                {filteredProducts.map((prod) => {
                  const isInCart = billItems.some((item) => item.product_id === prod.id);
                  const sellingPrice = parseFloat(prod.selling_price || prod.mrp || 0);
                  return (
                    <div
                      key={prod.id}
                      className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between gap-2.5 ${
                        isInCart
                          ? 'bg-crimson-50/70 border-crimson-300 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Top: Product Image & Details */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center p-0.5">
                          {prod.image ? (
                            <img src={getImageUrl(prod.image)} alt={prod.name} className="w-full h-full object-contain" />
                          ) : (
                            <i className="fa-solid fa-fire text-slate-300 text-xs"></i>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-[11.5px] font-extrabold text-slate-900 truncate leading-tight">{prod.name}</h4>
                          <p className="text-[9.5px] text-slate-500 font-semibold leading-none mt-0.5">{prod.pack_size || 'Standard'}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-xs font-black text-crimson-600">₹{sellingPrice}</span>
                            {parseFloat(prod.mrp) > sellingPrice && (
                              <span className="text-[9.5px] text-slate-400 line-through font-bold">₹{prod.mrp}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Bottom: Horizontal Quantity Selector (- Qty +) */}
                      {(() => {
                        const cartItem = billItems.find((i) => i.product_id === prod.id);
                        const qty = cartItem ? cartItem.qty : 0;
                        return (
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100/90 mt-0.5">
                            <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider">Qty:</span>
                            <div className={`flex items-center border rounded-lg bg-white overflow-hidden ${isInCart ? 'border-crimson-300' : 'border-slate-300'}`}>
                              <button
                                type="button"
                                onClick={() => isInCart && updateQty(prod.id, qty - 1)}
                                className={`w-7 h-6 font-black text-xs flex items-center justify-center transition-colors ${isInCart ? 'hover:bg-crimson-50 text-crimson-700' : 'text-slate-300 cursor-default'}`}
                              >−</button>
                              <span className={`w-8 h-6 text-center text-[11px] font-black flex items-center justify-center border-x ${isInCart ? 'text-crimson-700 border-crimson-200 bg-crimson-50/60' : 'text-slate-600 border-slate-200'}`}>
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => addToBill(prod)}
                                className={`w-7 h-6 font-black text-xs flex items-center justify-center transition-colors ${isInCart ? 'hover:bg-crimson-50 text-crimson-700' : 'hover:bg-slate-100 text-slate-700'}`}
                              >+</button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* Right Column: Customer Details, Bill Items & Checkout (5 Cols) */}
          <div className="lg:col-span-5 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col min-h-0 overflow-hidden">
            <form onSubmit={handleGenerateBill} className="h-full flex flex-col min-h-0 overflow-hidden justify-between">
              
              {/* Customer Information (Compact) */}
              <div className="flex-shrink-0 space-y-2 pb-2 border-b border-slate-100 mb-2">
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <i className="fa-solid fa-user text-crimson-600"></i> Customer & Payment
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[8px] font-black text-slate-400 uppercase block mb-0.5">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={customer.name}
                      onChange={handleCustomerChange}
                      placeholder="Customer Name"
                      className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 focus:border-crimson-400 rounded-lg text-xs font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] font-black text-slate-400 uppercase block mb-0.5">
                      Phone (Optional)
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={customer.phone}
                      onChange={handleCustomerChange}
                      placeholder="Mobile No."
                      className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 focus:border-crimson-400 rounded-lg text-xs font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[8px] font-black text-slate-400 uppercase block mb-0.5">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={customer.city}
                      onChange={handleCustomerChange}
                      placeholder="City"
                      className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 focus:border-crimson-400 rounded-lg text-xs font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] font-black text-slate-400 uppercase block mb-0.5">
                      Payment Mode
                    </label>
                    <select
                      name="payment_method"
                      value={customer.payment_method}
                      onChange={handleCustomerChange}
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 focus:border-crimson-400 rounded-lg text-xs font-bold outline-none cursor-pointer"
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI / GPay">UPI / GPay</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Credit / Pending">Credit / Pending</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Scrollable Billed Items Table */}
              <div className="flex-1 min-h-0 overflow-y-auto pr-1 my-1 space-y-1.5">
                <div className="flex items-center justify-between sticky top-0 bg-white py-1 z-10">
                  <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                    Billed Items ({billItems.length})
                  </h4>
                  {billItems.length > 0 && (
                    <button
                      type="button"
                      onClick={clearBill}
                      className="text-[9px] font-black text-rose-600 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {billItems.length === 0 ? (
                  <div className="py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-center text-slate-400 text-xs font-bold">
                    Click products on the left to add to bill.
                  </div>
                ) : (
                  billItems.map((item) => (
                    <div key={item.product_id} className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-extrabold text-slate-900 truncate">{item.name}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] text-slate-400 font-semibold">Rate: ₹</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => updatePrice(item.product_id, e.target.value)}
                            className="w-14 px-1 py-0.5 bg-white border border-slate-300 rounded text-[11px] font-bold text-slate-800 text-center outline-none"
                          />
                        </div>
                      </div>

                      {/* Qty & Total */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-slate-300 rounded bg-white overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQty(item.product_id, item.qty - 1)}
                            className="w-5 h-5 hover:bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-[11px] font-black text-slate-900">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.product_id, item.qty + 1)}
                            className="w-5 h-5 hover:bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right min-w-[50px]">
                          <div className="text-xs font-black text-slate-900">
                            ₹{(item.price * item.qty).toFixed(2)}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product_id)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 text-xs"
                          title="Remove"
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Fixed Bottom Summary & Action */}
              <div className="flex-shrink-0 space-y-2 pt-2 border-t border-slate-100">
                {billItems.length > 0 && (
                  <div className="bg-slate-900 text-white p-3 rounded-lg space-y-1 select-none">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                      <span>Total MRP: ₹{totalMrpSubtotal.toFixed(2)}</span>
                      <span className="text-emerald-400">Discount: -₹{catalogDiscount.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 pt-1 border-t border-slate-800">
                      <span>Extra Disc (₹):</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={extraDiscount}
                        onChange={(e) => setExtraDiscount(e.target.value)}
                        className="w-20 px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[11px] font-bold text-white text-right outline-none"
                      />
                    </div>

                    <div className="flex justify-between items-center text-sm font-black text-white pt-1 border-t border-slate-800">
                      <span className="text-gold-400 uppercase text-[10px]">Net Payable:</span>
                      <span className="text-gold-400 text-base font-mono font-black">₹{finalPayable.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || billItems.length === 0}
                  className="w-full bg-crimson-600 hover:bg-crimson-500 disabled:opacity-50 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-widest shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span>Creating Order...</span>
                  ) : (
                    <>
                      <i className="fa-solid fa-print"></i>
                      <span>Generate & Print Bill</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
