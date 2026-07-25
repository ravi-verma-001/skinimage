import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: "Premium Science-Backed Luxury Skincare | Skinimage",
  description: "Dermatologist-formulated skincare solutions enriched with active ingredients to target acne, pigmentation, & texture. Discover our clean luxury beauty collection.",
  keywords: ["skincare", "serum", "cleanser", "moisturizer", "luxury skincare", "clean beauty", "acne care", "brightening serum"],
  openGraph: {
    title: "Premium Science-Backed Luxury Skincare | Skinimage",
    description: "Dermatologist-formulated skincare solutions enriched with active ingredients to target acne, pigmentation, & texture.",
    type: "website",
  }
};

export default function Home() {
  return <HomeClient />;
}
