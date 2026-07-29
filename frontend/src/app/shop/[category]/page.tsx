import React from 'react';
import type { Metadata } from 'next';
import ShopClient from '../ShopClient';
import { API_URL } from '@/config';

const CATEGORY_MAP: Record<string, string> = {
  cleanser: 'Cleanser',
  serum: 'Serum',
  moisturizer: 'Moisturizer',
  sunscreen: 'Sunscreen',
  toner: 'Toner',
  oil: 'Oil',
};

interface PageProps {
  params: Promise<{ category: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((category) => ({
    category,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryKey = resolvedParams.category.toLowerCase();
  const displayName = CATEGORY_MAP[categoryKey] || resolvedParams.category;

  const title = `Shop Dermatologist Tested Active ${displayName}s | Skinimage`;
  const description = `Browse our luxury collection of active ${displayName.toLowerCase()}s. Free from added fragrances, optimized for skin health.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    alternates: {
      canonical: `https://skinimage.in/shop/${categoryKey}/`,
    }
  };
}

import { FALLBACK_PRODUCTS } from '@/fallbackProducts';

export default async function CategoryShopPage({ params }: PageProps) {
  const resolvedParams = await params;
  const categoryKey = resolvedParams.category.toLowerCase();
  const displayName = CATEGORY_MAP[categoryKey] || resolvedParams.category;

  let initialProducts = [];
  try {
    const res = await fetch(`${API_URL}/products?category=${displayName}`, { next: { revalidate: 60 } });
    if (res.ok) {
      initialProducts = await res.json();
    }
  } catch (error) {
    console.warn(`Failed to fetch category ${displayName} products on server:`, error);
  }

  if (!initialProducts || initialProducts.length === 0) {
    initialProducts = FALLBACK_PRODUCTS.filter(
      (p) => p.category.toLowerCase() === categoryKey
    );
  }

  return (
    <ShopClient 
      initialProducts={initialProducts} 
      initialCategory={displayName} 
    />
  );
}
