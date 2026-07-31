'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, MessageSquare, ShieldCheck, Truck, CreditCard, RefreshCw } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

interface CategoryGroup {
  id: string;
  title: string;
  icon: any;
  items: FaqItem[];
}

export default function FaqClient() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

  const categories: CategoryGroup[] = [
    {
      id: 'products',
      title: 'Product Info & Skin Suitability',
      icon: ShieldCheck,
      items: [
        { q: "Are your products suitable for sensitive skin?", a: "Yes, all Skinimage products are formulated with dermatological sensitivity in mind. We use soothing buffers like Centella Asiatica, Panthenol, and Ceramides to support skin health without triggering irritation." },
        { q: "How should I store my Vitamin C Serum?", a: "To maintain maximum potency, store your 15% Vitamin C Serum in a cool, dark place away from direct sunlight (or in a cosmetics fridge). Keep the cap tightly sealed to prevent oxidation." },
        { q: "When will I start seeing results?", a: "Hydration benefits (Hyaluronic Acid & Centella Cleanser) are immediate. Skin texture and pore improvements (BHA & Niacinamide) can be seen within 2-3 weeks, while pigment fading and wrinkle repair (Vitamin C & Retinol) typically require 4-6 weeks of consistent use." },
        { q: "Are Skinimage products cruelty-free?", a: "100%. We never test our formulas or ingredients on animals, and we only partner with cruelty-free suppliers." }
      ]
    },
    {
      id: 'shipping',
      title: 'Orders & Shipping',
      icon: Truck,
      items: [
        { q: "How long does shipping take within India?", a: "Metro cities usually receive deliveries within 2-3 business days. Rest of India takes 4-6 business days depending on the location." },
        { q: "Can I track my order?", a: "Yes. As soon as your order ships, we will email you a tracking number and link to monitor the delivery status." }
      ]
    },
    {
      id: 'payments',
      title: 'Payments & COD',
      icon: CreditCard,
      items: [
        { q: "Do you offer Cash on Delivery (COD)?", a: "Yes, we offer Cash on Delivery across most pin codes in India. You can also pay securely online using UPI, Credit/Debit cards, or Netbanking." }
      ]
    },
    {
      id: 'returns',
      title: 'Returns & Refunds',
      icon: RefreshCw,
      items: [
        { q: "What is your return policy?", a: "We offer returns or replacements on damaged or incorrect items within 7 days of delivery. Please refer to our Refund Policy page for step-by-step instructions." }
      ]
    }
  ];

  const handleToggle = (catId: string, idx: number) => {
    const key = `${catId}-${idx}`;
    setExpandedIndex(expandedIndex === key ? null : key);
  };

  const getFilteredItems = () => {
    if (activeCategory === 'all') {
      return categories.flatMap(cat => cat.items.map(item => ({ ...item, catId: cat.id })));
    }
    const cat = categories.find(c => c.id === activeCategory);
    return cat ? cat.items.map(item => ({ ...item, catId: cat.id })) : [];
  };

  return (
    <div className="bg-white min-h-screen text-[#14121A] selection:bg-[#E8DFF4] font-sans pb-20">
      
      {/* Hero Header */}
      <section className="bg-[#F9F8FB] border-b border-stone-200 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-[#5B2A8C]">Skinimage Support</span>
          <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-[#14121A] font-serif leading-tight">
            How can we help you?
          </h1>
          <p className="text-stone-500 font-light max-w-md mx-auto text-sm sm:text-base leading-relaxed">
            Find quick answers to common questions about our science-backed skincare products, shipping, and returns.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Navigation: Categories Selection */}
          <div className="lg:col-span-1 space-y-2.5">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4 px-2">Categories</h3>
            <button
              onClick={() => { setActiveCategory('all'); setExpandedIndex(null); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2.5 ${
                activeCategory === 'all' 
                  ? 'bg-[#E8DFF4] text-[#5B2A8C]' 
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              All Questions
            </button>
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setExpandedIndex(null); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2.5 ${
                    activeCategory === cat.id 
                      ? 'bg-[#E8DFF4] text-[#5B2A8C]' 
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {cat.title}
                </button>
              );
            })}
          </div>

          {/* Right Area: Accordion List */}
          <div className="lg:col-span-3 space-y-4">
            {getFilteredItems().map((item, idx) => {
              const itemKey = `${item.catId}-${idx}`;
              const isExpanded = expandedIndex === itemKey;

              return (
                <div 
                  key={itemKey} 
                  className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                    isExpanded 
                      ? 'border-[#5B2A8C] bg-[#F9F8FB]' 
                      : 'border-stone-200 hover:border-[#5B2A8C]/30 bg-white'
                  }`}
                >
                  <button
                    onClick={() => handleToggle(item.catId, idx)}
                    className="flex w-full items-center justify-between text-left p-5 focus:outline-none"
                  >
                    <span className="text-sm sm:text-base font-medium text-[#14121A] pr-4 leading-snug">
                      {item.q}
                    </span>
                    <ChevronDown 
                      className={`h-5 w-5 text-stone-400 shrink-0 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180 text-[#5B2A8C]' : ''
                      }`} 
                    />
                  </button>
                  
                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="px-5 pb-5 text-xs sm:text-sm text-stone-600 font-light leading-relaxed border-t border-stone-100/50 pt-3">
                      {item.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CTA Footer Support banner */}
      <section className="mx-auto max-w-4xl px-4 mt-8">
        <div className="bg-[#F9F8FB] border border-stone-200 rounded-2xl p-8 text-center space-y-5">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#E8DFF4] text-[#5B2A8C]">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-medium tracking-tight font-serif">Still have questions?</h3>
          <p className="text-xs sm:text-sm text-stone-500 font-light max-w-md mx-auto leading-relaxed">
            If you cannot find answer to your question in our FAQ, you can chat directly with our skincare experts via WhatsApp.
          </p>
          <div className="pt-2">
            <Link
              href="https://wa.me/919818660316"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#5B2A8C] hover:bg-[#5B2A8C]/95 text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300 text-sm uppercase tracking-wider"
            >
              Chat on WhatsApp
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
