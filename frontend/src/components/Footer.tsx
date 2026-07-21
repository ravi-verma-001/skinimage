'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, Instagram, Twitter, Youtube, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success('Thank you for subscribing to our newsletter! Enjoy 10% off.');
      setEmail('');
    }
  };

  return (
    <footer className="border-t border-emerald-250 bg-emerald-100 text-stone-800">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Story */}
          <div className="space-y-4">
            <Link href="/" className="transition hover:opacity-85 flex items-center">
              <img
                src="/skinimagelogo.png"
                alt="Skin Image Logo"
                className="h-10 w-auto object-contain brightness-95"
              />
            </Link>
            <p className="text-sm text-stone-600 leading-relaxed max-w-xs">
              Formulated for maximum results, minimum irritation. We design luxury skincare backed by clinical science and powered by bio-active botanicals.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-stone-500 hover:text-emerald-700 transition" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-stone-500 hover:text-emerald-700 transition" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-stone-500 hover:text-emerald-700 transition" aria-label="Youtube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-stone-900 uppercase mb-4">Explore</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/shop" className="text-sm text-stone-600 hover:text-emerald-700 transition">
                  Shop All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Cleanser" className="text-sm text-stone-600 hover:text-emerald-700 transition">
                  Cleansers
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Serum" className="text-sm text-stone-600 hover:text-emerald-700 transition">
                  Treatment Serums
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Moisturizer" className="text-sm text-stone-600 hover:text-emerald-700 transition">
                  Moisturizers
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Help */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-stone-900 uppercase mb-4">Customer Care</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/#faq" className="text-sm text-stone-600 hover:text-emerald-700 transition">
                  FAQ & Support
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-stone-600 hover:text-emerald-700 transition">
                  Track Your Order
                </Link>
              </li>
              <li>
                <span className="text-sm text-stone-600 hover:text-emerald-700 transition cursor-pointer" onClick={() => toast.success("Free shipping on orders over $50. Deliveries take 3-5 business days.")}>
                  Shipping Policy
                </span>
              </li>
              <li>
                <span className="text-sm text-stone-600 hover:text-emerald-700 transition cursor-pointer" onClick={() => toast.success("We offer a 30-day money-back guarantee if you are not satisfied.")}>
                  Refund Policy
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-stone-900 uppercase mb-4 flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-emerald-700" /> Newsletter
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Subscribe to unlock 10% off your first order, and receive early access to new launches.
            </p>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full min-w-0 rounded-l-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-r-md bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800 transition"
                aria-label="Subscribe"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-emerald-250 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500">
          <p>&copy; {new Date().getFullYear()} Skinimage Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
