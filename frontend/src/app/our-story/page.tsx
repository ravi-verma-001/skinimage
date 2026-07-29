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

      {/* Brand Backstory & Mission Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-6">
            <h2 className="font-serif text-3.5xl sm:text-4.5xl font-normal text-stone-900 tracking-tight leading-tight">
              The Genesis of <span className="italic font-light text-emerald-800">Skinimage</span>
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Skinimage was founded out of a shared frustration with the clutter, misinformation, and exaggerated claims dominating the modern Indian beauty space. Skincare has become overwhelmingly complicated, with marketing campaigns pushing multi-step routines that sensitize the skin barrier rather than heal it. We saw a growing community of skincare enthusiasts who were tired of guessing and wanted straightforward, dermatologically sound formulations that deliver on their promises.
            </p>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Our mission is simple: to restore skin health through clinical honesty. We believe that premium, high-efficacy skincare should not be built on mystery, but on verified science. By formulating with clean, clinically-proven actives at precise, functional percentages and pairing them with nourishing botanicals, we craft targeted solutions designed to protect, restore, and elevate your skin.
            </p>
          </div>

          <div className="border-t border-stone-200/60 pt-10 space-y-6">
            <h2 className="font-serif text-3.5xl sm:text-4.5xl font-normal text-stone-900 tracking-tight leading-tight">
              Solving for the <span className="italic font-light text-emerald-800">Indian Climate & Skin Concerns</span>
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Skincare is not one-size-fits-all. The Indian sub-continent experiences extreme environmental stressors—ranging from intense UV indices and high humidity to severe air pollution. These factors trigger specific skin issues like stubborn hyperpigmentation, excess sebum production, post-inflammatory erythema, and a chronically compromised skin barrier.
            </p>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Many global skincare brands design their products for cooler, less humid climates, resulting in heavy, occlusive creams that clog pores or highly aggressive active percentages that cause irritation under the hot sun. Skinimage solves this by creating water-light, fast-absorbing gel formulations (like our UV-Aurora Sunscreen Gel) that deliver powerful active ingredients without weighing the skin down. We optimize every formula to balance efficacy with maximum skin tolerance, ensuring suitability for even the most sensitive skin types in India.
            </p>
          </div>

          <div className="border-t border-stone-200/60 pt-10 space-y-6">
            <h2 className="font-serif text-3.5xl sm:text-4.5xl font-normal text-stone-900 tracking-tight leading-tight">
              Our Formulation Philosophy: <span className="italic font-light text-emerald-800">Clinical Actives Meet Bio-Botanicals</span>
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              We operate under a dual-formulation framework that bridges the gap between pure clinical actives and soothing natural extracts. We refer to this as the Synergy of Science and Care:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-stone-600 text-sm sm:text-base">
              <li>
                <strong className="text-stone-900 font-semibold">Precision Active Percentages:</strong> We do not use active ingredients for marketing claims. When we formulate with Niacinamide, Vitamin C, PDRN, or Hyaluronic Acid, we use them at their clinically-validated percentages to ensure visible, long-lasting results.
              </li>
              <li>
                <strong className="text-stone-900 font-semibold">The Botanical Buffer:</strong> Actives can sometimes cause initial irritation. To combat this, we enrich every formula with a soothing botanical buffer—such as Centella Asiatica, Licorice Root Extract, and Allantoin. These bio-actives calm redness, hydrate the skin layers, and support the barrier while the clinical actives do their work.
              </li>
              <li>
                <strong className="text-stone-900 font-semibold">Zero Unnecessary Fillers:</strong> Our products are formulated without parabens, phthalates, synthetic dyes, or drying alcohols. Every single ingredient in a Skinimage bottle has a clear purpose for your skin.
              </li>
            </ul>
          </div>

          <div className="border-t border-stone-200/60 pt-10 space-y-6">
            <h2 className="font-serif text-3.5xl sm:text-4.5xl font-normal text-stone-900 tracking-tight leading-tight">
              Meet our <span className="italic font-light text-emerald-800">Scientific Council</span>
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Behind every Skinimage bottle is a dedicated team of cosmetic chemists, dermatologists, and formulation researchers. Led by <strong className="text-stone-900 font-semibold">Dr. Ananya Verma, MD</strong>, our research council oversees every phase of product development—from initial ingredient selection and synergy mapping to consumer testing trials. This ensures that every formulation we release is safe, stable, and highly effective for long-term daily use.
            </p>
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
