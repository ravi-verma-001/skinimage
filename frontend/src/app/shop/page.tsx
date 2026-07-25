import type { Metadata } from 'next';
import ShopClient from './ShopClient';

export const metadata: Metadata = {
  title: "Shop Dermatologist Tested Active Skincare Formulations | Skinimage",
  description: "Browse our luxury collection of active serums, oil cleansers, broad spectrum sunscreens, and hydrating toners. Free from added fragrances, optimized for skin health.",
  keywords: ["skincare shop", "buy skincare", "serums online", "sunscreens online", "organic cleansers", "dermatologist skincare"],
  openGraph: {
    title: "Shop Dermatologist Tested Active Skincare Formulations | Skinimage",
    description: "Browse our luxury collection of active serums, oil cleansers, broad spectrum sunscreens, and hydrating toners.",
    type: "website",
  }
};

export default function ShopPage() {
  return <ShopClient />;
}
