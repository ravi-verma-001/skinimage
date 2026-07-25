import React from 'react';
import type { Metadata } from 'next';
import ProductDetailClient from './ProductDetailClient';

const DUMMY_PRODUCTS = [
  { id: "[id]" },
  { id: "p1" },
  { id: "p2" },
  { id: "p3" },
  { id: "p4" },
  { id: "p5" },
  { id: "p6" },
  { id: "p7" },
  { id: "p8" },
  { id: "p9" },
  { id: "6a575efafa1d6bf1696dd740" },
  { id: "6a575efafa1d6bf1696dd741" },
  { id: "6a575efafa1d6bf1696dd742" },
  { id: "6a575efafa1d6bf1696dd743" },
  { id: "6a575efafa1d6bf1696dd744" },
  { id: "6a575efafa1d6bf1696dd745" },
  { id: "6a575efafa1d6bf1696dd746" },
  { id: "6a575efafa1d6bf1696dd747" },
  { id: "6a575efafa1d6bf1696dd748" }
];

const PRODUCT_INFO_MAP: Record<string, { title: string; desc: string }> = {
  p1: {
    title: "Nourishing Cleansing Oil | Deep Makeup Melt & Barrier Care | Skinimage",
    desc: "Cleanse your face with Skinimage Nourishing Cleansing Oil. Enriched with 10+ botanical oils & plant-derived squalane. Melt away makeup & sunscreen instantly."
  },
  p2: {
    title: "AHA & BHA Face Exfoliating Serum | Refines Texture & Glow | Skinimage",
    desc: "Say goodbye to rough skin with Skinimage AHA & BHA Face Serum. Advanced peeling treatment to unclog pores, reduce blemishes, and reveal brighter skin."
  },
  p3: {
    title: "UV-Aurora Sunscreen SPF 50 PA++++ | Light Hydrating Aqua Gel | Skinimage",
    desc: "Protect your skin with Skinimage UV-Aurora Aqua Sunscreen. Ultra-lightweight SPF 50 PA++++ protection with 1% Hyaluronic Acid. Zero white cast."
  },
  p4: {
    title: "Benzotree Face Wash | Acne & Breakout Control Cleanser | Skinimage",
    desc: "Control breakouts with Benzotree Face Wash. Powered by Benzoyl Peroxide & Tea Tree Oil to target acne-causing bacteria and balance excess oil."
  },
  p5: {
    title: "C-Peptide Super Face Serum | Anti-Aging & Barrier Repair | Skinimage",
    desc: "Smooth wrinkles and lines with Skinimage C-Peptide Serum. Advanced multi-peptide complex with copper tripeptides & hyaluronic acid for firm skin."
  },
  p6: {
    title: "PDRN Regenerating DNA Serum | Advanced Cell Repair & Anti-Aging | Skinimage",
    desc: "Rejuvenate your skin with PDRN Regenerating Serum. Advanced DNA repair tech with growth factors and peptides to boost elasticity & recovery."
  },
  p7: {
    title: "Gluta Foaming Facewash | Brightening & Antioxidant Cleanse | Skinimage",
    desc: "Brighten your skin tone with Gluta Foaming Facewash. Enriched with Glutathione, Vitamin C, & Aloe Vera to wash away impurities and reveal a clean glow."
  },
  p8: {
    title: "AHA BHA Clarifying Face Wash | Exfoliating Daily Cleanser | Skinimage",
    desc: "Unclog pores and refine skin daily with AHA BHA Face Wash. Gentle daily exfoliating cleanser that targets acne, bumps, and dead skin cells."
  },
  p9: {
    title: "100% Sugarcane Squalane Facial Oil | Intense Barrier Moisture | Skinimage",
    desc: "Lock in deep hydration with 100% Sugarcane Squalane Facial Oil. Mimics skin's natural lipids to restore barrier health without feeling greasy."
  }
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return DUMMY_PRODUCTS.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const info = PRODUCT_INFO_MAP[resolvedParams.id] || {
    title: "Premium Active Skincare Formulation | Skinimage",
    desc: "Discover dermatologist-formulated skincare solution backed by clinical science and powered by bio-active botanicals."
  };

  return {
    title: info.title,
    description: info.desc,
    openGraph: {
      title: info.title,
      description: info.desc,
      type: "website",
    }
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <ProductDetailClient id={resolvedParams.id} />;
}
