import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { getImageUrl } from '../../utils/imageUrl';

const Swal = window.Swal || { fire: () => {} };

export default function AdminInventory() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statistics, setStatistics] = useState({
    total_products: 0,
    in_stock_count: 0,
    low_stock_count: 0,
    out_of_stock_count: 0,
  });

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modified rows tracking map: { [productId]: { stock_quantity, min_stock_alert, manage_stock } }
  const [stockEdits, setStockEdits] = useState({});

  const fetchInventory = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (selectedCategory && selectedCategory !== 'all') params.append('category_id', selectedCategory);
    if (selectedStatus && selectedStatus !== 'all') params.append('status', selectedStatus);

    fetch(`/api/admin/inventory?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products || []);
          setCategories(data.categories || []);
          if (data.statistics) {
            setStatistics(data.statistics);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load inventory:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInventory();
  }, [selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInventory();
  };

  const handleStockChange = (productId, field, value) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        if (p.id === productId) {
          const updated = { ...p, [field]: value };
          // Calculate stock status dynamically
          if (updated.manage_stock === 'no') {
            updated.stock_status = 'in_stock';
          } else if (parseInt(updated.stock_quantity || 0) <= 0) {
            updated.stock_status = 'out_of_stock';
          } else if (parseInt(updated.stock_quantity || 0) <= parseInt(updated.min_stock_alert || 10)) {
            updated.stock_status = 'low_stock';
          } else {
            updated.stock_status = 'in_stock';
          }
          return updated;
        }
        return p;
      })
    );

    setStockEdits((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        id: productId,
        [field]: value,
      },
    }));
  };

  const handleAdjustQuantity = (productId, delta) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;
    const currentQty = parseInt(targetProduct.stock_quantity || 0);
    const newQty = Math.max(0, currentQty + delta);
    handleStockChange(productId, 'stock_quantity', newQty);
  };

  const saveProductInventory = async (productId) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    try {
      const res = await fetch('/api/admin/inventory/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates: [
            {
              id: targetProduct.id,
              stock_quantity: parseInt(targetProduct.stock_quantity || 0),
              min_stock_alert: parseInt(targetProduct.min_stock_alert || 10),
              manage_stock: targetProduct.manage_stock || 'yes',
            },
          ],
        }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `Stock updated for ${targetProduct.name}`,
          showConfirmButton: false,
          timer: 2000,
        });

        // Remove from edited state
        setStockEdits((prev) => {
          const next = { ...prev };
          delete next[productId];
          return next;
        });

        fetchInventory();
      } else {
        Swal.fire('Error', data.message || 'Failed to update stock', 'error');
      }
    } catch (e) {
      Swal.fire('Error', 'Server connection failed', 'error');
    }
  };

  const saveBulkInventory = async () => {
    const editKeys = Object.keys(stockEdits);
    if (editKeys.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No Pending Edits',
        text: 'Adjust stock levels in the table first before saving bulk changes.',
        confirmButtonColor: '#e51d1d',
      });
      return;
    }

    setSaving(true);
    const updates = editKeys.map((id) => {
      const prod = products.find((p) => p.id === parseInt(id));
      return {
        id: parseInt(id),
        stock_quantity: parseInt(prod?.stock_quantity || 0),
        min_stock_alert: parseInt(prod?.min_stock_alert || 10),
        manage_stock: prod?.manage_stock || 'yes',
      };
    });

    try {
      const res = await fetch('/api/admin/inventory/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });
      const data = await res.json();
      setSaving(false);

      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Inventory Saved!',
          text: `Updated stock levels for ${updates.length} items.`,
          confirmButtonColor: '#e51d1d',
        });
        setStockEdits({});
        fetchInventory();
      } else {
        Swal.fire('Error', data.message || 'Failed to update inventory', 'error');
      }
    } catch (e) {
      setSaving(false);
      Swal.fire('Error', 'Server communication failure', 'error');
    }
  };

  const handleToggleStockStatus = (productId) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    if (targetProduct.stock_status === 'out_of_stock') {
      // Restore stock quantity to 100
      handleStockChange(productId, 'stock_quantity', 100);
    } else {
      // Set stock quantity to 0 (Out of Stock)
      handleStockChange(productId, 'stock_quantity', 0);
    }
  };

  const getStatusBadge = (product) => {
    const status = product.stock_status;
    switch (status) {
      case 'in_stock':
        return (
          <button
            type="button"
            onClick={() => handleToggleStockStatus(product.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-emerald-50 hover:bg-rose-50 border border-emerald-300 hover:border-rose-300 text-emerald-700 hover:text-rose-700 transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95 group/status"
            title="Click to mark as Out of Stock"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover/status:bg-rose-500"></span>
            <span>In Stock</span>
          </button>
        );
      case 'low_stock':
        return (
          <button
            type="button"
            onClick={() => handleToggleStockStatus(product.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-amber-50 hover:bg-rose-50 border border-amber-300 hover:border-rose-300 text-amber-800 hover:text-rose-700 transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95 group/status"
            title="Click to mark as Out of Stock"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 group-hover/status:bg-rose-500 animate-pulse"></span>
            <span>Low Stock</span>
          </button>
        );
      case 'out_of_stock':
        return (
          <button
            type="button"
            onClick={() => handleToggleStockStatus(product.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-rose-50 hover:bg-emerald-50 border border-rose-300 hover:border-emerald-300 text-rose-700 hover:text-emerald-700 transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95 group/status"
            title="Click to mark as In Stock (Restock 100)"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 group-hover/status:bg-emerald-500"></span>
            <span>Out of Stock</span>
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 select-none">
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-slate-200 rounded-3xl p-6 shadow-sm gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-crimson-600 text-white flex items-center justify-center font-black shadow-md">
                <i className="fa-solid fa-boxes-stacked text-base"></i>
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Inventory & Stock Management</h1>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Monitor real-time stock levels, adjust warehouse quantities, and manage low-stock threshold alerts.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={fetchInventory}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              <i className={`fa-solid fa-rotate ${loading ? 'animate-spin' : ''}`}></i> Refresh
            </button>
            <button
              onClick={saveBulkInventory}
              disabled={saving || Object.keys(stockEdits).length === 0}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow transition-all ${
                Object.keys(stockEdits).length > 0
                  ? 'bg-crimson-600 hover:bg-crimson-700 text-white hover:scale-105 active:scale-95 shadow-crimson-900/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <i className="fa-solid fa-floppy-disk"></i>
              <span>
                Save {Object.keys(stockEdits).length > 0 ? `(${Object.keys(stockEdits).length}) Edits` : 'Changes'}
              </span>
            </button>
          </div>
        </div>

        {/* Inventory Statistics KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Managed */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center text-lg flex-shrink-0">
              <i className="fa-solid fa-box-archive"></i>
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Total Products</span>
              <span className="text-xl font-black text-slate-800 tracking-tight">{statistics.total_products}</span>
            </div>
          </div>

          {/* Card 2: In Stock */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center text-lg flex-shrink-0">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">In Stock</span>
              <span className="text-xl font-black text-emerald-600 tracking-tight">{statistics.in_stock_count}</span>
            </div>
          </div>

          {/* Card 3: Low Stock Warning */}
          <div className="bg-white border border-amber-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3.5 bg-amber-50/30">
            <div className="w-11 h-11 rounded-xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center text-lg flex-shrink-0">
              <i className="fa-solid fa-triangle-exclamation animate-bounce"></i>
            </div>
            <div>
              <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest block">Low Stock Alert</span>
              <span className="text-xl font-black text-amber-800 tracking-tight">{statistics.low_stock_count}</span>
            </div>
          </div>

          {/* Card 4: Out of Stock */}
          <div className="bg-white border border-rose-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3.5 bg-rose-50/30">
            <div className="w-11 h-11 rounded-xl bg-rose-100 border border-rose-300 text-rose-700 flex items-center justify-center text-lg flex-shrink-0">
              <i className="fa-solid fa-ban"></i>
            </div>
            <div>
              <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest block">Out of Stock</span>
              <span className="text-xl font-black text-rose-800 tracking-tight">{statistics.out_of_stock_count}</span>
            </div>
          </div>
        </div>

        {/* Controls, Filters & Search */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto bg-slate-100 p-1 rounded-2xl border border-slate-200">
              {[
                { id: 'all', label: 'All Items', count: statistics.total_products },
                { id: 'in_stock', label: 'In Stock', count: statistics.in_stock_count },
                { id: 'low_stock', label: 'Low Stock', count: statistics.low_stock_count },
                { id: 'out_of_stock', label: 'Out of Stock', count: statistics.out_of_stock_count },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStatus(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                    selectedStatus === tab.id
                      ? 'bg-white text-crimson-600 shadow-sm border border-slate-200/80'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Right: Search & Category Selection */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input
                  type="text"
                  placeholder="Search product code or name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-crimson-400 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold outline-none transition-all"
                />
              </form>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 focus:border-crimson-400 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none text-slate-700"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Inventory Stock Table */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <i className="fa-solid fa-spinner animate-spin text-3xl text-crimson-600"></i>
              <p className="text-xs font-bold uppercase tracking-wider">Loading Inventory Database...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <i className="fa-solid fa-box-open text-4xl text-slate-300"></i>
              <p className="text-sm font-bold text-slate-600">No Products Found</p>
              <p className="text-xs">No matching inventory records found for selected status or category filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[9.5px]">
                    <th className="py-3.5 px-4 w-12 text-center">S.No</th>
                    <th className="py-3.5 px-4">Product Info</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4 text-center">Stock Level</th>
                    <th className="py-3.5 px-4 text-center">Alert Threshold</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {products.map((product, index) => {
                    const isEdited = Boolean(stockEdits[product.id]);
                    return (
                      <tr
                        key={product.id}
                        className={`hover:bg-slate-50/60 transition-colors ${
                          isEdited ? 'bg-amber-50/40 border-l-4 border-l-amber-500' : ''
                        }`}
                      >
                        {/* S.No */}
                        <td className="py-3 px-4 text-center text-slate-400 font-mono text-[11px] font-bold">
                          {index + 1}
                        </td>

                        {/* Product Info */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center p-0.5">
                              {product.image ? (
                                <img
                                  src={getImageUrl(product.image)}
                                  alt={product.name}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <i className="fa-solid fa-box-open text-slate-300 text-base"></i>
                              )}
                            </div>
                            <div className="space-y-0.5">
                              {product.product_code && (
                                <span className="inline-block bg-slate-100 border border-slate-200 text-slate-600 font-mono font-bold text-[9px] px-1.5 py-0.5 rounded">
                                  {product.product_code}
                                </span>
                              )}
                              <h4 className="font-extrabold text-slate-900 text-xs leading-snug">{product.name}</h4>
                              <p className="text-[10px] text-slate-400">
                                {product.pack_size} | <strong className="text-slate-700">₹{product.selling_price}</strong>
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4 text-slate-600 font-bold text-xs">
                          {product.category?.name || 'Uncategorized'}
                        </td>

                        {/* Stock Level Counter */}
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1 shadow-2xs">
                            <button
                              onClick={() => handleAdjustQuantity(product.id, -10)}
                              className="w-6 h-6 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-xs flex items-center justify-center transition-all"
                              title="Minus 10 units"
                            >
                              -10
                            </button>
                            <button
                              onClick={() => handleAdjustQuantity(product.id, -1)}
                              className="w-6 h-6 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-xs flex items-center justify-center transition-all"
                              title="Minus 1 unit"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={product.stock_quantity ?? 0}
                              onChange={(e) => handleStockChange(product.id, 'stock_quantity', parseInt(e.target.value) || 0)}
                              className="w-16 text-center font-mono font-black text-slate-900 bg-white border border-slate-300 rounded-md py-1 text-xs outline-none focus:border-crimson-500 shadow-inner"
                            />
                            <button
                              onClick={() => handleAdjustQuantity(product.id, 1)}
                              className="w-6 h-6 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-xs flex items-center justify-center transition-all"
                              title="Add 1 unit"
                            >
                              +
                            </button>
                            <button
                              onClick={() => handleAdjustQuantity(product.id, 10)}
                              className="w-6 h-6 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-xs flex items-center justify-center transition-all"
                              title="Add 10 units"
                            >
                              +10
                            </button>
                          </div>
                        </td>

                        {/* Alert Threshold */}
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1">
                            <span className="text-[10px] text-slate-400 font-bold">Min:</span>
                            <input
                              type="number"
                              min="0"
                              value={product.min_stock_alert ?? 10}
                              onChange={(e) => handleStockChange(product.id, 'min_stock_alert', parseInt(e.target.value) || 0)}
                              className="w-14 text-center font-mono font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg py-1 text-xs outline-none focus:border-crimson-400"
                            />
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3 px-4 text-center">
                          {getStatusBadge(product)}
                        </td>

                        {/* Save Action */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => saveProductInventory(product.id)}
                            disabled={!isEdited}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-xs ${
                              isEdited
                                ? 'bg-amber-500 hover:bg-amber-600 text-white hover:scale-105 active:scale-95'
                                : 'bg-slate-100 text-slate-350 cursor-not-allowed'
                            }`}
                          >
                            <i className="fa-solid fa-check mr-1"></i> Save
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
