import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Our Story | Premium Science-Backed Luxury Skincare | Skinimage",
  description: "Learn about the philosophy, science, and clinical ingredients behind Skinimage. Discover why dermatologist-recommended active formulations are key to healthy, glowing skin.",
  keywords: ["about us", "skincare science", "brand philosophy", "dermatologist recommended", "clean skincare", "active ingredients"],
  openGraph: {
    title: "Our Story | Skinimage Skincare",
    description: "Learn about the philosophy, science, and clinical ingredients behind Skinimage.",
    type: "website",
  }
};

export default function OurStoryPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner Section */}
      <section className="relative py-24 bg-stone-100 overflow-hidden border-b border-stone-200/50">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero_banner.png" 
            alt="Skinimage luxury skincare" 
            className="w-full h-full object-cover opacity-15 filter blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-50 via-stone-50/90 to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl space-y-4">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-800">
              Our Journey
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl font-normal text-stone-900 tracking-tight leading-tight">
              Our Story & <br />
              <span className="italic font-light text-emerald-800">Philosophy.</span>
            </h1>
            <p className="text-stone-500 text-sm sm:text-base leading-relaxed max-w-lg">
              We started with a simple vision: to eliminate the guesswork from skincare. By merging clinical science with clean, active botanicals, we craft products that deliver maximum results with minimum irritation.
            </p>
          </div>
        </div>
      </section>

      {/* Main Philosophy Section (reused from HomeClient.tsx for consistency but polished) */}
      <section className="pt-20 pb-24 bg-gradient-to-b from-white to-stone-50/40 overflow-hidden relative">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-emerald-50/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-stone-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Left: Image with floating effect */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="absolute -inset-2 sm:-inset-4 rounded-3xl border border-stone-250/20 pointer-events-none scale-98" />
              
              <div className="relative aspect-[4/5] w-full max-w-[480px] overflow-hidden rounded-2xl bg-stone-100 border border-stone-200/40 shadow-xl transition-all duration-700 hover:shadow-2xl hover:-translate-y-1 group">
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

              {/* Feature Highlights */}
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

              {/* Dermatologist Recommended */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex items-center gap-3 bg-stone-150/50 p-2.5 pr-4 rounded-xl border border-stone-200/40">
                  <img 
                    src="/doctorlogo.jpeg" 
                    alt="Dr Recommended Formulation" 
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

      {/* Brand Values / Extra details */}
      <section className="bg-stone-50 py-20 border-t border-stone-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h3 className="font-serif text-3.5xl text-stone-900">Our Core Principles</h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              We operate at the intersection of nature and dermatology to provide honest skincare that values skin integrity above all else.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white border border-stone-200/50 rounded-2xl space-y-3">
              <span className="text-emerald-700 text-xl font-serif">01. Transparency</span>
              <p className="text-stone-500 text-xs leading-relaxed">
                We disclose the exact concentration of active ingredients in all our formulations. No mystery fillers, just functional skincare.
              </p>
            </div>
            <div className="p-6 bg-white border border-stone-200/50 rounded-2xl space-y-3">
              <span className="text-emerald-700 text-xl font-serif">02. Safety First</span>
              <p className="text-stone-500 text-xs leading-relaxed">
                All skin types deserve care. We strictly avoid ingredients known to cause sensitization, matching efficacy with high tolerance.
              </p>
            </div>
            <div className="p-6 bg-white border border-stone-200/50 rounded-2xl space-y-3">
              <span className="text-emerald-700 text-xl font-serif">03. Botanical Power</span>
              <p className="text-stone-500 text-xs leading-relaxed">
                We boost clinical actives with bio-active botanicals (like Centella Asiatica, Aloe Vera, and Green Tea) to soothe and support skin health.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
