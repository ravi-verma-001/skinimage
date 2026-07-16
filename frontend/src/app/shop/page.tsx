'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductCard, ProductType } from '@/components/ProductCard';
import { SlidersHorizontal, Search, RefreshCw, X } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const DUMMY_PRODUCTS: ProductType[] = [
  {
    _id: "p1",
    sku: "SK-HYDRA-FW",
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
    isBestSeller: true,
    isNewArrival: false
  },
  {
    _id: "p2",
    sku: "SK-VITC-GLOW",
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
    isBestSeller: false,
    isNewArrival: true
  },
  {
    _id: "p3",
    sku: "SK-NIACIN-MOIST",
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
    isBestSeller: true,
    isNewArrival: false
  },
  {
    _id: "p4",
    sku: "SK-RETINOL-NIGHT",
    name: "0.3% Retinol Wrinkle Repair Night Cream",
    category: "Serum",
    price: 42.00,
    discountPrice: 35.99,
    stock: 45,
    images: ["https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=600"],
    description: "An advanced night-time treatment designed to accelerate cellular turnover, reduce fine lines, wrinkles, and boost firmness.",
    rating: 4.6,
    reviewsCount: 88,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true
  },
  {
    _id: "p5",
    sku: "SK-SALICYLIC-TNR",
    name: "2% BHA Salicylic Acid Exfoliating Toner",
    category: "Toner",
    price: 22.00,
    discountPrice: 18.00,
    stock: 90,
    images: ["https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600"],
    description: "A gentle leave-on liquid exfoliant that unclogs pores, targets blackheads, and controls breakouts.",
    rating: 4.8,
    reviewsCount: 167,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false
  },
  {
    _id: "p6",
    sku: "SK-HYALURONIC-PLUMP",
    name: "Triple Hyaluronic Acid + B5 Plumping Serum",
    category: "Serum",
    price: 26.00,
    discountPrice: 21.99,
    stock: 110,
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600"],
    description: "A supercharged hydrating serum utilizing three distinct molecular weights of Hyaluronic Acid.",
    rating: 4.9,
    reviewsCount: 189,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false
  },
  {
    _id: "p7",
    sku: "SK-CENTELLA-SOOTH",
    name: "Centella Soothing Recovery Gel",
    category: "Moisturizer",
    price: 25.00,
    discountPrice: 20.00,
    stock: 75,
    images: ["https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600"],
    description: "An instant cooling, calming gel cream designed for highly sensitive, irritated, or compromised skin.",
    rating: 4.7,
    reviewsCount: 64,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true
  },
  {
    _id: "p8",
    sku: "SK-SPF50-SUN",
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
    isBestSeller: true,
    isNewArrival: false
  },
  {
    _id: "p9",
    sku: "SK-SQUALANE-OIL",
    name: "100% Sugarcane Squalane Facial Oil",
    category: "Oil",
    price: 32.00,
    discountPrice: 27.50,
    stock: 60,
    images: ["https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=600"],
    description: "A pure, sustainably-sourced squalane oil that mimics skin's natural lipids to lock in intense moisture.",
    rating: 4.9,
    reviewsCount: 118,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false
  }
];

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  // Read filter values from URL search parameters
  const activeCategory = searchParams.get('category') || '';
  const activeSkinType = searchParams.get('skinType') || '';
  const searchQuery = searchParams.get('search') || '';
  const activeSort = searchParams.get('sort') || '';

  const categories = ['Cleanser', 'Serum', 'Moisturizer', 'Sunscreen', 'Toner', 'Oil'];
  const skinTypes = ['Dry', 'Oily', 'Sensitive', 'Combination', 'Normal'];

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (activeCategory) queryParams.append('category', activeCategory);
        if (activeSkinType) queryParams.append('skinType', activeSkinType);
        if (searchQuery) queryParams.append('search', searchQuery);
        if (activeSort) queryParams.append('sortPrice', activeSort);

        const res = await fetch(`${API_URL}/products?${queryParams.toString()}`);
        if (!res.ok) throw new Error('API request failed');
        const data = await res.json();
        setProducts(data.length > 0 ? data : getFilteredFallback());
      } catch (err) {
        console.warn('API error, using local fallback filtration logic.', err);
        setProducts(getFilteredFallback());
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [activeCategory, activeSkinType, searchQuery, activeSort]);

  // Client-side filtering in case server is not running
  const getFilteredFallback = () => {
    let list = [...DUMMY_PRODUCTS];

    if (activeCategory) {
      list = list.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
    }
    if (activeSkinType) {
      // Mock skin types on fallbacks
      const skinMap: Record<string, string[]> = {
        p1: ['Dry', 'Normal', 'Sensitive', 'Combination', 'Oily'],
        p2: ['Normal', 'Dry', 'Combination', 'Oily'],
        p3: ['Combination', 'Oily', 'Normal', 'Sensitive'],
        p4: ['Normal', 'Dry', 'Combination'],
        p5: ['Oily', 'Combination'],
        p6: ['Dry', 'Normal', 'Combination', 'Sensitive'],
        p7: ['Sensitive', 'Oily', 'Combination'],
        p8: ['Normal', 'Dry', 'Combination', 'Oily', 'Sensitive'],
        p9: ['Dry', 'Sensitive', 'Normal', 'Combination']
      };
      list = list.filter(p => {
        const pId = p._id || p.id || '';
        const types = skinMap[pId] || [];
        return types.some(t => t.toLowerCase() === activeSkinType.toLowerCase());
      });
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    
    // Sorting
    if (activeSort === 'asc') {
      list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (activeSort === 'desc') {
      list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (activeSort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  };

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/shop?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/shop');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">The Formulations</h1>
          <p className="text-stone-500 mt-2 text-sm sm:text-base leading-relaxed">
            Dermatologist tested. Clinical concentrations. Zero added fragrance.
          </p>
        </div>
        <div className="flex items-center space-x-3 self-start md:self-auto">
          <span className="text-xs text-stone-400 font-medium">Sorting</span>
          <select
            value={activeSort}
            onChange={(e) => updateFilters('sort', e.target.value)}
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-800 focus:border-emerald-600 focus:outline-none"
          >
            <option value="">Featured</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="mt-8 lg:grid lg:grid-cols-4 lg:gap-x-8">
        {/* Filters Sidebar */}
        <aside className="space-y-6 lg:block lg:col-span-1 border-r border-stone-200/80 pr-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <span className="text-sm font-semibold tracking-wider uppercase text-stone-800 flex items-center">
              <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
            </span>
            {(activeCategory || activeSkinType || searchQuery) && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-red-600 hover:text-red-800 font-semibold transition flex items-center"
              >
                Clear <X className="h-3.5 w-3.5 ml-0.5" />
              </button>
            )}
          </div>

          {/* Search within shop */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Search</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Find serum, toner..."
                value={searchQuery}
                onChange={(e) => updateFilters('search', e.target.value)}
                className="w-full rounded-md border border-stone-300 bg-white py-1.5 pl-8 pr-3 text-xs text-stone-900 focus:border-emerald-600 focus:outline-none"
              />
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2.5 pt-4">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Category</h3>
            <div className="space-y-1.5">
              <button
                onClick={() => updateFilters('category', '')}
                className={`w-full text-left text-xs py-1.5 px-2.5 rounded transition ${
                  !activeCategory ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => updateFilters('category', cat)}
                  className={`w-full text-left text-xs py-1.5 px-2.5 rounded transition ${
                    activeCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {cat}s
                </button>
              ))}
            </div>
          </div>

          {/* Skin Type Filter */}
          <div className="space-y-2.5 pt-4 border-t border-stone-200">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Skin Concern / Type</h3>
            <div className="space-y-1.5">
              <button
                onClick={() => updateFilters('skinType', '')}
                className={`w-full text-left text-xs py-1.5 px-2.5 rounded transition ${
                  !activeSkinType ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                All Skin Types
              </button>
              {skinTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => updateFilters('skinType', type)}
                  className={`w-full text-left text-xs py-1.5 px-2.5 rounded transition ${
                    activeSkinType.toLowerCase() === type.toLowerCase()
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {type} Skin
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="mt-8 lg:mt-0 lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col space-y-4">
                  <div className="bg-stone-200 aspect-square w-full rounded-lg"></div>
                  <div className="h-4 bg-stone-200 rounded w-1/3"></div>
                  <div className="h-5 bg-stone-200 rounded w-3/4"></div>
                  <div className="h-4 bg-stone-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-stone-200 rounded-lg bg-stone-50">
              <p className="text-sm text-stone-500 font-medium">No formulations found matching the selected filters.</p>
              <button
                onClick={clearAllFilters}
                className="mt-4 inline-flex items-center rounded-md bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800 transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs text-stone-400 font-medium mb-4">Showing {products.length} formulations</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={
      <div className="flex h-96 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-emerald-700" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
