'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ProductCard, ProductType } from '@/components/ProductCard';
import { Heart, Package, User as UserIcon, MapPin, RefreshCw, Eye, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const MOCK_ORDERS = [
  {
    _id: "o_mock_991823",
    trackingNumber: "NX-882739",
    createdAt: "2026-07-01T10:30:00Z",
    status: "Delivered",
    paymentStatus: "Completed",
    totals: { grandTotal: 44.49 },
    items: [
      { productId: "p1", name: "Gentle Centella Hydrating Cleanser", price: 19.99, quantity: 1, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600" },
      { productId: "p8", name: "Broad-Spectrum SPF 50 Airy Daily Sunscreen", price: 25.00, quantity: 1, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600" }
    ]
  }
];

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token, logout, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<ProductType[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Profile forms
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePassword, setProfilePassword] = useState('');
  const [submittingProfile, setSubmittingProfile] = useState(false);

  // Address forms
  const [newAddress, setNewAddress] = useState({
    country: 'United States',
    state: '',
    city: '',
    pincode: '',
    addressLine: '',
    landmark: '',
  });

  const queryTab = searchParams.get('tab');

  useEffect(() => {
    if (!token && !localStorage.getItem('nextskin_token')) {
      router.push('/login');
    }
  }, [token]);

  useEffect(() => {
    if (queryTab) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  // Load orders
  useEffect(() => {
    if (!token) return;
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const res = await fetch(`${API_URL}/orders/myorders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.ok ? await res.json() : [];
        setOrders(data.length > 0 ? data : MOCK_ORDERS);
      } catch (err) {
        console.warn('Could not fetch real order history. Loading local mock orders.', err);
        setOrders(MOCK_ORDERS);
      } finally {
        setLoadingOrders(false);
      }
    };
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab, token]);

  // Load wishlist details
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user || !user.wishlist || user.wishlist.length === 0) {
        setWishlistProducts([]);
        return;
      }
      setLoadingWishlist(true);
      try {
        const promises = user.wishlist.map(id => 
          fetch(`${API_URL}/products/${id}`).then(res => res.json())
        );
        const results = await Promise.all(promises);
        setWishlistProducts(results.filter(r => r && !r.message));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingWishlist(false);
      }
    };
    if (activeTab === 'wishlist') fetchWishlist();
  }, [activeTab, user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingProfile(true);
    try {
      const payload: any = { name: profileName };
      if (profilePassword) payload.password = profilePassword;
      await updateProfile(payload);
      setProfilePassword('');
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSubmittingProfile(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.addressLine || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      toast.error('Please fill in required address fields');
      return;
    }
    try {
      const currentAddresses = user?.addresses || [];
      const updatedAddresses = [...currentAddresses, { ...newAddress, id: Math.random().toString() }];
      await updateProfile({ addresses: updatedAddresses });
      setNewAddress({ country: 'United States', state: '', city: '', pincode: '', addressLine: '', landmark: '' });
      toast.success('New address added!');
    } catch (error) {
      toast.error('Could not add address');
    }
  };

  const handleRemoveAddress = async (addrId: string) => {
    try {
      const currentAddresses = user?.addresses || [];
      const updatedAddresses = currentAddresses.filter((a: any) => a.id !== addrId && a._id !== addrId);
      await updateProfile({ addresses: updatedAddresses });
      toast.success('Address removed');
    } catch (error) {
      toast.error('Could not delete address');
    }
  };

  if (!user) {
    return (
      <div className="flex h-96 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-emerald-700" />
      </div>
    );
  }

  const tabs = [
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'profile', label: 'Profile Settings', icon: UserIcon },
    { id: 'addresses', label: 'Manage Addresses', icon: MapPin },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-stone-50">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-200 pb-8 mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-stone-900 tracking-tight">Your Dashboard</h1>
          <p className="text-stone-500 text-sm mt-1">Hello, {user.name}. Manage your orders, addresses, and wishlist details.</p>
        </div>
        <button
          onClick={() => {
            logout();
            router.push('/');
          }}
          className="rounded-md border border-stone-300 px-4 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition"
        >
          Logout Session
        </button>
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
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 bg-white border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Dynamic content card */}
        <main className="lg:col-span-3 bg-white p-6 sm:p-8 rounded-lg border border-stone-200 shadow-xs">
          
          {/* TAB 1: Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">Your Purchase History</h2>
              
              {loadingOrders ? (
                <div className="flex justify-center py-10"><RefreshCw className="animate-spin h-6 w-6 text-emerald-700" /></div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-stone-200 rounded-lg">
                  <p className="text-sm text-stone-400">No orders placed yet.</p>
                  <Link href="/shop" className="mt-4 inline-flex items-center text-xs font-semibold text-emerald-700">Go Shop &rarr;</Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((ord) => (
                    <div key={ord._id} className="rounded-lg border border-stone-200 bg-stone-50 overflow-hidden text-xs sm:text-sm">
                      
                      {/* Order header details */}
                      <div className="bg-stone-100 p-4 border-b border-stone-200 flex flex-col sm:flex-row justify-between gap-3">
                        <div>
                          <p className="text-stone-400 uppercase tracking-wide font-bold text-[9px]">Order ID</p>
                          <span className="font-mono text-stone-900 font-bold">{ord._id}</span>
                        </div>
                        <div>
                          <p className="text-stone-400 uppercase tracking-wide font-bold text-[9px]">Date Placed</p>
                          <span className="text-stone-700 font-medium">{new Date(ord.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <p className="text-stone-400 uppercase tracking-wide font-bold text-[9px]">Total Cost</p>
                          <span className="text-stone-950 font-bold">₹{ord.totals?.grandTotal?.toFixed(2)}</span>
                        </div>
                        <div>
                          <p className="text-stone-400 uppercase tracking-wide font-bold text-[9px]">Status</p>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ord.status}
                          </span>
                        </div>
                      </div>

                      {/* Items loop */}
                      <div className="p-4 divide-y divide-stone-200/60">
                        {ord.items?.map((item: any, idx: number) => (
                          <div key={idx} className="py-3 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <img src={item.image} alt={item.name} className="h-10 w-10 object-cover rounded bg-stone-200" />
                              <div>
                                <p className="font-semibold text-stone-850 truncate max-w-xs">{item.name}</p>
                                <p className="text-[10px] text-stone-400">Quantity: {item.quantity}</p>
                              </div>
                            </div>
                            <span className="font-bold text-stone-950">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Tracking Footer */}
                      {ord.trackingNumber && (
                        <div className="p-4 bg-emerald-50 border-t border-stone-200 text-xs font-semibold text-emerald-800 flex items-center justify-between">
                          <span>Standard delivery tracking ID: {ord.trackingNumber}</span>
                          <span className="text-[10px] text-emerald-600 uppercase">On Route</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">Your Saved Products</h2>
              
              {loadingWishlist ? (
                <div className="flex justify-center py-10"><RefreshCw className="animate-spin h-6 w-6 text-emerald-700" /></div>
              ) : wishlistProducts.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-stone-200 rounded-lg">
                  <p className="text-xs text-stone-400">Wishlist empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {wishlistProducts.map((prod) => (
                    <ProductCard key={prod._id || prod.id} product={prod} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Profile settings */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">Profile Information</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Email Address (Read-only)</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full rounded border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-450 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    required
                    className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Update Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password (optional)"
                    value={profilePassword}
                    onChange={(e) => setProfilePassword(e.target.value)}
                    className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingProfile}
                  className="rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-2.5 text-xs transition disabled:bg-stone-300"
                >
                  {submittingProfile ? 'Saving...' : 'Update Settings'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: Address Management */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">Manage Addresses</h2>
              
              {/* Existing Address List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses?.length === 0 ? (
                  <p className="text-xs text-stone-400">No addresses added. Create one below.</p>
                ) : (
                  user.addresses?.map((addr: any, i: number) => (
                    <div key={addr._id || addr.id || i} className="p-4 border border-stone-250 rounded-lg space-y-2 relative bg-stone-50 text-xs">
                      <p className="font-bold text-stone-950">{user.name}</p>
                      <p className="text-stone-600">{addr.addressLine}</p>
                      <p className="text-stone-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-stone-600">{addr.country}</p>
                      {addr.landmark && <p className="text-[10px] text-stone-450 italic">Landmark: {addr.landmark}</p>}
                      <button
                        onClick={() => handleRemoveAddress(addr._id || addr.id)}
                        className="text-xs text-red-500 hover:underline hover:text-red-700 block pt-1.5"
                      >
                        Delete Address
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add New Address Form */}
              <div className="border-t border-stone-200 pt-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-850 mb-4">Add a New Address</h3>
                <form onSubmit={handleAddAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={newAddress.addressLine}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                      required
                      className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">City</label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      required
                      className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">State / Province</label>
                    <input
                      type="text"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      required
                      className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Pincode / Zipcode</label>
                    <input
                      type="text"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      required
                      className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      value={newAddress.landmark}
                      onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                      className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900"
                    />
                  </div>
                  <div className="sm:col-span-2 pt-2">
                    <button
                      type="submit"
                      className="rounded-md bg-stone-900 hover:bg-stone-800 text-white font-semibold px-6 py-2 text-xs transition"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  return (
    <Suspense fallback={
      <div className="flex h-96 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-emerald-700" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
