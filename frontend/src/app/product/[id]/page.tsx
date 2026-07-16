import React from 'react';
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

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return DUMMY_PRODUCTS.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <ProductDetailClient id={resolvedParams.id} />;
}
