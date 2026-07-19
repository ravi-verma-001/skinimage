'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, Sparkles, X, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totals, coupon, applyCoupon, removeCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setApplying(true);
    const success = await applyCoupon(couponCode);
    setApplying(false);
    if (success) {
      toast.success(`Coupon "${couponCode.toUpperCase()}" applied!`);
      setCouponCode('');
    } else {
      toast.error('Invalid or expired coupon code.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-stone-400">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Your Cart is Empty</h1>
        <p className="text-stone-500 max-w-sm mx-auto text-sm leading-relaxed">
          It looks like you haven&apos;t added any premium formulations to your cart yet. Let&apos;s start building your skin routine.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center rounded-md bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-stone-50">
      <h1 className="font-serif text-3xl font-extrabold text-stone-900 tracking-tight mb-8">Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Cart items list */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-lg border border-stone-200 bg-white divide-y divide-stone-100">
            {cart.map((item) => {
              const activePrice = item.discountPrice || item.price;
              return (
                <div key={item.productId} className="p-4 sm:p-6 flex space-x-4 sm:space-x-6 items-center">
                  <div className="h-20 w-20 rounded-md overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-stone-900 truncate">
                      <Link href={`/product/${item.productId}`} className="hover:text-emerald-700">
                        {item.name}
                      </Link>
                    </h3>
                     <p className="text-xs text-stone-400 mt-0.5">Unit Price: ₹{activePrice}</p>
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-2 mt-3">
                      <div className="flex items-center border border-stone-300 rounded bg-stone-55">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="px-2.5 py-1 text-stone-600 hover:text-stone-950 transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 py-1 text-xs text-stone-900 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-2.5 py-1 text-stone-600 hover:text-stone-950 transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and delete */}
                  <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                    <span className="text-sm sm:text-base font-bold text-stone-950">
                      ₹{(activePrice * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => {
                        removeFromCart(item.productId);
                        toast.success('Removed from cart');
                      }}
                      className="text-stone-400 hover:text-red-600 transition p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link href="/shop" className="text-sm font-semibold text-emerald-755 hover:underline">
              &larr; Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Side: Order summary details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-lg border border-stone-200 bg-white p-6 space-y-5 shadow-xs">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 uppercase tracking-wider">
              Order Summary
            </h2>

            {/* Coupons Section */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase text-stone-500">Apply Promo Code</label>
              {coupon ? (
                <div className="flex items-center justify-between rounded bg-emerald-50 px-3 py-2 border border-emerald-100">
                  <span className="text-xs text-emerald-800 font-semibold flex items-center">
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Code: {coupon.code}
                  </span>
                  <button onClick={removeCoupon} className="text-emerald-700 hover:text-emerald-950 transition">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="WELCOME10, SKINCARE20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full min-w-0 rounded border border-stone-300 px-3 py-1.5 text-xs text-stone-900 focus:border-emerald-600 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={applying}
                    className="rounded bg-stone-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-stone-850 transition"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-sm border-t border-stone-100 pt-4">
              <div className="flex justify-between text-stone-600">
                <span>Bag Subtotal</span>
                <span>₹{totals.subtotal.toFixed(2)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount</span>
                  <span>-₹{totals.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Shipping Charges</span>
                <span>{totals.shipping === 0 ? 'FREE' : `₹${totals.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>GST / Est. Tax (18%)</span>
                <span>₹{totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-stone-950 text-base border-t border-stone-100 pt-3">
                <span>Grand Total</span>
                <span>₹{totals.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              className="w-full inline-flex items-center justify-center rounded-md bg-emerald-700 hover:bg-emerald-800 py-3.5 text-sm font-semibold text-white transition shadow-sm"
            >
              Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
