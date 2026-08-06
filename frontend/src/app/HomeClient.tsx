'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductCard, ProductType } from '@/components/ProductCard';
import { Sparkles, ArrowRight, ShieldCheck, Award, Heart, CheckCircle2, ChevronDown, RefreshCw, Star, Camera, CheckCircle } from 'lucide-react';

import { API_URL } from '@/config';
import { getOptimizedMediaUrl } from '@/utils/cloudinary';

// Fallback dummy products in case API is loading or fails
const FALLBACK_PRODUCTS: ProductType[] = [
  {
    _id: "p1",
    name: "Oil Cleanser",
    category: "Cleanser",
    price: 1329.00,
    stock: 85,
    images: ["/cleanser.png", "/CleanserVideo.mp4"],
    description: "Skinimage Oil Cleanser (10+ Nourishing Botanical Oils + Plant-Derived Squalane + Amla, Bhringraj & Brahmi Extracts) is a luxury-grade, deep-cleansing oil-to-milk formula. It effortlessly dissolves water-resistant makeup, long-wear sunscreen, excess sebum, and urban pollutants.",
    rating: 5.0,
    reviewsCount: 0,
    isFeatured: true,
    isBestSeller: true
  },
  {
    _id: "p2",
    name: "AHA & BHA Face Serum",
    category: "Serum",
    price: 899.00,
    stock: 50,
    images: ["/aha_bha_face_serum.jpg"],
    description: "AHA & BHA Face Serum is an advanced exfoliating skincare formulation designed to remove dead skin cells, refine skin texture, and promote a clearer, brighter, and more youthful complexion with regular use.",
    rating: 5.0,
    reviewsCount: 0,
    isFeatured: true,
    isNewArrival: true
  },
  {
    _id: "p3",
    name: "UV-Aurora Sunscreen",
    category: "Sunscreen",
    price: 798.00,
    stock: 120,
    images: ["/uv_aurora_sunscreen.png"],
    description: "Skinimage UV-Aurora The Lightest 1% Hyaluronic Acid Aqua Sunscreen Gel SPF 50 PA++++ is an ultra-lightweight, fast-absorbing sunscreen formulated to provide broad-spectrum protection against UVA and UVB rays while delivering deep hydration and a non-greasy, water-light feel suitable for daily use. This advanced aqua sunscreen gel is powered by key ingredients such as Hyaluronic Acid to deeply hydrate and maintain skin moisture, Homosalate and Octyl Methoxy Cinnamate to provide effective UVB protection, Tinosorb M for broad-spectrum UVA and UVB defense, Zinc PCA to help balance oil and support skin clarity, Vitamin E for antioxidant protection, Kakadu Plum Extract to support skin radiance and environmental defense, Silk Protein Extract for a smooth and soft skin finish, Aristoflex AVC for lightweight gel texture, Allantoin to soothe and calm the skin, and Melanin to enhance photoprotection. Designed for all skin types, this sunscreen spreads effortlessly, absorbs quickly without white cast, and helps protect skin from sun damage, premature ageing, and dehydration when applied regularly as directed.",
    rating: 5.0,
    reviewsCount: 0,
    isFeatured: true,
    isBestSeller: true
  },
  {
    _id: "p8",
    name: "AHA BHA Face Wash",
    category: "Cleanser",
    price: 799.00,
    stock: 150,
    images: ["/aha_bha_face_wash.jpg"],
    description: "Meet your new daily essential — AHA BHA Face Wash, formulated to tackle uneven skin tone, acne, and excess oil all in one step, without stripping your skin.",
    rating: 5.0,
    reviewsCount: 0,
    isFeatured: true,
    isBestSeller: true
  }
];

const getFallbackTrending = (): ProductType[] => [
  FALLBACK_PRODUCTS[0],
  {
    _id: "p6",
    name: "Dr. PDRN Regenerating Serum with Peptides & Growth Factors | Advanced Skin Repair & Anti-Aging Serum",
    category: "Serum",
    price: 1440.00,
    stock: 110,
    images: ["/pdrn_regenerating_serum.jpg"],
    description: "Give your skin the tools to repair and renew itself with PDRN Regenerating Serum — an advanced formula built on DNA repair technology and clinically studied peptides. Designed for anyone looking to restore firmness, improve elasticity, and support long-term skin recovery.",
    rating: 5.0,
    reviewsCount: 0,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false
  }
];

export default function HomeClient() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<ProductType[]>([]);
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

        // Fetch trending
        const allRes = await fetch(`${API_URL}/products`);
        if (allRes.ok) {
          const allData = await allRes.json();
          const trending = allData.filter((p: any) => 
            p.name.toLowerCase().includes("oil cleanser") || 
            p.name.toLowerCase().includes("pdrn regenerating serum")
          );
          if (trending.length > 0) {
            setTrendingProducts(trending);
            return;
          }
        }
        setTrendingProducts(getFallbackTrending());
      } catch (err) {
        console.warn('Backend API connection failed, loading premium fallback products.', err);
        setProducts(FALLBACK_PRODUCTS);
        setTrendingProducts(getFallbackTrending());
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
      before: "/acne_before.jpeg",
      after: "/acne_after.jpeg",
      title: "Targeting Breakouts & Skin Texture",
      desc: "Result after 4 weeks of using Gentle Centella Hydrating Cleanser and 2% BHA Salicylic Acid Exfoliating Toner daily.",
      routine: "AM: Gentle Cleanser + SPF 50. PM: Gentle Cleanser + 2% BHA."
    },
    pigment: {
      before: "https://res.cloudinary.com/qm72f5jf/image/upload/v1785661761/before_irpwuw.jpg",
      after: "https://res.cloudinary.com/qm72f5jf/image/upload/v1785661761/after_ilacsz.jpg",
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
        <div className="w-full relative overflow-hidden">
          <video 
            src="https://res.cloudinary.com/qm72f5jf/video/upload/v1785745287/AHA_BHA_VIDEO_jptota.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            width={1920}
            height={480}
            className="w-full h-auto max-h-[380px] md:max-h-[480px] object-cover block scale-105 origin-center"
          />
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="py-20 bg-white border-b border-stone-200/80 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 flex flex-col items-center">
            {/* Animated Circular Doctor Logo */}
            <div className="relative mb-5 flex justify-center items-center">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full bg-emerald-600/20 blur-md animate-pulse"></div>
              {/* Spinning gradient ring */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-emerald-700 via-stone-200 to-emerald-500 animate-[spin_6s_linear_infinite] opacity-75"></div>
              {/* Image container */}
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg bg-white">
                <img 
                  src={getOptimizedMediaUrl('/doctorlogo.jpeg', { width: 128, height: 128 })} 
                  alt="Dermatologist Recommended" 
                  width={64}
                  height={64}
                  className="w-full h-full object-cover hover:scale-115 transition-transform duration-500"
                />
              </div>
            </div>

            <span className="text-[10px] font-bold text-emerald-800 tracking-[0.2em] uppercase bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100/80 inline-block mb-4">
              Dermatologist recommended brand
            </span>
            <h2 className="font-serif text-3.5xl md:text-4xl font-bold text-stone-900 tracking-tight">
              Our Trending Products
            </h2>
            <p className="text-stone-500 mt-3 text-sm md:text-base max-w-md mx-auto leading-relaxed">
              Highly active, results-driven luxury skin treatments that are currently leading skin routines.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-md mx-auto justify-items-center">
            {loading ? (
              [...Array(2)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col rounded-2xl border border-stone-100 p-4 bg-stone-50/50 space-y-4 w-full max-w-[220px]">
                  <div className="bg-stone-200/80 aspect-[4/5] w-full rounded-xl"></div>
                  <div className="h-3 bg-stone-200/80 rounded w-1/4 mt-2"></div>
                  <div className="h-5 bg-stone-200/80 rounded w-3/4"></div>
                  <div className="h-4 bg-stone-200/80 rounded w-1/3"></div>
                  <div className="h-8 bg-stone-200/80 rounded-full w-full mt-4"></div>
                </div>
              ))
            ) : (
              trendingProducts.map((product) => (
                <div key={product._id || product.id} className="w-full max-w-[220px]">
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="py-20 bg-stone-50/50 border-b border-stone-200/80 relative overflow-hidden">
        {/* Subtle Decorative Glows */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-emerald-50/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-stone-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-bold text-emerald-800 tracking-[0.2em] uppercase bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100/80">
              Curated Formulations
            </span>
            <h2 className="font-serif text-3.5xl md:text-4xl font-bold text-stone-900 mt-4 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-stone-500 mt-3 text-sm md:text-base max-w-md mx-auto leading-relaxed">
              Discover clean, advanced skincare designed to target your specific concerns.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 justify-items-center">
            {/* Facewash */}
            <Link 
              href="/shop/cleanser/" 
              prefetch={false} 
              className="group relative w-full aspect-[4/5] sm:max-w-none rounded-2xl overflow-hidden border border-stone-200/60 bg-stone-100 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-end"
            >
              {/* Image Background */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={getOptimizedMediaUrl('https://res.cloudinary.com/qm72f5jf/image/upload/v1785754356/Untitled_design_1_zln5if.png')}
                  alt="Facewash"
                  loading="lazy"
                  width={400}
                  height={500}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent transition-opacity duration-500 group-hover:from-stone-950/90" />
              </div>

              {/* Glowing Ambient Ring on Hover */}
              <div className="absolute inset-0 ring-1 ring-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

              {/* Glassmorphic Label Info */}
              <div className="relative z-10 m-2.5 p-3 sm:m-4 sm:p-4 bg-white/90 backdrop-blur-md rounded-xl border border-white/20 shadow-md transition-all duration-500 group-hover:bg-white group-hover:translate-y-[-2px] group-hover:shadow-lg">
                <h3 className="font-serif text-base font-bold text-stone-900 mt-1">
                  Facewash
                </h3>
                <p className="hidden sm:block text-[11px] text-stone-500 mt-1 leading-normal">
                  Deep cleansing & clarifying foam treatments.
                </p>
                <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-900 group-hover:text-emerald-700 transition-colors">
                  <span>Explore Collection</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>

            {/* Sunscreen */}
            <Link 
              href="/shop/sunscreen/" 
              prefetch={false} 
              className="group relative w-full aspect-[4/5] sm:max-w-none rounded-2xl overflow-hidden border border-stone-200/60 bg-stone-100 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-end"
            >
              {/* Image Background */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={getOptimizedMediaUrl('/uv_aurora_sunscreen.png', { width: 400, height: 500, crop: 'fit' })}
                  alt="Sunscreen"
                  loading="lazy"
                  width={400}
                  height={500}
                  className="w-full h-full object-contain p-1.5 pb-28 transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent transition-opacity duration-500 group-hover:from-stone-950/90" />
              </div>

              {/* Glowing Ambient Ring on Hover */}
              <div className="absolute inset-0 ring-1 ring-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

              {/* Glassmorphic Label Info */}
              <div className="relative z-10 m-2.5 p-3 sm:m-4 sm:p-4 bg-white/90 backdrop-blur-md rounded-xl border border-white/20 shadow-md transition-all duration-500 group-hover:bg-white group-hover:translate-y-[-2px] group-hover:shadow-lg">
                <h3 className="font-serif text-base font-bold text-stone-900 mt-1">
                  Sunscreen
                </h3>
                <p className="hidden sm:block text-[11px] text-stone-500 mt-1 leading-normal">
                  Broad spectrum hybrid & physical protection.
                </p>
                <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-900 group-hover:text-emerald-700 transition-colors">
                  <span>Explore Collection</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>

            {/* Cleanser */}
            <Link 
              href="/shop/cleanser/" 
              prefetch={false} 
              className="group relative w-full aspect-[4/5] sm:max-w-none rounded-2xl overflow-hidden border border-stone-200/60 bg-stone-100 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-end"
            >
              {/* Image Background */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={getOptimizedMediaUrl('/cleanser.png')}
                  alt="Cleanser"
                  loading="lazy"
                  width={400}
                  height={500}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent transition-opacity duration-500 group-hover:from-stone-950/90" />
              </div>

              {/* Glowing Ambient Ring on Hover */}
              <div className="absolute inset-0 ring-1 ring-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

              {/* Glassmorphic Label Info */}
              <div className="relative z-10 m-2.5 p-3 sm:m-4 sm:p-4 bg-white/90 backdrop-blur-md rounded-xl border border-white/20 shadow-md transition-all duration-500 group-hover:bg-white group-hover:translate-y-[-2px] group-hover:shadow-lg">
                <h3 className="font-serif text-base font-bold text-stone-900 mt-1">
                  Cleanser
                </h3>
                <p className="hidden sm:block text-[11px] text-stone-500 mt-1 leading-normal">
                  Gentle melt-away oils and hydrating milks.
                </p>
                <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-900 group-hover:text-emerald-700 transition-colors">
                  <span>Explore Collection</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>

            {/* Toner */}
            <Link 
              href="/shop/toner/" 
              prefetch={false} 
              className="group relative w-full aspect-[4/5] sm:max-w-none rounded-2xl overflow-hidden border border-stone-200/60 bg-stone-100 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-end"
            >
              {/* Image Background */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={getOptimizedMediaUrl('/milk_barrier_repair_toner.png')}
                  alt="Toner"
                  loading="lazy"
                  width={400}
                  height={500}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent transition-opacity duration-500 group-hover:from-stone-950/90" />
              </div>

              {/* Glowing Ambient Ring on Hover */}
              <div className="absolute inset-0 ring-1 ring-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

              {/* Glassmorphic Label Info */}
              <div className="relative z-10 m-2.5 p-3 sm:m-4 sm:p-4 bg-white/90 backdrop-blur-md rounded-xl border border-white/20 shadow-md transition-all duration-500 group-hover:bg-white group-hover:translate-y-[-2px] group-hover:shadow-lg">
                <h3 className="font-serif text-base font-bold text-stone-900 mt-1">
                  Toner
                </h3>
                <p className="hidden sm:block text-[11px] text-stone-500 mt-1 leading-normal">
                  Hydrating waters, essences, and toners.
                </p>
                <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-900 group-hover:text-emerald-700 transition-colors">
                  <span>Explore Collection</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* PDRN Banner Section */}
      <section className="w-full bg-stone-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link 
            href="/shop?search=PDRN" 
            prefetch={false}
            className="relative block overflow-hidden rounded-2xl md:rounded-3xl bg-stone-900 shadow-xl md:shadow-2xl group w-full"
          >
            {/* Background Image */}
            <img 
              src={getOptimizedMediaUrl('/PDRNIMAGE.png', { width: 1200, height: 400 })} 
              alt="PDRN Regenerating Banner" 
              loading="lazy"
              width={1200}
              height={400}
              className="w-full h-auto block transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
            {/* Subtle glow border */}
            <div className="absolute inset-0 ring-1 ring-white/10 group-hover:ring-emerald-400/30 transition-all duration-500 pointer-events-none rounded-2xl md:rounded-3xl" />
          </Link>
        </div>
      </section>

      {/* Featured / Best Seller Products Grid */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Soft Ambient glow behind the grid */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[60%] bg-stone-50/70 rounded-[100px] blur-3xl pointer-events-none -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-bold text-emerald-850 tracking-[0.2em] uppercase bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100/50 mb-4 inline-block">
              Most-Loved Formulas
            </span>
            <h2 className="font-serif text-3.5xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              The Best Sellers
            </h2>
            <p className="text-stone-500 mt-3 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              Explore our highest rated, dermatologist-recommended essentials loved by thousands globally.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col rounded-2xl border border-stone-100 p-4 bg-stone-50/50 space-y-4">
                  <div className="bg-stone-200/80 aspect-[4/5] w-full rounded-xl"></div>
                  <div className="h-3 bg-stone-200/80 rounded w-1/4 mt-2"></div>
                  <div className="h-5 bg-stone-200/80 rounded w-3/4"></div>
                  <div className="h-4 bg-stone-200/80 rounded w-1/3"></div>
                  <div className="h-8 bg-stone-200/80 rounded-full w-full mt-4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-stone-200 text-sm font-semibold text-stone-850 hover:bg-stone-50 hover:border-stone-300 transition-all duration-300"
            >
              <span>Explore All 9 Formulations</span> 
              <ArrowRight className="h-4 w-4 text-emerald-800 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story Philosophy / Why Choose Us */}
      <section id="brand-story" className="pt-8 pb-24 bg-gradient-to-b from-white to-stone-50/40 overflow-hidden relative">
        {/* Soft Ambient Glows */}
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-emerald-50/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-stone-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Left: Premium Product Image with floating effect */}
            <div className="lg:col-span-6 relative flex justify-center">
              {/* Outer decorative border decoration */}
              <div className="absolute -inset-2 sm:-inset-4 rounded-3xl border border-stone-250/20 pointer-events-none scale-98" />
              
              <div className="relative w-full max-w-[480px] overflow-hidden rounded-2xl bg-white border border-stone-200/40 shadow-xl transition-all duration-700 hover:shadow-2xl hover:-translate-y-1 group">
                <img
                  src={getOptimizedMediaUrl('https://res.cloudinary.com/qm72f5jf/image/upload/v1786013638/Skin_Product_og1i7a.png', { width: 480, crop: 'fit' })}
                  alt="Skinimage Skincare premium serums made with clinically inspired active ingredients for healthy, glowing skin."
                  loading="lazy"
                  width={480}
                  className="w-full h-auto object-contain transition-transform duration-1000 ease-out group-hover:scale-105"
                />
              </div>
            </div>

            {/* Right: Content details */}
            <div className="lg:col-span-6 space-y-8 flex flex-col justify-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2">
                  <span className="h-[1px] w-6 bg-emerald-700"></span>
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-emerald-800">
                    Science • Care • Results
                  </span>
                </div>
                <h2 className="font-serif text-4.5xl sm:text-5.5xl font-normal text-stone-900 tracking-tight leading-[115%]">
                  Healthy Skin Starts <br />
                  with <span className="italic font-light text-emerald-800">Science.</span>
                </h2>
                <p className="text-stone-500 text-sm sm:text-base leading-relaxed max-w-xl">
                  At <strong className="text-stone-900 font-semibold">Skinimage Skincare</strong>, we believe effective skincare combines science, quality, and simplicity. Our formulas are enriched with proven active ingredients such as Niacinamide, Vitamin C, Hyaluronic Acid, AHA, and BHA to help brighten, hydrate, repair, and protect your skin.
                </p>
              </div>

              {/* Feature Highlights with refined premium cards */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-xl">
                {/* Feature 1 */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white border border-stone-200/50 hover:border-emerald-500/20 hover:shadow-sm transition-all duration-300">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-stone-900">Clinically Inspired</h4>
                    <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5">Advanced formulations</p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white border border-stone-200/50 hover:border-emerald-500/20 hover:shadow-sm transition-all duration-300">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-stone-900">Active Ingredients</h4>
                    <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5">Proven premium actives</p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white border border-stone-200/50 hover:border-emerald-500/20 hover:shadow-sm transition-all duration-300">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-stone-900">Universal Care</h4>
                    <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5">Suitable for all skin types</p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white border border-stone-200/50 hover:border-emerald-500/20 hover:shadow-sm transition-all duration-300">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-stone-900">Proven Results</h4>
                    <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5">Visible, long-lasting effects</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-6">
                {/* Dermatologist Recommended Logo & Text */}
                <div className="flex items-center gap-3 bg-stone-100/50 p-2.5 pr-4 rounded-xl border border-stone-200/40">
                  <img 
                    src={getOptimizedMediaUrl('/doctorlogo.jpeg', { width: 96, height: 96 })} 
                    alt="Dr Recommended Formulation" 
                    loading="lazy"
                    width={48}
                    height={48}
                    className="h-12 w-auto object-contain rounded"
                  />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none">Formulation</span>
                    <span className="font-serif text-sm font-semibold text-stone-900 mt-1">Dermatologist Recommended</span>
                  </div>
                </div>

                <Link 
                  href="/shop" 
                  className="inline-flex items-center justify-center rounded-full bg-stone-900 text-white font-semibold px-6 py-3 text-xs uppercase tracking-wider transition-all duration-300 hover:bg-emerald-800 hover:shadow-lg hover:scale-[1.03] active:scale-95 group self-start sm:self-auto"
                >
                  Shop the Collection <span className="ml-2 transition-transform duration-350 group-hover:translate-x-1">→</span>
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
                  <img src={getOptimizedMediaUrl(beforeAfterData[activeBeforeAfter].before, { width: 500, height: 500 })} alt="Skin concern before treatment" loading="lazy" width={400} height={400} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-2">
                <span className="block text-center text-xs font-semibold uppercase tracking-wider text-emerald-800 font-bold">After</span>
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-emerald-600/30">
                  <img src={getOptimizedMediaUrl(beforeAfterData[activeBeforeAfter].after, { width: 500, height: 500 })} alt="Skin after treatment" loading="lazy" width={400} height={400} className="w-full h-full object-cover" />
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

      {/* Global Ingredients Spotlight */}
      <section className="py-20 bg-[#FAF9F6] relative overflow-hidden">
        {/* Subtle Decorative glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-purple-100/30 rounded-full blur-[120px] pointer-events-none -z-10" />
        
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[32px] border border-stone-200/60 shadow-[0_15px_40px_rgba(0,0,0,0.03)] p-6 sm:p-10 md:p-14 relative z-10">
            {/* Header */}
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-[#5B2A8C] font-semibold text-xs sm:text-sm tracking-[0.25em] uppercase">
                GLOBAL INGREDIENTS. TRUSTED ORIGINS.
              </h2>
            </div>

            {/* Content Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 relative">
              {/* Vertical Separator Line (visible on desktop) */}
              <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-[1px] bg-stone-200 -translate-x-1/2" />

              {/* Left Column */}
              <div className="flex flex-col divide-y divide-stone-100">
                {/* 1. Panthenol */}
                <div className="flex items-center gap-4 py-4 md:py-6 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 3 2" className="w-12 h-8 border border-stone-200 shadow-sm rounded-sm bg-white shrink-0">
                      <rect width="3" height="2" fill="white" />
                      <circle cx="1.5" cy="1" r="0.6" fill="#BC002D" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[#5B2A8C] font-medium text-sm sm:text-base tracking-tight leading-snug">
                      Panthenol (Pro-Vitamin B5)
                    </h3>
                    <p className="text-stone-500 text-xs sm:text-sm mt-0.5">Japan</p>
                  </div>
                </div>

                {/* 2. Centella Asiatica */}
                <div className="flex items-center gap-4 py-4 md:py-6 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 3 2" className="w-12 h-8 border border-stone-200 shadow-sm rounded-sm bg-white shrink-0">
                      <rect width="3" height="2" fill="white" />
                      {/* Taegeuk: angled at ~33.69 degrees */}
                      <g transform="translate(1.5, 1.0) rotate(-33.7)">
                        <path d="M -0.5 0 A 0.5 0.5 0 0 0 0.5 0" fill="#0F4C81" />
                        <path d="M -0.5 0 A 0.5 0.5 0 0 1 0.5 0" fill="#CD1C3C" />
                        <circle cx="-0.25" cy="0" r="0.25" fill="#CD1C3C" />
                        <circle cx="0.25" cy="0" r="0.25" fill="#0F4C81" />
                      </g>
                      {/* Trigrams */}
                      <g transform="translate(1.5, 1.0) rotate(-33.7)">
                        {/* Geon (top-left) */}
                        <g transform="translate(-0.8, -0.53) rotate(90)">
                          <line x1="-0.15" y1="-0.08" x2="0.15" y2="-0.08" stroke="black" strokeWidth="0.025" />
                          <line x1="-0.15" y1="0" x2="0.15" y2="0" stroke="black" strokeWidth="0.025" />
                          <line x1="-0.15" y1="0.08" x2="0.15" y2="0.08" stroke="black" strokeWidth="0.025" />
                        </g>
                        {/* Gon (bottom-right) */}
                        <g transform="translate(0.8, 0.53) rotate(90)">
                          <line x1="-0.15" y1="-0.08" x2="-0.02" y2="-0.08" stroke="black" strokeWidth="0.025" />
                          <line x1="0.02" y1="-0.08" x2="0.15" y2="-0.08" stroke="black" strokeWidth="0.025" />
                          <line x1="-0.15" y1="0" x2="-0.02" y2="0" stroke="black" strokeWidth="0.025" />
                          <line x1="0.02" y1="0" x2="0.15" y2="0" stroke="black" strokeWidth="0.025" />
                          <line x1="-0.15" y1="0.08" x2="-0.02" y2="0.08" stroke="black" strokeWidth="0.025" />
                          <line x1="0.02" y1="0.08" x2="0.15" y2="0.08" stroke="black" strokeWidth="0.025" />
                        </g>
                        {/* Ri (bottom-left) */}
                        <g transform="translate(-0.8, 0.53) rotate(90)">
                          <line x1="-0.15" y1="-0.08" x2="0.15" y2="-0.08" stroke="black" strokeWidth="0.025" />
                          <line x1="-0.15" y1="0" x2="-0.02" y2="0" stroke="black" strokeWidth="0.025" />
                          <line x1="0.02" y1="0" x2="0.15" y2="0" stroke="black" strokeWidth="0.025" />
                          <line x1="-0.15" y1="0.08" x2="0.15" y2="0.08" stroke="black" strokeWidth="0.025" />
                        </g>
                        {/* Gam (top-right) */}
                        <g transform="translate(0.8, -0.53) rotate(90)">
                          <line x1="-0.15" y1="-0.08" x2="-0.02" y2="-0.08" stroke="black" strokeWidth="0.025" />
                          <line x1="0.02" y1="-0.08" x2="0.15" y2="-0.08" stroke="black" strokeWidth="0.025" />
                          <line x1="-0.15" y1="0" x2="0.15" y2="0" stroke="black" strokeWidth="0.025" />
                          <line x1="-0.15" y1="0.08" x2="-0.02" y2="0.08" stroke="black" strokeWidth="0.025" />
                          <line x1="0.02" y1="0.08" x2="0.15" y2="0.08" stroke="black" strokeWidth="0.025" />
                        </g>
                      </g>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[#5B2A8C] font-medium text-sm sm:text-base tracking-tight leading-snug">
                      Centella Asiatica Extract - 2%
                    </h3>
                    <p className="text-stone-500 text-xs sm:text-sm mt-0.5">Korea</p>
                  </div>
                </div>

                {/* 3. Sodium Hyaluronate */}
                <div className="flex items-center gap-4 py-4 md:py-6 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 3 2" className="w-12 h-8 border border-stone-200 shadow-sm rounded-sm bg-white shrink-0">
                      <rect width="3" height="2" fill="white" />
                      {/* Taegeuk: angled at ~33.69 degrees */}
                      <g transform="translate(1.5, 1.0) rotate(-33.7)">
                        <path d="M -0.5 0 A 0.5 0.5 0 0 0 0.5 0" fill="#0F4C81" />
                        <path d="M -0.5 0 A 0.5 0.5 0 0 1 0.5 0" fill="#CD1C3C" />
                        <circle cx="-0.25" cy="0" r="0.25" fill="#CD1C3C" />
                        <circle cx="0.25" cy="0" r="0.25" fill="#0F4C81" />
                      </g>
                      {/* Trigrams */}
                      <g transform="translate(1.5, 1.0) rotate(-33.7)">
                        <g transform="translate(-0.8, -0.53) rotate(90)">
                          <line x1="-0.15" y1="-0.08" x2="0.15" y2="-0.08" stroke="black" strokeWidth="0.025" />
                          <line x1="-0.15" y1="0" x2="0.15" y2="0" stroke="black" strokeWidth="0.025" />
                          <line x1="-0.15" y1="0.08" x2="0.15" y2="0.08" stroke="black" strokeWidth="0.025" />
                        </g>
                        <g transform="translate(0.8, 0.53) rotate(90)">
                          <line x1="-0.15" y1="-0.08" x2="-0.02" y2="-0.08" stroke="black" strokeWidth="0.025" />
                          <line x1="0.02" y1="-0.08" x2="0.15" y2="-0.08" stroke="black" strokeWidth="0.025" />
                          <line x1="-0.15" y1="0" x2="-0.02" y2="0" stroke="black" strokeWidth="0.025" />
                          <line x1="0.02" y1="0" x2="0.15" y2="0" stroke="black" strokeWidth="0.025" />
                          <line x1="-0.15" y1="0.08" x2="-0.02" y2="0.08" stroke="black" strokeWidth="0.025" />
                          <line x1="0.02" y1="0.08" x2="0.15" y2="0.08" stroke="black" strokeWidth="0.025" />
                        </g>
                        <g transform="translate(-0.8, 0.53) rotate(90)">
                          <line x1="-0.15" y1="-0.08" x2="0.15" y2="-0.08" stroke="black" strokeWidth="0.025" />
                          <line x1="-0.15" y1="0" x2="-0.02" y2="0" stroke="black" strokeWidth="0.025" />
                          <line x1="0.02" y1="0" x2="0.15" y2="0" stroke="black" strokeWidth="0.025" />
                          <line x1="-0.15" y1="0.08" x2="0.15" y2="0.08" stroke="black" strokeWidth="0.025" />
                        </g>
                        <g transform="translate(0.8, -0.53) rotate(90)">
                          <line x1="-0.15" y1="-0.08" x2="-0.02" y2="-0.08" stroke="black" strokeWidth="0.025" />
                          <line x1="0.02" y1="-0.08" x2="0.15" y2="-0.08" stroke="black" strokeWidth="0.025" />
                          <line x1="-0.15" y1="0" x2="0.15" y2="0" stroke="black" strokeWidth="0.025" />
                          <line x1="-0.15" y1="0.08" x2="-0.02" y2="0.08" stroke="black" strokeWidth="0.025" />
                          <line x1="0.02" y1="0.08" x2="0.15" y2="0.08" stroke="black" strokeWidth="0.025" />
                        </g>
                      </g>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[#5B2A8C] font-medium text-sm sm:text-base tracking-tight leading-snug">
                      Sodium Hyaluronate - 0.2%
                    </h3>
                    <p className="text-stone-500 text-xs sm:text-sm mt-0.5">Korea</p>
                  </div>
                </div>

                {/* 4. Matrixyl */}
                <div className="flex items-center gap-4 py-4 md:py-6 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 5 3" className="w-12 h-8 border border-stone-200 shadow-sm rounded-sm shrink-0">
                      <rect width="5" height="1" y="0" fill="black" />
                      <rect width="5" height="1" y="1" fill="#DD0000" />
                      <rect width="5" height="1" y="2" fill="#FFCC00" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[#5B2A8C] font-medium text-sm sm:text-base tracking-tight leading-snug">
                      Matrixyl® Peptide Complex - 2%
                    </h3>
                    <p className="text-stone-500 text-xs sm:text-sm mt-0.5">Germany</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col divide-y divide-stone-100">
                {/* 1. Tasman Pepper */}
                <div className="flex items-center gap-4 py-4 md:py-6 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 60 30" className="w-12 h-8 border border-stone-200 shadow-sm rounded-sm bg-white shrink-0">
                      <clipPath id="union-jack-clip">
                        <rect width="30" height="15" />
                      </clipPath>
                      <rect width="60" height="30" fill="#000033" />
                      <g clipPath="url(#union-jack-clip)">
                        <rect width="30" height="15" fill="#000033" />
                        <line x1="0" y1="0" x2="30" y2="15" stroke="#FFFFFF" strokeWidth="3" />
                        <line x1="30" y1="0" x2="0" y2="15" stroke="#FFFFFF" strokeWidth="3" />
                        <line x1="0" y1="0" x2="30" y2="15" stroke="#CC0000" strokeWidth="2" />
                        <line x1="30" y1="0" x2="0" y2="15" stroke="#CC0000" strokeWidth="2" />
                        <line x1="15" y1="0" x2="15" y2="15" stroke="#FFFFFF" strokeWidth="5" />
                        <line x1="0" y1="7.5" x2="30" y2="7.5" stroke="#FFFFFF" strokeWidth="5" />
                        <line x1="15" y1="0" x2="15" y2="15" stroke="#CC0000" strokeWidth="3" />
                        <line x1="0" y1="7.5" x2="30" y2="7.5" stroke="#CC0000" strokeWidth="3" />
                      </g>
                      <g transform="translate(15, 22.5) scale(0.65)" fill="#FFFFFF">
                        <polygon points="0,-6 1.5,-2 5.5,-3 3,-0.5 4.5,3.5 0,1.5 -4.5,3.5 -3,-0.5 -5.5,-3 -1.5,-2" />
                      </g>
                      <g transform="translate(45, 24) scale(0.35)" fill="#FFFFFF">
                        <polygon points="0,-6 1.5,-2 5.5,-3 3,-0.5 4.5,3.5 0,1.5 -4.5,3.5 -3,-0.5 -5.5,-3 -1.5,-2" />
                      </g>
                      <g transform="translate(37.5, 12.5) scale(0.35)" fill="#FFFFFF">
                        <polygon points="0,-6 1.5,-2 5.5,-3 3,-0.5 4.5,3.5 0,1.5 -4.5,3.5 -3,-0.5 -5.5,-3 -1.5,-2" />
                      </g>
                      <g transform="translate(45, 6) scale(0.35)" fill="#FFFFFF">
                        <polygon points="0,-6 1.5,-2 5.5,-3 3,-0.5 4.5,3.5 0,1.5 -4.5,3.5 -3,-0.5 -5.5,-3 -1.5,-2" />
                      </g>
                      <g transform="translate(52.5, 11) scale(0.35)" fill="#FFFFFF">
                        <polygon points="0,-6 1.5,-2 5.5,-3 3,-0.5 4.5,3.5 0,1.5 -4.5,3.5 -3,-0.5 -5.5,-3 -1.5,-2" />
                      </g>
                      <g transform="translate(48, 16.5) scale(0.25)" fill="#FFFFFF">
                        <polygon points="0,-5 1.5,-1.5 5,-1.5 2,1 3,4.5 0,2.5 -3,4.5 -2,1 -5,-1.5 -1.5,-1.5" />
                      </g>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[#5B2A8C] font-medium text-sm sm:text-base tracking-tight leading-snug">
                      Tasman Pepper™ AF - 1%
                    </h3>
                    <p className="text-stone-500 text-xs sm:text-sm mt-0.5">Australia</p>
                  </div>
                </div>

                {/* 2. Camellia Japonica */}
                <div className="flex items-center gap-4 py-4 md:py-6 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 3 2" className="w-12 h-8 border border-stone-200 shadow-sm rounded-sm bg-white shrink-0">
                      <rect width="3" height="2" fill="white" />
                      <circle cx="1.5" cy="1" r="0.6" fill="#BC002D" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[#5B2A8C] font-medium text-sm sm:text-base tracking-tight leading-snug">
                      Camellia Japonica Flower Extract
                    </h3>
                    <p className="text-stone-500 text-xs sm:text-sm mt-0.5">Japan</p>
                  </div>
                </div>

                {/* 3. Ceramide NP */}
                <div className="flex items-center gap-4 py-4 md:py-6 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 3 2" className="w-12 h-8 border border-stone-200 shadow-sm rounded-sm bg-white shrink-0">
                      <rect width="3" height="2" fill="white" />
                      {/* Taegeuk: angled at ~33.69 degrees */}
                      <g transform="translate(1.5, 1.0) rotate(-33.7)">
                        <path d="M -0.5 0 A 0.5 0.5 0 0 0 0.5 0" fill="#0F4C81" />
                        <path d="M -0.5 0 A 0.5 0.5 0 0 1 0.5 0" fill="#CD1C3C" />
                        <circle cx="-0.25" cy="0" r="0.25" fill="#CD1C3C" />
                        <circle cx="0.25" cy="0" r="0.25" fill="#0F4C81" />
                      </g>
                      {/* Trigrams */}
                      <g transform="translate(1.5, 1.0) rotate(-33.7)">
                        <g transform="translate(-0.8, -0.53) rotate(90)">
                          <line x1="-0.15" y1="-0.08" x2="0.15" y2="-0.08" stroke="black" strokeWidth="0.025" />
                          <line x1="-0.15" y1="0" x2="0.15" y2="0" stroke="black" strokeWidth="0.025" />
                          <line x1="-0.15" y1="0.08" x2="0.15" y2="0.08" stroke="black" strokeWidth="0.025" />
                        </g>
                        <g transform="translate(0.8, 0.53) rotate(90)">
                          <line x1="-0.15" y1="-0.08" x2="-0.02" y2="-0.08" stroke="black" strokeWidth="0.025" />
                          <line x1="0.02" y1="-0.08" x2="0.15" y2="-0.08" stroke="black" strokeWidth="0.025" />
                          <line x1="-0.15" y1="0" x2="-0.02" y2="0" stroke="black" strokeWidth="0.025" />
                          <line x1="0.02" y1="0" x2="0.15" y2="0" stroke="black" strokeWidth="0.025" />
                          <line x1="-0.15" y1="0.08" x2="-0.02" y2="0.08" stroke="black" strokeWidth="0.025" />
                          <line x1="0.02" y1="0.08" x2="0.15" y2="0.08" stroke="black" strokeWidth="0.025" />
                        </g>
                        <g transform="translate(-0.8, 0.53) rotate(90)">
                          <line x1="-0.15" y1="-0.08" x2="0.15" y2="-0.08" stroke="black" strokeWidth="0.025" />
                          <line x1="-0.15" y1="0" x2="-0.02" y2="0" stroke="black" strokeWidth="0.025" />
                          <line x1="0.02" y1="0" x2="0.15" y2="0" stroke="black" strokeWidth="0.025" />
                          <line x1="-0.15" y1="0.08" x2="0.15" y2="0.08" stroke="black" strokeWidth="0.025" />
                        </g>
                        <g transform="translate(0.8, -0.53) rotate(90)">
                          <line x1="-0.15" y1="-0.08" x2="-0.02" y2="-0.08" stroke="black" strokeWidth="0.025" />
                          <line x1="0.02" y1="-0.08" x2="0.15" y2="-0.08" stroke="black" strokeWidth="0.025" />
                          <line x1="-0.15" y1="0" x2="0.15" y2="0" stroke="black" strokeWidth="0.025" />
                          <line x1="-0.15" y1="0.08" x2="-0.02" y2="0.08" stroke="black" strokeWidth="0.025" />
                          <line x1="0.02" y1="0.08" x2="0.15" y2="0.08" stroke="black" strokeWidth="0.025" />
                        </g>
                      </g>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[#5B2A8C] font-medium text-sm sm:text-base tracking-tight leading-snug">
                      Ceramide NP
                    </h3>
                    <p className="text-stone-500 text-xs sm:text-sm mt-0.5">Korea</p>
                  </div>
                </div>
              </div>
            </div>
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
                    prefetch={false}
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

          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide px-2 snap-x">
            {[
              {
                name: "Arun Singh",
                location: "Chandigarh",
                comment: "I think Skinimage is really bringing a new kind of innovation to India. The formulations are scientifically backed and my parents absolutely love the barrier repair products! The experience is super premium, ultra smooth, and extremely useful for their dry skin concerns.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
              },
              {
                name: "Basil Matthew",
                location: "Kerala",
                comment: "My entire family has been super into skincare products since a long time, but never have we ever seen such fast results with ZERO side effects. I feel like my skin is healthier now, I think I'm going to replace my entire skincare routine with Skinimage's science-backed products.",
                image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150"
              },
              {
                name: "Priya Sharma",
                location: "Delhi",
                comment: "Finding the right skincare in India is so hard with the climate, but Skinimage has been a game-changer. The personalized recommendation and pure ingredients cleared my persistent acne in just 3 weeks!",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
              }
            ].map((review, idx) => (
              <div key={idx} className="flex flex-row items-start gap-5 p-6 rounded-[20px] bg-white border-2 border-[#4C1D95]/85 shadow-sm w-[85vw] sm:w-[450px] shrink-0 snap-center">
                {/* Profile Initials Avatar with dotted decorative shadow */}
                <div className="relative shrink-0 mt-1">
                  <div className="absolute -bottom-2 -left-2 w-16 h-16 opacity-35" style={{ backgroundImage: 'radial-gradient(#4C1D95 2px, transparent 2px)', backgroundSize: '5px 5px' }} />
                  <div className="relative z-10 w-16 h-16 rounded-xl flex items-center justify-center bg-[#E8DFF4] text-[#5B2A8C] font-semibold text-lg border border-purple-100 shadow-sm">
                    {review.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
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


      {/* FAQ CTA Section */}
      <section className="py-20 bg-stone-50 border-t border-stone-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-serif text-3xl font-bold text-stone-900 font-fraunces">Have Questions? We Have Answers</h2>
          <p className="text-sm text-stone-600 max-w-xl mx-auto font-sans leading-relaxed">
            Read our dedicated FAQ page to learn about skin suitability, shipping times, return policies, and how to maximize your results.
          </p>
          <div className="pt-2">
            <Link 
              href="/faq" 
              prefetch={false}
              className="inline-block bg-[#5B2A8C] hover:bg-[#5B2A8C]/95 text-white font-semibold font-sans px-8 py-3.5 rounded-full transition-all duration-300 shadow-md text-sm uppercase tracking-wider"
            >
              View Full FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
