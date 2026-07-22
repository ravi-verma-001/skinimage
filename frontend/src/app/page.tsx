'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductCard, ProductType } from '@/components/ProductCard';
import { Sparkles, ArrowRight, ShieldCheck, Award, Heart, CheckCircle2, ChevronDown, RefreshCw, Star, Camera, CheckCircle } from 'lucide-react';

import { API_URL } from '@/config';

// Fallback dummy products in case API is loading or fails
const FALLBACK_PRODUCTS: ProductType[] = [
  {
    _id: "p1",
    name: "Nourishing Cleansing Oil",
    category: "Cleanser",
    price: 1599.00,
    discountPrice: 1329.00,
    stock: 85,
    images: ["/cleanser.png", "/CleanserVideo.mp4"],
    description: "Skinimage Nourishing Cleansing Oil (10+ Nourishing Botanical Oils + Plant-Derived Squalane + Amla, Bhringraj & Brahmi Extracts) is a luxury-grade, deep-cleansing oil-to-milk formula. It effortlessly dissolves water-resistant makeup, long-wear sunscreen, excess sebum, and urban pollutants.",
    rating: 4.8,
    reviewsCount: 142,
    isFeatured: true,
    isBestSeller: true
  },
  {
    _id: "p2",
    name: "AHA & BHA Face Serum",
    category: "Serum",
    price: 1199.00,
    discountPrice: 899.00,
    stock: 50,
    images: ["/aha_bha_face_serum.jpg"],
    description: "AHA & BHA Face Serum is an advanced exfoliating skincare formulation designed to remove dead skin cells, refine skin texture, and promote a clearer, brighter, and more youthful complexion with regular use.",
    rating: 4.7,
    reviewsCount: 98,
    isFeatured: true,
    isNewArrival: true
  },
  {
    _id: "p3",
    name: "UV-Aurora Sunscreen",
    category: "Sunscreen",
    price: 999.00,
    discountPrice: 798.00,
    stock: 120,
    images: ["/uv_aurora_sunscreen.png"],
    description: "Skinimage UV-Aurora The Lightest 1% Hyaluronic Acid Aqua Sunscreen Gel SPF 50 PA++++ is an ultra-lightweight, fast-absorbing sunscreen formulated to provide broad-spectrum protection against UVA and UVB rays while delivering deep hydration and a non-greasy, water-light feel suitable for daily use. This advanced aqua sunscreen gel is powered by key ingredients such as Hyaluronic Acid to deeply hydrate and maintain skin moisture, Homosalate and Octyl Methoxy Cinnamate to provide effective UVB protection, Tinosorb M for broad-spectrum UVA and UVB defense, Zinc PCA to help balance oil and support skin clarity, Vitamin E for antioxidant protection, Kakadu Plum Extract to support skin radiance and environmental defense, Silk Protein Extract for a smooth and soft skin finish, Aristoflex AVC for lightweight gel texture, Allantoin to soothe and calm the skin, and Melanin to enhance photoprotection. Designed for all skin types, this sunscreen spreads effortlessly, absorbs quickly without white cast, and helps protect skin from sun damage, premature ageing, and dehydration when applied regularly as directed.",
    rating: 4.9,
    reviewsCount: 215,
    isFeatured: true,
    isBestSeller: true
  },
  {
    _id: "p8",
    name: "AHA BHA Face Wash",
    category: "Cleanser",
    price: 999.00,
    discountPrice: 799.00,
    stock: 150,
    images: ["/aha_bha_face_wash.jpg"],
    description: "Meet your new daily essential — AHA BHA Face Wash, formulated to tackle uneven skin tone, acne, and excess oil all in one step, without stripping your skin.",
    rating: 4.8,
    reviewsCount: 210,
    isFeatured: true,
    isBestSeller: true
  }
];

export default function Home() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBeforeAfter, setActiveBeforeAfter] = useState<'acne' | 'pigment'>('acne');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const bannerMessages = [
    "Your Skin Deserves the Best. We're Building It",
    "Dermatologist Tested",
    "100% Vegan & Cruelty-Free",
    "For All Skin Types",
    "Clean Formulations"
  ];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_URL}/products?isFeatured=true`);
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        setProducts(data.length > 0 ? data : FALLBACK_PRODUCTS);
      } catch (err) {
        console.warn('Backend API connection failed, loading premium fallback products.', err);
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBannerVisible(false);
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % bannerMessages.length);
        setIsBannerVisible(true);
      }, 500); // matches the duration of the transition
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const beforeAfterData = {
    acne: {
      before: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=400",
      after: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400",
      title: "Targeting Breakouts & Skin Texture",
      desc: "Result after 4 weeks of using Gentle Centella Hydrating Cleanser and 2% BHA Salicylic Acid Exfoliating Toner daily.",
      routine: "AM: Gentle Cleanser + SPF 50. PM: Gentle Cleanser + 2% BHA + Niacinamide Gel Cream."
    },
    pigment: {
      before: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&q=80&w=400",
      after: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      title: "Brightening Dark Spots & Sun Damage",
      desc: "Result after 6 weeks of using 15% Vitamin C Glow Brightening Serum and Triple Hyaluronic Acid + B5 Plumping Serum.",
      routine: "AM: Vitamin C Serum + Hyaluronic Acid + SPF 50. PM: Gentle Cleanser + Hyaluronic Acid + Retinol."
    }
  };

  const keyIngredients = [
    { name: "Centella Asiatica", function: "Calming & Healing", desc: "Soothes inflammation, speeds up cellular repair, and calms irritated or sensitive skin." },
    { name: "Niacinamide (5%)", function: "Pore Control & Barrier", desc: "Regulates sebum, improves lipid barrier, and fades post-acne redness." },
    { name: "Vitamin C (L-Ascorbic Acid)", function: "Brightening & Collagen", desc: "Powerful antioxidant that blocks pigment production and boosts firming collagen." },
    { name: "BHA (Salicylic Acid)", function: "Deep Pore Exfoliation", desc: "Oil-soluble acid that penetrates deep inside pores to clear acne-causing blockages." },
  ];

  const faqs = [
    { q: "Are your products suitable for sensitive skin?", a: "Yes, all Skinimage products are formulated with dermatological sensitivity in mind. We use soothing buffers like Centella Asiatica, Panthenol, and Ceramides to support skin health without triggering irritation." },
    { q: "How should I store my Vitamin C Serum?", a: "To maintain maximum potency, store your 15% Vitamin C Serum in a cool, dark place away from direct sunlight (or in a cosmetics fridge). Keep the cap tightly sealed to prevent oxidation." },
    { q: "When will I start seeing results?", a: "Hydration benefits (Hyaluronic Acid & Centella Cleanser) are immediate. Skin texture and pore improvements (BHA & Niacinamide) can be seen within 2-3 weeks, while pigment fading and wrinkle repair (Vitamin C & Retinol) typically require 4-6 weeks of consistent use." },
    { q: "Are Skinimage products cruelty-free?", a: "100%. We never test our formulas or ingredients on animals, and we only partner with cruelty-free suppliers." }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Promotional Ribbon */}
      <div className="bg-emerald-800 text-stone-100 py-2.5 px-4 text-center text-xs tracking-widest font-semibold uppercase flex items-center justify-center gap-1.5 overflow-hidden h-10">
        <span 
          className={`flex items-center justify-center gap-2 transition-all duration-500 ease-in-out transform ${
            isBannerVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '8s' }} />
          {bannerMessages[currentTextIndex]}
          <Sparkles className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '8s' }} />
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-white">
        <div className="w-full relative">
          <video 
            src="/Aha_Bha_video.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-auto max-h-[550px] md:max-h-none object-cover block"
          />
        </div>
      </section>

      {/* Banner Section */}
      <section className="w-full bg-white">
        <div className="w-full">
          <img
            src="/banner.png"
            alt="Skinimage Banner"
            className="w-full h-auto object-cover block"
          />
        </div>
      </section>

      {/* Featured / Best Seller Products Grid */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">The Best Sellers</h2>
            <p className="text-stone-500 mt-3 text-sm sm:text-base leading-relaxed">
              Explore our highest rated, dermatologist-recommended essentials loved by thousands globally.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col space-y-4">
                  <div className="bg-stone-200 aspect-square w-full rounded-lg"></div>
                  <div className="h-4 bg-stone-200 rounded w-1/3"></div>
                  <div className="h-5 bg-stone-200 rounded w-3/4"></div>
                  <div className="h-4 bg-stone-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/shop" className="inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition">
              Explore All 9 Formulations <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-stone-50 border-t border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="font-serif text-3xl font-bold text-stone-900">Shop by Skin Goal</h2>
              <p className="text-stone-500 mt-2 text-sm">Target specific routines with precision formulations.</p>
            </div>
            <Link href="/shop" className="mt-4 md:mt-0 inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition">
              View shop filter <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Cleansers Category */}
            <Link href="/shop?category=Cleanser" className="relative group overflow-hidden rounded-lg aspect-[4/3] bg-stone-900">
              <img
                src="/category_cleanser.png"
                alt="Cleanser Category"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-50 transition-opacity duration-500"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-stone-950/80 to-transparent">
                <h3 className="font-serif text-xl font-bold text-white mb-1">Purify & Cleanse</h3>
                <p className="text-xs text-stone-300">Gentle pH-balanced formulations</p>
              </div>
            </Link>

            {/* Serums Category */}
            <Link href="/shop?category=Serum" className="relative group overflow-hidden rounded-lg aspect-[4/3] bg-stone-900">
              <img
                src="/category_serum.png"
                alt="Serum Category"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-50 transition-opacity duration-500"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-stone-950/80 to-transparent">
                <h3 className="font-serif text-xl font-bold text-white mb-1">Targeted Serums</h3>
                <p className="text-xs text-stone-300">Clinical actives for specific skin concerns</p>
              </div>
            </Link>

            {/* Moisturizers Category */}
            <Link href="/shop?category=Moisturizer" className="relative group overflow-hidden rounded-lg aspect-[4/3] bg-stone-900">
              <img
                src="/category_moisturizer.png"
                alt="Moisturizer Category"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-50 transition-opacity duration-500"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-stone-950/80 to-transparent">
                <h3 className="font-serif text-xl font-bold text-white mb-1">Hydrate & Protect</h3>
                <p className="text-xs text-stone-300">Moisturizers and barrier creams</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story Philosophy / Why Choose Us */}
      <section id="brand-story" className="py-24 bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left: Premium Product Image with floating effect */}
            <div className="lg:col-span-6 relative flex justify-center">
              {/* Soft Lavender Background Glow Accent */}
              <div className="absolute -inset-4 rounded-[24px] bg-[#F6F1FB] opacity-70 blur-xl"></div>
              
              <div className="relative aspect-square w-full max-w-[500px] overflow-hidden rounded-[18px] bg-[#F8F8F8] border border-stone-100 shadow-md transition-all duration-700 hover:shadow-xl hover:-translate-y-2 group">
                <img
                  src="/skinimage-skincare-active-ingredients.jpg"
                  alt="Skinimage Skincare premium serums made with clinically inspired active ingredients for healthy, glowing skin."
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
              </div>
            </div>

            {/* Right: Content details */}
            <div className="lg:col-span-6 space-y-8 flex flex-col justify-center">
              <div className="space-y-4">
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#6F4A8E] block">
                  SCIENCE • CARE • RESULTS
                </span>
                <h2 className="font-serif text-4xl sm:text-5xl lg:text-[54px] font-semibold text-[#6F4A8E] tracking-tight leading-[110%]">
                  Healthy Skin Starts with Science.
                </h2>
                <h3 className="text-lg font-medium text-[#6F4A8E]/80 leading-relaxed max-w-xl">
                  Premium skincare powered by clinically inspired active ingredients for visible, long-lasting results.
                </h3>
              </div>

              <p className="text-[#5F6368] leading-[170%] text-base sm:text-[18px] max-w-xl">
                At <strong>Skinimage Skincare</strong>, we believe effective skincare combines science, quality, and simplicity. Our formulas are enriched with proven active ingredients such as Niacinamide, Vitamin C, Hyaluronic Acid, AHA, and BHA to help brighten, hydrate, repair, and protect your skin. Every product is carefully crafted to deliver real results while remaining gentle enough for daily use, giving your skin the care it deserves.
              </p>

              {/* Feature Highlights with icons matching the screenshot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl">
                <div className="flex items-center space-x-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F6F1FB] text-[#6F4A8E]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900 leading-none mb-1">Clinically Inspired</h4>
                    <p className="text-xs text-stone-500">Formulas</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F6F1FB] text-[#6F4A8E]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900 leading-none mb-1">Premium Active</h4>
                    <p className="text-xs text-stone-500">Ingredients</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F6F1FB] text-[#6F4A8E]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900 leading-none mb-1">Suitable for</h4>
                    <p className="text-xs text-stone-500">All Skin Types</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F6F1FB] text-[#6F4A8E]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900 leading-none mb-1">Visible, Long-</h4>
                    <p className="text-xs text-stone-500">Lasting Results</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link 
                  href="/shop" 
                  className="inline-flex items-center justify-center rounded-[14px] bg-[#6F4A8E] text-white font-semibold px-8 py-3.5 text-sm tracking-wide shadow-md transition-all duration-300 hover:bg-[#5C3C7A] hover:shadow-lg hover:scale-[1.03] group"
                >
                  Shop Now <span className="ml-2 transition-transform duration-350 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before & After Interactive Showcase */}
      <section className="py-20 bg-stone-50 border-t border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="font-serif text-3xl font-bold text-stone-900">Proven Real Results</h2>
            <p className="text-stone-500 mt-2 text-sm">See verified transformations from our clean daily skincare routines.</p>
            
            {/* Tabs toggle */}
            <div className="flex justify-center mt-6 gap-4">
              <button
                onClick={() => setActiveBeforeAfter('acne')}
                className={`px-4 py-1.5 text-xs font-semibold tracking-wide uppercase rounded-full transition ${
                  activeBeforeAfter === 'acne' ? 'bg-emerald-700 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                Acne & Texture
              </button>
              <button
                onClick={() => setActiveBeforeAfter('pigment')}
                className={`px-4 py-1.5 text-xs font-semibold tracking-wide uppercase rounded-full transition ${
                  activeBeforeAfter === 'pigment' ? 'bg-emerald-700 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                Pigmentation & Glow
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Before After Images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="block text-center text-xs font-semibold uppercase tracking-wider text-stone-500">Before</span>
                <div className="aspect-square rounded-lg overflow-hidden border border-stone-200">
                  <img src={beforeAfterData[activeBeforeAfter].before} alt="Skin concern before treatment" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-2">
                <span className="block text-center text-xs font-semibold uppercase tracking-wider text-emerald-800 font-bold">After</span>
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-emerald-600/30">
                  <img src={beforeAfterData[activeBeforeAfter].after} alt="Skin after treatment" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Before After description */}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-stone-900">{beforeAfterData[activeBeforeAfter].title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{beforeAfterData[activeBeforeAfter].desc}</p>
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-md">
                <span className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Recommended Routine</span>
                <p className="text-xs text-stone-700 leading-relaxed">{beforeAfterData[activeBeforeAfter].routine}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Ingredients Spotlight */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="font-serif text-3xl font-bold text-stone-900">Key Bio-Actives</h2>
            <p className="text-stone-500 mt-2 text-sm">Transparency in active dosage. Nothing hidden.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {keyIngredients.map((ing, i) => (
              <div key={i} className="p-6 rounded-lg border border-stone-200 bg-stone-50 hover:border-emerald-700/40 hover:shadow-xs transition duration-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm mb-4">
                  0{i + 1}
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">{ing.name}</h3>
                <span className="text-xs font-semibold text-emerald-800 block mb-3 uppercase tracking-wide">{ing.function}</span>
                <p className="text-xs text-stone-600 leading-relaxed">{ing.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Skin Analyzer Banner */}
      <section className="py-20 bg-white border-t border-stone-200 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-950 rounded-[32px] overflow-hidden shadow-xl text-white relative">
            {/* Background glowing shapes */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16 relative z-10">
              {/* Text Left */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5 text-purple-300" />
                  Instant Skin Scan
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  Discover Your Skin Health Score in 60 Seconds
                </h2>
                
                <p className="text-purple-100 text-sm sm:text-base leading-relaxed font-light font-sans">
                  Powered by advanced AI Vision analysis, our analyzer processes a single selfie to evaluate key characteristics like hydration, pores, acne, and redness, generating a personalized product catalog mapping.
                </p>

                <div className="space-y-3 pt-2 text-sm text-purple-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                    <span>Get an objective Skin Health Score (0–100)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                    <span>Real-time detection of hydration, oiliness, and open pores</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                    <span>Personalized ingredient-to-product routine matches</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/skin-analyzer"
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-750 text-white font-bold py-3.5 px-7 transition duration-200 shadow-lg text-sm group"
                  >
                    <span>Launch AI Skin Analyzer</span>
                    <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Graphic/Scan Animation Mockup Right */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[280px] aspect-square rounded-2xl border border-purple-500/30 bg-purple-950/40 p-4 shadow-2xl overflow-hidden flex items-center justify-center">
                  {/* Glowing neon scanner animation */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-purple-400 shadow-[0_0_15px_#A855F7] animate-scan-line z-20" />
                  
                  {/* Mock profile image vector */}
                  <div className="flex flex-col items-center justify-center gap-3 text-purple-300">
                    <div className="p-5 rounded-full bg-purple-900/60 border border-purple-400/20 text-purple-400 relative">
                      <Camera className="h-10 w-10 animate-pulse" />
                      <div className="absolute inset-0 border border-purple-400/40 rounded-full animate-ping opacity-35" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-purple-200">Face Scanner Frame</span>
                    <span className="text-[10px] text-purple-400/70 text-center max-w-[180px]">Upload selfie to start real-time calibration</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#FAF5FF] border-t border-stone-200 relative overflow-hidden">
        {/* Background Dot grids for styling */}
        <div className="absolute top-10 left-5 text-purple-200/50 hidden md:block select-none pointer-events-none opacity-40">
          <div className="w-24 h-48" style={{ backgroundImage: 'radial-gradient(#C084FC 2px, transparent 2px)', backgroundSize: '12px 12px' }} />
        </div>
        <div className="absolute bottom-10 right-5 text-purple-200/50 hidden md:block select-none pointer-events-none opacity-40">
          <div className="w-24 h-48" style={{ backgroundImage: 'radial-gradient(#C084FC 2px, transparent 2px)', backgroundSize: '12px 12px' }} />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">Don&apos;t just take our word, take theirs.</h2>
          </div>

          {/* Horizontal scroll container */}
          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide px-2 snap-x">
            {[
              {
                name: "Arun Singh",
                location: "Chandigarh",
                comment: "I think NextSkin is really bringing a new kind of innovation to India. My parents have never used telemedicine before but they absolutely love the Video Consult option! The experience is super easy, ultra smooth, and extremely useful for their skincare.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
              },
              {
                name: "Basil Matthew",
                location: "Kerala",
                comment: "My entire family has been super into skincare products since a long time, but never have we ever seen such fast results with ZERO side effects. I feel like my family is safer now, I think I&apos;m going to replace my skincare routine with NextSkin&apos;s Rx-grade products.",
                image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150"
              },
              {
                name: "Priya Sharma",
                location: "Delhi",
                comment: "Finding the right skincare in India is so hard with the climate, but NextSkin has been a game-changer. The personalized recommendation and pure ingredients cleared my persistent acne in just 3 weeks!",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
              }
            ].map((review, idx) => (
              <div key={idx} className="flex flex-row items-start gap-5 p-6 rounded-[20px] bg-white border-2 border-[#4C1D95]/85 shadow-sm max-w-md sm:max-w-lg shrink-0 snap-center">
                {/* Profile Image with dotted decorative shadow */}
                <div className="relative shrink-0 mt-1">
                  <div className="absolute -bottom-2 -left-2 w-16 h-16 opacity-35" style={{ backgroundImage: 'radial-gradient(#4C1D95 2px, transparent 2px)', backgroundSize: '5px 5px' }} />
                  <img src={review.image} className="relative z-10 w-16 h-16 rounded-xl object-cover border border-stone-100 shadow-sm" alt={review.name} />
                </div>

                <div className="space-y-3">
                  {/* Rating Stars */}
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
                    {review.comment}
                  </p>

                  {/* Profile info */}
                  <div className="pt-1">
                    <h4 className="font-bold text-stone-900 text-sm">{review.name}</h4>
                    <span className="text-xs text-purple-400 font-medium block mt-0.5">{review.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PDRN Serum Banner */}
      <section className="bg-white border-t border-stone-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl shadow-sm border border-stone-100">
            <img
              src="/pdrn_banner.png"
              alt="PDRN Regenerating Serum Banner"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white border-t border-stone-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-stone-900 text-center mb-10">Frequently Asked Questions</h2>
          <div className="divide-y divide-stone-200">
            {faqs.map((faq, index) => (
              <div key={index} className="py-5">
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-base font-semibold text-stone-950">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-stone-500 transition-transform duration-200 ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="mt-3 text-sm text-stone-600 leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
