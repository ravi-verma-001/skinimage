import type { Metadata } from 'next';
import ShopClient from './ShopClient';
import { API_URL } from '@/config';
import { FALLBACK_PRODUCTS } from '@/fallbackProducts';

export const metadata: Metadata = {
  title: "Shop Dermatologist Tested Active Skincare Formulations | Skinimage",
  description: "Browse our luxury collection of active serums, oil cleansers, broad spectrum sunscreens, and hydrating toners. Free from added fragrances, optimized for skin health.",
  keywords: ["skincare shop", "buy skincare", "serums online", "sunscreens online", "organic cleansers", "dermatologist skincare"],
  openGraph: {
    title: "Shop Dermatologist Tested Active Skincare Formulations | Skinimage",
    description: "Browse our luxury collection of active serums, oil cleansers, broad spectrum sunscreens, and hydrating toners.",
    type: "website",
  },
  alternates: {
    canonical: "https://skinimage.in/shop/",
  }
};

export default async function ShopPage() {
  let initialProducts = [];
  try {
    const res = await fetch(`${API_URL}/products`, { next: { revalidate: 60 } });
    if (res.ok) {
      initialProducts = await res.json();
    }
  } catch (error) {
    console.warn("Failed to fetch products on server:", error);
  }

  if (!initialProducts || initialProducts.length === 0) {
    initialProducts = FALLBACK_PRODUCTS;
  }

  return <ShopClient initialProducts={initialProducts} />;
}

