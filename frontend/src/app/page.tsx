'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductCard, ProductType } from '@/components/ProductCard';
import { Sparkles, ArrowRight, ShieldCheck, Award, Heart, CheckCircle2, ChevronDown, RefreshCw, Star } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Fallback dummy products in case API is loading or fails
const FALLBACK_PRODUCTS: ProductType[] = [
  {
    _id: "p1",
    name: "Gentle Centella Hydrating Cleanser",
    category: "Cleanser",
    price: 24.00,
    discountPrice: 19.99,
    stock: 85,
    images: ["/cleanser.png"],
    description: "A pH-balanced foaming cleanser designed to remove impurities, excess sebum, and makeup without stripping the skin barrier.",
    rating: 4.8,
    reviewsCount: 142,
    isFeatured: true,
    isBestSeller: true
  },
  {
    _id: "p2",
    name: "15% Vitamin C Glow Brightening Serum",
    category: "Serum",
    price: 38.00,
    discountPrice: 32.00,
    stock: 50,
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600"],
    description: "A high-potency antioxidant serum formulated with pure L-Ascorbic Acid, Vitamin E, and Ferulic Acid.",
    rating: 4.7,
    reviewsCount: 98,
    isFeatured: true,
    isNewArrival: true
  },
  {
    _id: "p3",
    name: "Niacinamide + Ceramide Barrier Restore Gel Cream",
    category: "Moisturizer",
    price: 28.00,
    discountPrice: 24.50,
    stock: 120,
    images: ["https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=600"],
    description: "An ultra-lightweight gel cream packed with 5% Niacinamide and 3 essential Ceramides.",
    rating: 4.9,
    reviewsCount: 215,
    isFeatured: true,
    isBestSeller: true
  },
  {
    _id: "p8",
    name: "Broad-Spectrum SPF 50 Airy Daily Sunscreen",
    category: "Sunscreen",
    price: 30.00,
    discountPrice: 25.00,
    stock: 150,
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600"],
    description: "A ultra-lightweight, fluid sunscreen that delivers high-performance SPF 50 PA++++ broad-spectrum protection.",
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
    { q: "Are your products suitable for sensitive skin?", a: "Yes, all NextSkin products are formulated with dermatological sensitivity in mind. We use soothing buffers like Centella Asiatica, Panthenol, and Ceramides to support skin health without triggering irritation." },
    { q: "How should I store my Vitamin C Serum?", a: "To maintain maximum potency, store your 15% Vitamin C Serum in a cool, dark place away from direct sunlight (or in a cosmetics fridge). Keep the cap tightly sealed to prevent oxidation." },
    { q: "When will I start seeing results?", a: "Hydration benefits (Hyaluronic Acid & Centella Cleanser) are immediate. Skin texture and pore improvements (BHA & Niacinamide) can be seen within 2-3 weeks, while pigment fading and wrinkle repair (Vitamin C & Retinol) typically require 4-6 weeks of consistent use." },
    { q: "Are NextSkin products cruelty-free?", a: "100%. We never test our formulas or ingredients on animals, and we only partner with cruelty-free suppliers." }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Promotional Ribbon */}
      <div className="bg-emerald-800 text-stone-100 py-2 px-4 text-center text-xs tracking-wider font-semibold uppercase flex items-center justify-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5" /> Use Code <strong className="text-white">WELCOME10</strong> for 10% off your first purchase + Free Shipping over $50
      </div>

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-white">
        <div className="w-full relative">
          <img 
            src="/hero_banner.png" 
            alt="Skin Image Banner" 
            className="w-full h-auto md:h-[75vh] md:max-h-[650px] object-contain md:object-cover object-center block"
          />
          {/* Curved Bottom Divider to match design */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
            <svg 
              viewBox="0 0 1200 120" 
              preserveAspectRatio="none" 
              className="relative block w-full h-[20px] sm:h-[60px] md:h-[100px]"
            >
              <path 
                d="M0,0 C300,90 900,10 1200,80 L1200,120 L0,120 Z" 
                fill="#ffffff"
              ></path>
            </svg>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-emerald-700" />
              <span className="text-xs font-semibold tracking-wider uppercase text-stone-800">Dermatologist Tested</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Award className="h-6 w-6 text-emerald-700" />
              <span className="text-xs font-semibold tracking-wider uppercase text-stone-800">100% Vegan & Cruelty-Free</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Heart className="h-6 w-6 text-emerald-700" />
              <span className="text-xs font-semibold tracking-wider uppercase text-stone-800">For All Skin Types</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-emerald-700" />
              <span className="text-xs font-semibold tracking-wider uppercase text-stone-800">Clean Formulations</span>
            </div>
          </div>
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
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600"
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
                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600"
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
                src="https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=600"
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

      {/* Brand Story Philosophy */}
      <section id="brand-story" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=800"
                alt="Skincare laboratory"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <span className="text-xs font-semibold tracking-widest uppercase text-emerald-800">Our Story</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">Formulated with Intent, Proven by Science</h2>
              <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                We believe that premium skincare shouldn&apos;t be an guessing game. At NextSkin, we strip away all unnecessary fragrances, fillers, and micro-irritants, delivering pure clinical molecules in pH-balanced, soothing bases.
              </p>
              <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                Every launch is formulated in our clean labs using clinically validated actives (Retinol, Vitamin C, Ceramides, BHA) stabilized with bio-compatible botanicals such as Centella Asiatica and Licorice Root. The result? Fast cellular recovery, clean skin barriers, and long-term radiance.
              </p>
              <div className="pt-2">
                <Link href="/shop" className="inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition">
                  Shop Our Philosophy <ArrowRight className="ml-1 h-4 w-4" />
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

      {/* Testimonials */}
      <section className="py-20 bg-stone-50 border-t border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="font-serif text-3xl font-bold text-stone-900">Loved by Skin Enthusiasts</h2>
            <p className="text-stone-500 mt-2 text-sm">Read verified reviews from customers with dry, oily, and sensitive skin.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-white border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic">
                &quot;The Centella Hydrating Cleanser has completely healed my redness. I used to feel tight after washing my face, but now it feels plump and calm.&quot;
              </p>
              <div className="border-t border-stone-100 pt-3 flex justify-between items-center text-xs">
                <span className="font-bold text-stone-900">Sarah M.</span>
                <span className="text-stone-400">Verified Buyer</span>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-white border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic">
                &quot;My dark spots are completely fading after a month of the 15% Vitamin C serum. It absorbs instantly without being sticky. Pure magic!&quot;
              </p>
              <div className="border-t border-stone-100 pt-3 flex justify-between items-center text-xs">
                <span className="font-bold text-stone-900">David K.</span>
                <span className="text-stone-400">Verified Buyer</span>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-white border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic">
                &quot;The 5% Niacinamide Gel Cream keeps my oily T-zone in check while repairing my skin barrier. Super light, perfect under makeup.&quot;
              </p>
              <div className="border-t border-stone-100 pt-3 flex justify-between items-center text-xs">
                <span className="font-bold text-stone-900">Elena R.</span>
                <span className="text-stone-400">Verified Buyer</span>
              </div>
            </div>
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
