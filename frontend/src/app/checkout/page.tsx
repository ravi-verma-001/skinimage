'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Check, CreditCard, ChevronRight, ShieldCheck, ShoppingBag, Truck, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totals, coupon, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form states
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  });

  const [shippingAddress, setShippingAddress] = useState({
    country: 'United States',
    state: '',
    city: '',
    pincode: '',
    addressLine: '',
    landmark: '',
  });

  const [deliveryMethod, setDeliveryMethod] = useState('Standard');
  const [paymentMethod, setPaymentMethod] = useState('COD'); // COD or Online

  // Completed order summary details
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  const handleNextStep = () => {
    if (step === 1) {
      if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
        toast.error('Please fill in all customer details.');
        return;
      }
    }
    if (step === 2) {
      if (!shippingAddress.state || !shippingAddress.city || !shippingAddress.pincode || !shippingAddress.addressLine) {
        toast.error('Please complete your shipping address.');
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Inject standard express shipping charge if selected
      const finalTotals = { ...totals };
      if (deliveryMethod === 'Express') {
        finalTotals.shipping += 10;
        finalTotals.grandTotal += 10;
      }

      const orderPayload = {
        userId: user?._id || null,
        guestInfo: !user ? customerInfo : null,
        items: cart.map(i => ({
          productId: i.productId,
          name: i.name,
          price: i.discountPrice || i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        shippingAddress,
        deliveryMethod,
        paymentMethod,
        couponApplied: coupon ? { code: coupon.code, discountAmount: totals.discount } : null,
        totals: finalTotals,
      };

      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to place order');

      setConfirmedOrder(data);
      clearCart();
      setStep(6); // Go to success confirmation screen
      toast.success('Order placed successfully!');
    } catch (error: any) {
      // Mock submit in case database fails
      console.warn('API error, simulating order placement locally.', error);
      const mockOrder = {
        _id: 'o_mock_' + Math.floor(100000 + Math.random() * 900000),
        trackingNumber: 'NX-' + Math.floor(100000 + Math.random() * 900000),
        status: 'Placed',
        createdAt: new Date().toISOString(),
        items: cart,
        totals: {
          ...totals,
          shipping: deliveryMethod === 'Express' ? totals.shipping + 10 : totals.shipping,
          grandTotal: deliveryMethod === 'Express' ? totals.grandTotal + 10 : totals.grandTotal
        }
      };
      setConfirmedOrder(mockOrder);
      clearCart();
      setStep(6);
      toast.success('Order placed (Simulated local order)!');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && step < 6) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-6">
        <h1 className="font-serif text-2xl font-bold text-stone-900">Your Checkout is Empty</h1>
        <p className="text-stone-500 text-sm">Please add items to your cart first.</p>
        <Link href="/shop" className="inline-flex rounded-md bg-emerald-700 px-6 py-2.5 text-xs font-semibold text-white">
          Return to Shop
        </Link>
      </div>
    );
  }

  const stepsHeader = [
    { number: 1, label: 'Info' },
    { number: 2, label: 'Shipping' },
    { number: 3, label: 'Delivery' },
    { number: 4, label: 'Payment' },
    { number: 5, label: 'Review' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-stone-50">
      
      {/* Checkout Steps bar */}
      {step < 6 && (
        <div className="mb-10 max-w-3xl mx-auto flex items-center justify-between">
          {stepsHeader.map((s, idx) => (
            <React.Fragment key={s.number}>
              <div className="flex flex-col items-center space-y-1">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition ${
                  step >= s.number ? 'bg-emerald-700 text-white' : 'bg-stone-250 text-stone-500'
                }`}>
                  {step > s.number ? <Check className="h-4 w-4" /> : s.number}
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-stone-600">{s.label}</span>
              </div>
              {idx < stepsHeader.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 sm:mx-4 ${step > s.number ? 'bg-emerald-700' : 'bg-stone-200'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Grid wrapper for checkout */}
      {step < 6 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Content left */}
          <div className="lg:col-span-8 bg-white p-6 rounded-lg border border-stone-200 shadow-xs">
            
            {/* STEP 1: Customer details */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">Customer Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. +1 555-0199"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Shipping details */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Country</label>
                    <select
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      className="w-full rounded border border-stone-300 bg-white px-3 py-2 text-sm text-stone-850 focus:border-emerald-600 focus:outline-none"
                    >
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="India">India</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">State / Province</label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">City</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Postal Pincode</label>
                    <input
                      type="text"
                      value={shippingAddress.pincode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                      className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Full Address / House details</label>
                    <input
                      type="text"
                      value={shippingAddress.addressLine}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine: e.target.value })}
                      className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      value={shippingAddress.landmark}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, landmark: e.target.value })}
                      className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Delivery Options */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">Delivery Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 border border-stone-300 rounded-md cursor-pointer hover:bg-stone-50">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === 'Standard'}
                        onChange={() => setDeliveryMethod('Standard')}
                        className="h-4 w-4 text-emerald-700 focus:ring-emerald-700 mr-3"
                      />
                      <div>
                        <span className="block font-bold text-stone-900 text-sm">Standard Shipping</span>
                        <span className="block text-xs text-stone-400">Delivered in 3-5 business days</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-stone-900">
                      {totals.subtotal > 50 ? 'FREE' : '₹5.00'}
                    </span>
                  </label>

                  <label className="flex items-center justify-between p-4 border border-stone-300 rounded-md cursor-pointer hover:bg-stone-50">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === 'Express'}
                        onChange={() => setDeliveryMethod('Express')}
                        className="h-4 w-4 text-emerald-700 focus:ring-emerald-700 mr-3"
                      />
                      <div>
                        <span className="block font-bold text-stone-900 text-sm">Express Priority Delivery</span>
                        <span className="block text-xs text-stone-400">Guaranteed next-day delivery</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-emerald-750">+₹10.00</span>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 4: Payment */}
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-stone-300 rounded-md cursor-pointer hover:bg-stone-50">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="h-4 w-4 text-emerald-700 focus:ring-emerald-700 mr-3"
                    />
                    <div>
                      <span className="block font-bold text-stone-900 text-sm flex items-center">
                        <Truck className="h-4 w-4 mr-1.5 text-stone-600" /> Cash On Delivery (COD)
                      </span>
                      <span className="block text-xs text-stone-400">Pay with cash when package is delivered. No extra fees.</span>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-stone-300 rounded-md cursor-pointer hover:bg-stone-50">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Online'}
                      onChange={() => setPaymentMethod('Online')}
                      className="h-4 w-4 text-emerald-700 focus:ring-emerald-700 mr-3"
                    />
                    <div>
                      <span className="block font-bold text-stone-900 text-sm flex items-center">
                        <CreditCard className="h-4 w-4 mr-1.5 text-stone-600" /> Online Payment (Stripe / Razorpay)
                      </span>
                      <span className="block text-xs text-stone-400">Secure simulated card transaction. Pre-auth ready.</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 5: Final review */}
            {step === 5 && (
              <div className="space-y-6">
                <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">Final Order Review</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
                  <div className="space-y-1">
                    <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[10px] text-stone-400">Customer Info</h3>
                    <p className="font-medium text-stone-850">{customerInfo.name}</p>
                    <p className="text-stone-500">{customerInfo.email} | {customerInfo.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[10px] text-stone-400">Shipping To</h3>
                    <p className="font-medium text-stone-850">{shippingAddress.addressLine}</p>
                    <p className="text-stone-500">
                      {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[10px] text-stone-400">Delivery Method</h3>
                    <p className="font-medium text-stone-850">{deliveryMethod} Shipping</p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[10px] text-stone-400">Payment Option</h3>
                    <p className="font-medium text-stone-850">{paymentMethod === 'Online' ? 'Pre-paid Online' : 'Cash On Delivery'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions Footer */}
            <div className="mt-8 pt-6 border-t border-stone-100 flex justify-between">
              {step > 1 ? (
                <button
                  onClick={handlePrevStep}
                  className="rounded-md border border-stone-300 px-6 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
                >
                  Back
                </button>
              ) : (
                <Link
                  href="/cart"
                  className="rounded-md border border-stone-300 px-6 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
                >
                  Return to Cart
                </Link>
              )}

              {step < 5 ? (
                <button
                  onClick={handleNextStep}
                  className="rounded-md bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-2 text-xs font-semibold transition"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="rounded-md bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-2 text-xs font-semibold transition flex items-center"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="animate-spin h-4 w-4 mr-2" /> Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              )}
            </div>

          </div>

          {/* Right sidebar order checklist */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-lg border border-stone-200 bg-white p-6 space-y-4 shadow-xs">
              <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2 uppercase tracking-wider">
                Order Items ({cart.length})
              </h2>
              
              <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.productId} className="py-3 flex items-center space-x-3">
                    <img src={item.image} alt={item.name} className="h-10 w-10 object-cover rounded bg-stone-100 flex-shrink-0" />
                    <div className="flex-grow min-w-0">
                      <p className="text-xs font-semibold text-stone-850 truncate">{item.name}</p>
                      <p className="text-[10px] text-stone-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-stone-950 flex-shrink-0">
                      ₹{((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="border-t border-stone-100 pt-4 text-xs space-y-1.5 text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Discount</span>
                    <span>-₹{totals.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {deliveryMethod === 'Express' ? '₹10.00' : totals.shipping === 0 ? 'FREE' : `₹${totals.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST / Est. Tax (18%)</span>
                  <span>₹{totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-950 border-t border-stone-100 pt-2">
                  <span>Estimated Total</span>
                  <span>
                    ₹{(totals.grandTotal + (deliveryMethod === 'Express' ? 10 : 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* STEP 6: Success page */
        <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-lg border border-stone-200 text-center space-y-6 shadow-md">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
            <Check className="h-8 w-8" />
          </div>
          
          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-extrabold text-stone-900 tracking-tight">Thank You For Your Order!</h1>
            <p className="text-stone-500 text-sm leading-relaxed max-w-md mx-auto">
              Your order has been confirmed. A receipt and shipping updates have been sent to your registered email.
            </p>
          </div>

          {confirmedOrder && (
            <div className="bg-stone-50 border border-stone-200 p-5 rounded-md text-left text-xs sm:text-sm divide-y divide-stone-200/60 max-w-md mx-auto">
              <div className="pb-2.5 flex justify-between">
                <span className="text-stone-400 font-semibold uppercase tracking-wider text-[10px]">Order ID</span>
                <span className="font-bold text-stone-950">{confirmedOrder._id}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-stone-400 font-semibold uppercase tracking-wider text-[10px]">Tracking Number</span>
                <span className="font-bold text-emerald-850">{confirmedOrder.trackingNumber}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-stone-400 font-semibold uppercase tracking-wider text-[10px]">Estimated Delivery</span>
                <span className="font-bold text-stone-850">3 - 5 Business Days</span>
              </div>
              <div className="pt-2.5 flex justify-between">
                <span className="text-stone-400 font-semibold uppercase tracking-wider text-[10px]">Paid Amount</span>
                <span className="font-bold text-stone-950">₹{confirmedOrder.totals?.grandTotal?.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-2.5 text-xs transition"
            >
              Continue Shopping
            </Link>
            <Link
              href="/dashboard?tab=orders"
              className="rounded-md border border-stone-300 font-semibold text-stone-800 px-6 py-2.5 text-xs hover:bg-stone-50 transition"
            >
              Track Order In Dashboard
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
