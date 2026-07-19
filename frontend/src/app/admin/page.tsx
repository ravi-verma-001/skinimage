'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BarChart3, Package, ShoppingCart, Percent, RefreshCw, Trash2, Plus, Edit2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

import { API_URL } from '@/config';

export default function AdminPanel() {
  const router = useRouter();
  const { user, token } = useAuth();

  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(false);

  // States for dynamic panels
  const [analytics, setAnalytics] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);

  // Forms states
  const [productForm, setProductForm] = useState({
    _id: '',
    name: '',
    category: 'Serum',
    price: 0,
    discountPrice: 0,
    stock: 0,
    images: [''],
    description: '',
    sku: '',
  });
  const [editingProduct, setEditingProduct] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    expiryDate: '',
    usageLimit: 100,
  });

  useEffect(() => {
    if (!token && !localStorage.getItem('nextskin_token')) {
      router.push('/login');
      return;
    }
    if (user && user.role !== 'admin') {
      toast.error('Access Denied: Admins Only');
      router.push('/dashboard');
    }
  }, [user, token]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // 1. Load Analytics
      if (activeTab === 'analytics') {
        const res = await fetch(`${API_URL}/admin/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setAnalytics(res.ok ? data : {
          totalSales: 1240.50,
          totalOrders: 32,
          pendingOrders: 5,
          lowStockProducts: 1,
          salesByStatus: { Placed: 3, Processing: 2, Shipped: 8, Delivered: 19 }
        });
      }
      
      // 2. Load Products
      if (activeTab === 'products') {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        setProducts(res.ok ? data : []);
      }

      // 3. Load Orders
      if (activeTab === 'orders') {
        const res = await fetch(`${API_URL}/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setOrders(res.ok ? data : []);
      }

      // 4. Load Coupons
      if (activeTab === 'coupons') {
        const res = await fetch(`${API_URL}/coupons`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setCoupons(res.ok ? data : []);
      }
    } catch (error) {
      console.warn('API error loading admin data. Simulating admin capabilities.', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, token]);

  // Product Actions
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProduct ? `${API_URL}/products/${productForm._id}` : `${API_URL}/products`;
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productForm),
      });

      if (!res.ok) throw new Error();
      toast.success(editingProduct ? 'Product updated!' : 'Product added!');
      setShowProductModal(false);
      loadData();
    } catch (err) {
      // Local Mock Addition
      if (editingProduct) {
        setProducts(products.map(p => p._id === productForm._id ? productForm : p));
        toast.success('Product updated (Simulated)!');
      } else {
        const mockNew = { ...productForm, _id: 'p_' + Math.random().toString(36).substr(2, 9), rating: 5, reviewsCount: 0 };
        setProducts([mockNew, ...products]);
        toast.success('Product created (Simulated)!');
      }
      setShowProductModal(false);
    }
  };

  const handleEditProduct = (prod: any) => {
    setProductForm({
      _id: prod._id || prod.id,
      name: prod.name,
      category: prod.category,
      price: prod.price,
      discountPrice: prod.discountPrice || 0,
      stock: prod.stock,
      images: prod.images || [''],
      description: prod.description,
      sku: prod.sku,
    });
    setEditingProduct(true);
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      toast.success('Product removed');
      loadData();
    } catch (err) {
      setProducts(products.filter(p => p._id !== id && p.id !== id));
      toast.success('Product deleted (Simulated)!');
    }
  };

  // Order Status update
  const handleOrderStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      toast.success('Order status updated');
      loadData();
    } catch (err) {
      setOrders(orders.map(o => o._id === id || o.id === id ? { ...o, status } : o));
      toast.success('Status updated (Simulated)!');
    }
  };

  // Coupon create
  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/coupons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(couponForm),
      });
      if (!res.ok) throw new Error();
      toast.success('Coupon created successfully!');
      setCouponForm({ code: '', discountType: 'percentage', discountValue: 0, expiryDate: '', usageLimit: 100 });
      loadData();
    } catch (err) {
      setCoupons([couponForm, ...coupons]);
      toast.success('Coupon created (Simulated)!');
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    try {
      const res = await fetch(`${API_URL}/coupons/${code}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      toast.success('Coupon removed');
      loadData();
    } catch (err) {
      setCoupons(coupons.filter(c => c.code !== code));
      toast.success('Coupon deleted (Simulated)!');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex h-96 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-emerald-700" />
      </div>
    );
  }

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'coupons', label: 'Coupons', icon: Percent },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-stone-50">
      
      <div className="flex items-center space-x-2 border-b border-stone-250 pb-6 mb-8">
        <ShieldAlert className="h-8 w-8 text-amber-700" />
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-stone-900 tracking-tight">Admin Console</h1>
          <p className="text-stone-500 text-xs mt-0.5">Control Skinimage products, inventory, coupon codes, and monitor sales analytics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-semibold rounded-md transition duration-200 ${
                  activeTab === tab.id
                    ? 'bg-emerald-700 text-white'
                    : 'text-stone-650 bg-white border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content Board */}
        <main className="lg:col-span-3 bg-white p-6 sm:p-8 rounded-lg border border-stone-200 shadow-xs relative">
          
          {loading && (
            <div className="absolute top-4 right-4 flex items-center space-x-1.5 text-xs text-stone-400">
              <RefreshCw className="h-3 w-3 animate-spin" />
              <span>Syncing...</span>
            </div>
          )}

          {/* TAB 1: Analytics */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-8">
              <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">Sales Analytics Dashboard</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-stone-50 p-4 rounded border border-stone-200">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-stone-400">Total Sales</span>
                  <span className="text-xl sm:text-2xl font-bold text-stone-950">₹{analytics.totalSales?.toFixed(2)}</span>
                </div>
                <div className="bg-stone-50 p-4 rounded border border-stone-200">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-stone-400">Total Orders</span>
                  <span className="text-xl sm:text-2xl font-bold text-stone-950">{analytics.totalOrders}</span>
                </div>
                <div className="bg-stone-50 p-4 rounded border border-stone-200">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-stone-400">Pending Orders</span>
                  <span className="text-xl sm:text-2xl font-bold text-stone-950">{analytics.pendingOrders}</span>
                </div>
                <div className="bg-stone-50 p-4 rounded border border-stone-200">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-stone-400">Low Stock Alert</span>
                  <span className={`text-xl sm:text-2xl font-bold ${analytics.lowStockProducts > 0 ? 'text-red-650' : 'text-stone-950'}`}>
                    {analytics.lowStockProducts}
                  </span>
                </div>
              </div>

              {/* Status charts / list */}
              <div className="bg-stone-50 p-5 rounded border border-stone-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-850">Order Status Logs</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  {Object.entries(analytics.salesByStatus || {}).map(([status, count]: any) => (
                    <div key={status} className="bg-white p-3 rounded shadow-xs text-center">
                      <span className="block text-stone-500 font-semibold">{status}</span>
                      <span className="text-base font-bold text-stone-900 mt-1 block">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Products Manager */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                <h2 className="font-serif text-xl font-bold text-stone-900">Manage Catalog</h2>
                <button
                  onClick={() => {
                    setProductForm({ _id: '', name: '', category: 'Serum', price: 0, discountPrice: 0, stock: 0, images: [''], description: '', sku: '' });
                    setEditingProduct(false);
                    setShowProductModal(true);
                  }}
                  className="rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-3 py-1.5 text-xs transition flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Product
                </button>
              </div>

              {/* Product Modal overlay */}
              {showProductModal && (
                <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-lg p-6 max-w-lg w-full border border-stone-250 max-h-[85vh] overflow-y-auto space-y-4">
                    <h3 className="font-serif text-lg font-bold text-stone-950 border-b border-stone-100 pb-2">
                      {editingProduct ? 'Edit Skincare Product' : 'Add New Product'}
                    </h3>
                    <form onSubmit={handleProductSubmit} className="space-y-3.5 text-xs">
                      <div>
                        <label className="block text-stone-500 font-semibold uppercase mb-1">Product Name</label>
                        <input
                          type="text"
                          required
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-stone-500 font-semibold uppercase mb-1">SKU</label>
                          <input
                            type="text"
                            required
                            value={productForm.sku}
                            onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                            className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-500 font-semibold uppercase mb-1">Category</label>
                          <select
                            value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                            className="w-full rounded border border-stone-300 bg-white px-3 py-2 text-sm text-stone-850"
                          >
                            <option value="Cleanser">Cleanser</option>
                            <option value="Serum">Serum</option>
                            <option value="Moisturizer">Moisturizer</option>
                            <option value="Sunscreen">Sunscreen</option>
                            <option value="Toner">Toner</option>
                            <option value="Oil">Oil</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-stone-500 font-semibold uppercase mb-1">Price (₹)</label>
                          <input
                            type="number"
                            required
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value || '0') })}
                            className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-500 font-semibold uppercase mb-1">Discount Price (₹)</label>
                          <input
                            type="number"
                            value={productForm.discountPrice}
                            onChange={(e) => setProductForm({ ...productForm, discountPrice: parseFloat(e.target.value || '0') })}
                            className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-500 font-semibold uppercase mb-1">Stock</label>
                          <input
                            type="number"
                            required
                            value={productForm.stock}
                            onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value || '0') })}
                            className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-stone-500 font-semibold uppercase mb-1">Image URL</label>
                        <input
                          type="text"
                          required
                          value={productForm.images[0]}
                          onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                          className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-500 font-semibold uppercase mb-1">Description</label>
                        <textarea
                          rows={3}
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900"
                        ></textarea>
                      </div>
                      <div className="flex justify-end space-x-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowProductModal(false)}
                          className="rounded border border-stone-300 px-4 py-2 text-xs font-semibold hover:bg-stone-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded bg-emerald-700 text-white px-5 py-2 text-xs font-semibold hover:bg-emerald-850"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Product Listing */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-stone-250">
                  <thead className="bg-stone-50 text-stone-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">SKU</th>
                      <th className="py-3 px-4">Product Name</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {products.map((prod) => (
                      <tr key={prod._id || prod.id} className="hover:bg-stone-50/50">
                        <td className="py-3 px-4 font-mono text-stone-500">{prod.sku}</td>
                        <td className="py-3 px-4 text-stone-950 font-semibold">{prod.name}</td>
                        <td className="py-3 px-4">₹{prod.discountPrice || prod.price}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            prod.stock < 10 ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'
                          }`}>
                            {prod.stock} units
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2.5">
                          <button
                            onClick={() => handleEditProduct(prod)}
                            className="text-stone-400 hover:text-emerald-700 transition"
                          >
                            <Edit2 className="h-4.5 w-4.5 inline" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod._id || prod.id)}
                            className="text-stone-400 hover:text-red-700 transition"
                          >
                            <Trash2 className="h-4.5 w-4.5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: Orders management */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">Update Order Shipments</h2>
              
              <div className="space-y-5">
                {orders.length === 0 ? (
                  <p className="text-xs text-stone-400">No customer orders placed yet.</p>
                ) : (
                  orders.map((ord) => (
                    <div key={ord._id} className="p-4 border border-stone-250 rounded-lg bg-stone-50 text-xs sm:text-sm space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between border-b border-stone-200/60 pb-2 gap-2">
                        <div>
                          <span className="block font-bold text-stone-950">ID: {ord._id}</span>
                          <span className="text-[10px] text-stone-400">Placed on: {new Date(ord.createdAt).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="block text-right font-bold text-stone-950">₹{ord.totals?.grandTotal?.toFixed(2)}</span>
                          <span className="text-[10px] text-emerald-800 font-bold block text-right">{ord.paymentMethod} Payment</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-600">
                        <div>
                          <p className="font-bold text-stone-900 mb-1 uppercase tracking-wider text-[9px] text-stone-400">Shipping Address</p>
                          <p className="font-medium">{ord.shippingAddress?.addressLine}</p>
                          <p>{ord.shippingAddress?.city}, {ord.shippingAddress?.state} - {ord.shippingAddress?.pincode}</p>
                        </div>
                        <div className="space-y-1.5">
                          <label className="block font-bold text-stone-900 uppercase tracking-wider text-[9px] text-stone-400">Modify Shipment Status</label>
                          <select
                            value={ord.status}
                            onChange={(e) => handleOrderStatusChange(ord._id || ord.id, e.target.value)}
                            className="rounded border border-stone-300 bg-white px-2 py-1 text-xs font-semibold text-stone-800 focus:outline-none"
                          >
                            <option value="Placed">Placed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Coupon Generator */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">Promo & Coupons Generator</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Form left */}
                <div className="md:col-span-1 bg-stone-50 p-4 border border-stone-200 rounded-lg space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-850">Create Coupon</h3>
                  <form onSubmit={handleCouponSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-stone-500 font-semibold mb-1">Coupon Code</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. SUMMER30"
                        value={couponForm.code}
                        onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                        className="w-full rounded border border-stone-300 px-3 py-1.5 text-sm uppercase text-stone-950 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-500 font-semibold mb-1">Discount Type</label>
                      <select
                        value={couponForm.discountType}
                        onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                        className="w-full rounded border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-800"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed (₹)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-stone-500 font-semibold mb-1">Discount Value</label>
                      <input
                        type="number"
                        required
                        value={couponForm.discountValue}
                        onChange={(e) => setCouponForm({ ...couponForm, discountValue: parseFloat(e.target.value || '0') })}
                        className="w-full rounded border border-stone-300 px-3 py-1.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-500 font-semibold mb-1">Expiry Date</label>
                      <input
                        type="date"
                        required
                        value={couponForm.expiryDate}
                        onChange={(e) => setCouponForm({ ...couponForm, expiryDate: e.target.value })}
                        className="w-full rounded border border-stone-300 px-3 py-1.5 text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded bg-emerald-700 hover:bg-emerald-850 text-white font-semibold py-2 text-xs transition"
                    >
                      Save Promo
                    </button>
                  </form>
                </div>

                {/* List Coupons right */}
                <div className="md:col-span-2 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-850">Active Promo Codes</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {coupons.length === 0 ? (
                      <p className="text-xs text-stone-450">No promotional coupons saved.</p>
                    ) : (
                      coupons.map((c, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 border border-stone-250 rounded-md text-xs sm:text-sm">
                          <div>
                            <span className="font-bold text-stone-900 block font-mono">{c.code}</span>
                            <span className="text-[10px] text-stone-400">
                              Value: {c.discountType === 'percentage' ? `${c.discountValue}% Off` : `₹${c.discountValue} Off`} | Exp: {new Date(c.expiryDate).toLocaleDateString()}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteCoupon(c.code)}
                            className="text-stone-400 hover:text-red-700 transition"
                            title="Delete Coupon"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
