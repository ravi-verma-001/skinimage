'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AboutUsClient() {
  const [stamped, setStamped] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStamped(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (


      <div className="font-inter bg-white text-[#14121A] min-h-screen selection:bg-[#E8DFF4]">
        
        {/* Section 1: Hero (Full White Section) */}
        <section className="relative py-28 sm:py-36 bg-white overflow-hidden flex items-center border-b border-[#E8DFF4]/60">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#5B2A8C_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: H1 with ONE word in amethyst */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 border border-[#5B2A8C]/30 bg-[#F9F8FB] px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-[#5B2A8C] uppercase">
                  <span>CLINICAL DOSAGE REPORT</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5B2A8C]"></span>
                  <span>ACTIVE STANDARD</span>
                </div>
                <h1 className="font-fraunces text-4xl sm:text-5xl lg:text-6.5xl font-light tracking-tight leading-[1.1] text-[#14121A]">
                  A Dermatologist-Recommended Skincare Brand Built on <span className="text-[#5B2A8C] font-normal italic">Science</span>
                </h1>
                <p className="text-[#14121A]/80 text-base sm:text-lg leading-relaxed max-w-xl font-light font-sans">
                  Skinimage is founded on a clinical philosophy: real results require real science, not wellness platitudes. We design transparent, dermatologist-guided formulations tailored specifically to the environmental dynamics of the Indian climate.
                </p>
              </div>

              {/* Right Column: Floating Ingredient Labels Collage (Instead of stock photo) */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end relative min-h-[300px] sm:min-h-[360px] w-full">
                <div className="relative w-full max-w-md h-full flex flex-col justify-center gap-4">
                  
                  {/* Label 1: Niacinamide */}
                  <div className={`stamp-reveal ${stamped ? 'stamp-active' : ''} p-5 bg-[#F9F8FB] border border-[#5B2A8C]/30 rounded-xl shadow-sm font-mono text-xs tracking-wider text-[#14121A] space-y-3 w-4/5 self-start`}>
                    <div className="flex justify-between items-center text-[10px] text-[#5B2A8C]">
                      <span>FORMULA REF: SI-105</span>
                      <span>POTENCY RATING</span>
                    </div>
                    <div className="border-t border-[#E8DFF4] pt-2.5 flex justify-between items-baseline">
                      <span className="font-sans text-sm font-semibold tracking-normal">NIACINAMIDE</span>
                      <span className="inline-block bg-[#E8DFF4] border border-[#5B2A8C]/40 text-[#5B2A8C] text-xs px-2 py-0.5 rounded-full font-bold">5%</span>
                    </div>
                    <div className="text-[10px] text-[#14121A]/70 leading-relaxed font-sans">
                      Disclosed concentration optimized to stabilize sebum production and strengthen the epidermal barrier in high humidity.
                    </div>
                  </div>

                  {/* Label 2: Vitamin C */}
                  <div className={`stamp-reveal ${stamped ? 'stamp-active' : ''} stamp-delay-1 p-5 bg-[#F9F8FB] border border-[#5B2A8C]/30 rounded-xl shadow-sm font-mono text-xs tracking-wider text-[#14121A] space-y-3 w-4/5 self-end -mt-2`}>
                    <div className="flex justify-between items-center text-[10px] text-[#5B2A8C]">
                      <span>FORMULA REF: SI-208</span>
                      <span>POTENCY RATING</span>
                    </div>
                    <div className="border-t border-[#E8DFF4] pt-2.5 flex justify-between items-baseline">
                      <span className="font-sans text-sm font-semibold tracking-normal">VITAMIN C</span>
                      <span className="inline-block bg-[#E8DFF4] border border-[#5B2A8C]/40 text-[#5B2A8C] text-xs px-2 py-0.5 rounded-full font-bold">10%</span>
                    </div>
                    <div className="text-[10px] text-[#14121A]/70 leading-relaxed font-sans">
                      A highly stable ether derivative of Vitamin C providing potent antioxidant protection under high UV indices.
                    </div>
                  </div>

                  {/* Label 3: Hyaluronic Acid */}
                  <div className={`stamp-reveal ${stamped ? 'stamp-active' : ''} stamp-delay-2 p-3.5 bg-white border border-[#5B2A8C]/25 rounded-full shadow-sm font-mono text-[10px] tracking-widest text-[#5B2A8C] w-3/5 self-center -mt-1 flex justify-between items-center px-4`}>
                    <span>HYALURONIC ACID</span>
                    <span className="inline-block bg-[#E8DFF4] text-[#5B2A8C] text-[9px] px-2 py-0.5 rounded-full font-bold">2%</span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 2: Our Story (Asymmetric Layout on Off-white #F9F8FB) */}
        <section className="py-24 sm:py-32 bg-[#F9F8FB] text-[#14121A]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              
              {/* Left Column: Story Narrative */}
              <div className="lg:col-span-6 space-y-8 pr-0 lg:pr-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 border border-[#5B2A8C]/25 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest text-[#5B2A8C] uppercase bg-white">
                    <span>THE GENESIS</span>
                  </div>
                  <h2 className="font-fraunces text-3xl sm:text-4xl font-light tracking-tight text-[#14121A]">
                    Our Story
                  </h2>
                </div>
                
                <div className="space-y-6 text-[#14121A]/80 text-sm sm:text-base leading-relaxed font-light font-sans">
                  <p>
                    Skinimage began with a simple frustration: Indian skincare shelves were full of products that promised everything and disclosed nothing. Vague "natural extracts," undisclosed actives, and formulas that ignored India's heat, humidity, and pollution left people guessing about what actually worked.
                  </p>
                  <p>
                    We set out to change that by building a <strong className="text-[#14121A] font-medium">dermatologist-recommended skincare brand</strong> where every formula is transparent, clinically grounded, and made specifically for Indian skin and climate conditions.
                  </p>
                  <p>
                    Today, Skinimage products are developed in consultation with dermatologists and formulated around actives like Niacinamide, Vitamin C, Hyaluronic Acid, AHA, and BHA — the same ingredient classes trusted in clinical skincare worldwide, at concentrations we publish openly on every product.
                  </p>
                </div>
              </div>

              {/* Right Column: Pull-Quote in Amethyst */}
              <div className="lg:col-span-6 flex flex-col justify-center bg-white border border-[#E8DFF4] p-8 sm:p-12 rounded-2xl relative shadow-sm">
                <span className="absolute -top-6 left-8 font-fraunces text-7xl text-[#5B2A8C]/15 select-none">“</span>
                <blockquote className="font-fraunces text-xl sm:text-2.5xl font-light leading-relaxed text-[#5B2A8C] relative z-10">
                  We set out to change that by building a dermatologist-recommended skincare brand where every formula is transparent, clinically grounded, and made specifically for Indian skin and climate conditions.
                </blockquote>
                <div className="mt-8 pt-6 border-t border-[#E8DFF4] flex items-center justify-between">
                  <div className="font-mono text-[10px] tracking-wider text-[#14121A]/60">
                    FOUNDING PRINCIPLE / REF: SI-01
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-[#E8DFF4] px-2 py-0.5 rounded-full text-[9px] font-mono tracking-widest text-[#5B2A8C] uppercase font-bold">
                    <span>ESSENTIAL</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 3: Why We're Science-Backed (Staggered Grid of White Cards with Thin Amethyst Border) */}
        <section className="py-24 sm:py-32 bg-white border-b border-[#E8DFF4]/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 border border-[#5B2A8C]/25 bg-[#F9F8FB] px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest text-[#5B2A8C] uppercase">
                <span>FORMULATION PROTOCOLS</span>
              </div>
              <h2 className="font-fraunces text-3xl sm:text-4xl font-light tracking-tight text-[#14121A]">
                Why We're a Science-Backed Skincare Brand in India
              </h2>
              <p className="text-[#14121A]/70 text-sm sm:text-base max-w-xl font-light font-sans">
                Being a genuine science-backed skincare brand in India means more than using active-sounding ingredient names. It means adhering to rigorous laboratory standards.
              </p>
            </div>

            {/* Staggered Grid of White Cards with Lilac active-ingredient callouts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Card 1 */}
              <div className="p-8 border border-[#5B2A8C]/20 rounded-2xl bg-white space-y-6 flex flex-col justify-between shadow-sm">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] text-[#5B2A8C] tracking-widest uppercase">PROTOCOL REF: LAB-01</span>
                    <span className="inline-block bg-[#E8DFF4] text-[#5B2A8C] text-[9px] px-2.5 py-0.5 rounded-full font-mono font-bold">DISCLOSED ACIDS</span>
                  </div>
                  <h3 className="font-fraunces text-xl font-normal text-[#14121A]">Transparent formulation</h3>
                  <p className="text-[#14121A]/75 text-xs sm:text-sm leading-relaxed font-light font-sans">
                    Every active ingredient and its exact concentration is disclosed transparently on the label. We eliminate mystery fillers and proprietary blends in favor of chemical honesty.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E8DFF4] font-mono text-[9px] tracking-wider text-[#14121A]/50 flex justify-between">
                  <span>DISCLOSURE LEVEL: 100%</span>
                  <span>SYSTEM: TRUE LEVEL</span>
                </div>
              </div>

              {/* Card 2 (Staggered offset) */}
              <div className="p-8 border border-[#5B2A8C]/20 rounded-2xl bg-white space-y-6 flex flex-col justify-between shadow-sm md:translate-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] text-[#5B2A8C] tracking-widest uppercase">PROTOCOL REF: LAB-02</span>
                    <span className="inline-block bg-[#E8DFF4] text-[#5B2A8C] text-[9px] px-2.5 py-0.5 rounded-full font-mono font-bold">PEER REVIEWED</span>
                  </div>
                  <h3 className="font-fraunces text-xl font-normal text-[#14121A]">Dermatologist-guided development</h3>
                  <p className="text-[#14121A]/75 text-xs sm:text-sm leading-relaxed font-light font-sans">
                    Formulas undergo peer review with active dermatologists before launch. This continuous medical consultation is the foundation of our clinical credibility.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E8DFF4] font-mono text-[9px] tracking-wider text-[#14121A]/50 flex justify-between">
                  <span>VALIDATION: MEDICAL</span>
                  <span>STAGE: 03 COMPLETED</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-8 border border-[#5B2A8C]/20 rounded-2xl bg-white space-y-6 flex flex-col justify-between shadow-sm">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] text-[#5B2A8C] tracking-widest uppercase">PROTOCOL REF: LAB-03</span>
                    <span className="inline-block bg-[#E8DFF4] text-[#5B2A8C] text-[9px] px-2.5 py-0.5 rounded-full font-mono font-bold">CLIMATE LABS</span>
                  </div>
                  <h3 className="font-fraunces text-xl font-normal text-[#14121A]">Climate-appropriate formulation</h3>
                  <p className="text-[#14121A]/75 text-xs sm:text-sm leading-relaxed font-light font-sans">
                    Viscosity, UV resistance, and skin barrier support are calibrated specifically for Indian humidity, extreme UV levels, and urban dust patterns.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E8DFF4] font-mono text-[9px] tracking-wider text-[#14121A]/50 flex justify-between">
                  <span>ATMOSPHERE: HUMID/HIGH-UV</span>
                  <span>STABILITY TEST: PASS</span>
                </div>
              </div>

              {/* Card 4 (Staggered offset) */}
              <div className="p-8 border border-[#5B2A8C]/20 rounded-2xl bg-white space-y-6 flex flex-col justify-between shadow-sm md:translate-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] text-[#5B2A8C] tracking-widest uppercase">PROTOCOL REF: LAB-04</span>
                    <span className="inline-block bg-[#E8DFF4] text-[#5B2A8C] text-[9px] px-2.5 py-0.5 rounded-full font-mono font-bold">SENSITIVE LABS</span>
                  </div>
                  <h3 className="font-fraunces text-xl font-normal text-[#14121A]">Safety-first actives</h3>
                  <p className="text-[#14121A]/75 text-xs sm:text-sm leading-relaxed font-light font-sans">
                    We pair high-potency actives with clinical botanical buffers to minimize epidermal sensitization, providing high performance without causing irritation.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E8DFF4] font-mono text-[9px] tracking-wider text-[#14121A]/50 flex justify-between">
                  <span>TOLERANCE: COMPROMISED</span>
                  <span>BUFFER: NATURAL</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 4: What Sets Us Apart (2x2 Card Grid on White, Hover-Lift, Amethyst Border appears on hover) */}
        <section className="py-28 sm:py-36 bg-white text-[#14121A] relative z-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto mb-20">
              <div className="inline-flex items-center gap-2 border border-[#5B2A8C]/25 bg-[#F9F8FB] px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest text-[#5B2A8C] uppercase">
                <span>DIFFERENTIATORS</span>
              </div>
              <h2 className="font-fraunces text-3xl sm:text-4xl font-light tracking-tight text-[#14121A]">
                What Sets Skinimage Apart
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              
              {/* Item 1 */}
              <div className="bg-[#F9F8FB] p-8 rounded-2xl border border-transparent hover:border-[#5B2A8C] hover:-translate-y-1 transition-all duration-300 ease-out group space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="font-fraunces text-lg font-light text-[#14121A] group-hover:text-[#5B2A8C] transition-colors">Clinically Inspired Formulas</span>
                  <div className="inline-flex items-center gap-1 bg-[#E8DFF4] px-2 py-0.5 rounded-full text-[9px] font-mono text-[#5B2A8C] font-semibold">
                    <span>CLINICAL</span>
                  </div>
                </div>
                <p className="text-[#14121A]/70 text-xs sm:text-sm leading-relaxed font-light font-sans">
                  Every product is built around actives with published clinical evidence behind them. We rely on verified scientific journals, not marketing claims.
                </p>
              </div>

              {/* Item 2 */}
              <div className="bg-[#F9F8FB] p-8 rounded-2xl border border-transparent hover:border-[#5B2A8C] hover:-translate-y-1 transition-all duration-300 ease-out group space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="font-fraunces text-lg font-light text-[#14121A] group-hover:text-[#5B2A8C] transition-colors">Full Ingredient Transparency</span>
                  <div className="inline-flex items-center gap-1 bg-[#E8DFF4] px-2 py-0.5 rounded-full text-[9px] font-mono text-[#5B2A8C] font-semibold">
                    <span>100% DISCLOSED</span>
                  </div>
                </div>
                <p className="text-[#14121A]/70 text-xs sm:text-sm leading-relaxed font-light font-sans">
                  We disclose exact active concentrations — no mystery percentages, no vague claims. You know exactly what percentage reaches your skin barrier.
                </p>
              </div>

              {/* Item 3 */}
              <div className="bg-[#F9F8FB] p-8 rounded-2xl border border-transparent hover:border-[#5B2A8C] hover:-translate-y-1 transition-all duration-300 ease-out group space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="font-fraunces text-lg font-light text-[#14121A] group-hover:text-[#5B2A8C] transition-colors">AI-Powered Personalization</span>
                  <div className="inline-flex items-center gap-1 bg-[#E8DFF4] px-2 py-0.5 rounded-full text-[9px] font-mono text-[#5B2A8C] font-semibold">
                    <span>AI ANALYZER</span>
                  </div>
                </div>
                <p className="text-[#14121A]/70 text-xs sm:text-sm leading-relaxed font-light font-sans">
                  Our Skin Analyzer uses advanced computer vision to analyze dermal markers and align your skin metrics with the ideal active concentrations.
                </p>
              </div>

              {/* Item 4 */}
              <div className="bg-[#F9F8FB] p-8 rounded-2xl border border-transparent hover:border-[#5B2A8C] hover:-translate-y-1 transition-all duration-300 ease-out group space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="font-fraunces text-lg font-light text-[#14121A] group-hover:text-[#5B2A8C] transition-colors">Made for Indian Skin</span>
                  <div className="inline-flex items-center gap-1 bg-[#E8DFF4] px-2 py-0.5 rounded-full text-[9px] font-mono text-[#5B2A8C] font-semibold">
                    <span>REGIONAL</span>
                  </div>
                </div>
                <p className="text-[#14121A]/70 text-xs sm:text-sm leading-relaxed font-light font-sans">
                  Formulated and stability-tested in regional conditions to handle high humidity, extreme UV indexes, and environmental pollution without clogged pores.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Section 5: Our Promise + CTA (White Section, Amethyst CTA Button) */}
        <section className="bg-[#F9F8FB] text-[#14121A] py-24 sm:py-32 relative overflow-hidden border-t border-[#E8DFF4]/60">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#5B2A8C_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
            <div className="inline-flex items-center gap-2 border border-[#5B2A8C]/25 bg-white px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-[#5B2A8C] uppercase">
              <span>FINAL ASSURANCE</span>
            </div>
            
            <h2 className="font-fraunces text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#14121A] leading-tight">
              Our Promise to You
            </h2>
            
            <p className="text-[#14121A]/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-light font-sans">
              As a <strong className="text-[#14121A] font-medium">dermatologist-recommended skincare brand</strong>, we hold ourselves to a simple standard: if it isn't backed by clinical evidence, it doesn't go in the bottle. Whether you're treating acne, pigmentation, or texture, Skinimage exists to give you a <strong className="text-[#14121A] font-medium">science-backed skincare brand in India</strong> you can actually trust — one honest formulation at a time.
            </p>
            
            <div className="pt-6">
              <Link 
                href="/shop" 
                prefetch={false}
                className="inline-block bg-[#5B2A8C] hover:bg-[#5B2A8C]/95 text-white font-semibold font-sans px-8 py-3.5 rounded-full transition-all duration-300 shadow-md text-sm uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#F9F8FB] focus:ring-[#5B2A8C]"
              >
                Explore Our Collection →
              </Link>
            </div>
          </div>
        </section>

      </div>
  );
}
