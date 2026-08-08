'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ProductCard, ProductType } from '@/components/ProductCard';
import { SlidersHorizontal, Search, RefreshCw, X } from 'lucide-react';

import { API_URL } from '@/config';
import { FALLBACK_PRODUCTS } from '@/fallbackProducts';
import URLQuerySync from '@/components/URLQuerySync';

const DUMMY_PRODUCTS = FALLBACK_PRODUCTS;

interface ShopContentProps {
  initialProducts?: ProductType[];
  initialCategory?: string;
}

export default function ShopClient({ initialProducts = [], initialCategory = '' }: ShopContentProps) {
  const router = useRouter();

  const [products, setProducts] = useState<ProductType[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState(initialCategory || '');
  const [activeSkinType, setActiveSkinType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState('');

  const categories = ['Cleanser', 'Serum', 'Moisturizer', 'Sunscreen', 'Toner', 'Oil'];
  const skinTypes = ['Dry', 'Oily', 'Sensitive', 'Combination', 'Normal'];

  const handleURLSync = React.useCallback(
    (filters: { skinType: string; search: string; sort: string }) => {
      setActiveSkinType(filters.skinType);
      setSearchQuery(filters.search);
      setActiveSort(filters.sort);
    },
    []
  );

  useEffect(() => {
    // If we are on the initial load and no custom filters are active, keep the pre-fetched products
    if (
      initialProducts.length > 0 &&
      !activeSkinType &&
      !searchQuery &&
      !activeSort &&
      activeCategory === initialCategory
    ) {
      setProducts(initialProducts);
      setLoading(false);
      return;
    }

    let isLoaded = false;

    const fallbackTimer = setTimeout(() => {
      if (!isLoaded) {
        console.log("Shop API took too long. Loading fallback products...");
        setProducts(getFilteredFallback());
        setLoading(false);
      }
    }, 3500);

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
        
        isLoaded = true;
        clearTimeout(fallbackTimer);
        setProducts(data.length > 0 ? data : getFilteredFallback());
      } catch (err) {
        console.warn('API error, using local fallback filtration logic.', err);
        if (!isLoaded) {
          setProducts(getFilteredFallback());
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();

    return () => clearTimeout(fallbackTimer);
  }, [activeCategory, activeSkinType, searchQuery, activeSort, initialProducts, initialCategory]);

  const getFilteredFallback = () => {
    let list = [...DUMMY_PRODUCTS];

    if (activeCategory) {
      list = list.filter((p) => p.category && p.category.toLowerCase() === activeCategory.toLowerCase());
    }
    if (activeSkinType) {
      const skinMap: Record<string, string[]> = {
        p1: ['Dry', 'Normal', 'Sensitive', 'Combination', 'Oily'],
        p2: ['Normal', 'Dry', 'Combination', 'Oily'],
        p3: ['Combination', 'Oily', 'Normal', 'Sensitive'],
        p4: ['Normal', 'Dry', 'Combination'],
        p5: ['Oily', 'Combination'],
        p6: ['Dry', 'Normal', 'Combination', 'Sensitive'],
        p7: ['Sensitive', 'Oily', 'Combination'],
        p8: ['Normal', 'Dry', 'Combination', 'Oily', 'Sensitive'],
        p9: ['Dry', 'Sensitive', 'Normal', 'Combination'],
      };
      list = list.filter((p) => {
        const pId = p._id || p.id || '';
        const types = skinMap[pId] || [];
        return types.some((t) => t.toLowerCase() === activeSkinType.toLowerCase());
      });
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

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
    const params = new URLSearchParams();
    if (key !== 'skinType' && activeSkinType) params.set('skinType', activeSkinType);
    if (key !== 'search' && searchQuery) params.set('search', searchQuery);
    if (key !== 'sort' && activeSort) params.set('sort', activeSort);

    if (value) {
      params.set(key, value);
    }

    if (key === 'category') {
      params.delete('category');
      if (value) {
        router.push(`/shop/${value.toLowerCase()}/${params.toString() ? `?${params.toString()}` : ''}`);
      } else {
        router.push(`/shop/${params.toString() ? `?${params.toString()}` : ''}`);
      }
      return;
    }

    if (activeCategory) {
      router.push(`/shop/${activeCategory.toLowerCase()}/${params.toString() ? `?${params.toString()}` : ''}`);
    } else {
      router.push(`/shop?${params.toString()}`);
    }
  };

  const clearAllFilters = () => {
    router.push('/shop');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Tiny sync component inside Suspense so that ShopClient does not bail out */}
      <Suspense fallback={null}>
        <URLQuerySync onSync={handleURLSync} />
      </Suspense>

      {/* Header */}
      <div className="border-b border-stone-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">The Formulations</h1>
          <p className="text-stone-500 mt-2 text-sm sm:text-base leading-relaxed">
            Dermatologist tested. Clinical concentrations. Zero added fragrance.
          </p>
        </div>
        <div className="flex items-center space-x-3 self-start md:self-auto w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-850 transition"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
          </button>

          <div className="flex items-center space-x-3">
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
      </div>

      <div className="mt-8 lg:grid lg:grid-cols-4 lg:gap-x-8">
        {/* Filters Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 border-r border-stone-200/80 pr-6 space-y-6">
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

          {/* Search */}
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
                    (activeCategory || '').toLowerCase() === cat.toLowerCase()
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
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col rounded-2xl border border-stone-100 p-4 bg-stone-50/50 space-y-4">
                  <div className="bg-stone-200/80 aspect-[4/5] w-full rounded-xl"></div>
                  <div className="h-3 bg-stone-200/80 rounded w-1/4 mt-2"></div>
                  <div className="h-5 bg-stone-200/80 rounded w-3/4"></div>
                  <div className="h-4 bg-stone-200/80 rounded w-1/3"></div>
                  <div className="h-8 bg-stone-200/80 rounded-full w-full mt-4"></div>
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
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {products.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Mobile Drawer Slide-over */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex justify-end lg:hidden">
          <div className="w-[85vw] max-w-sm h-full bg-white shadow-2xl p-6 flex flex-col overflow-y-auto animate-slide-in">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <span className="text-sm font-bold tracking-wider uppercase text-stone-900 flex items-center">
                <SlidersHorizontal className="h-4 w-4 mr-2 text-emerald-800" /> Filters
              </span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-stone-400 hover:text-stone-900 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 py-6 flex-1">
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Search</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Find serum, toner..."
                    value={searchQuery}
                    onChange={(e) => updateFilters('search', e.target.value)}
                    className="w-full rounded-md border border-stone-300 bg-white py-2 pl-9 pr-3 text-xs text-stone-900 focus:border-emerald-600 focus:outline-none"
                  />
                  <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-stone-400" />
                </div>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-stone-200">
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Category</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { updateFilters('category', ''); }}
                    className={`text-left text-xs py-2 px-3 rounded text-center transition ${
                      !activeCategory ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-250' : 'bg-stone-50 text-stone-600 border border-stone-200/40 hover:bg-stone-100'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { updateFilters('category', cat); }}
                      className={`text-left text-xs py-2 px-3 rounded text-center transition ${
                        (activeCategory || '').toLowerCase() === cat.toLowerCase()
                          ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-250'
                          : 'bg-stone-50 text-stone-600 border border-stone-200/40 hover:bg-stone-100'
                      }`}
                    >
                      {cat}s
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-stone-200">
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Skin Concern / Type</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { updateFilters('skinType', ''); }}
                    className={`text-left text-xs py-2 px-3 rounded text-center transition ${
                      !activeSkinType ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-250' : 'bg-stone-50 text-stone-600 border border-stone-200/40 hover:bg-stone-100'
                    }`}
                  >
                    All Skin Types
                  </button>
                  {skinTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => { updateFilters('skinType', type); }}
                      className={`text-left text-xs py-2 px-3 rounded text-center transition ${
                        activeSkinType.toLowerCase() === type.toLowerCase()
                          ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-250'
                          : 'bg-stone-50 text-stone-600 border border-stone-200/40 hover:bg-stone-100'
                      }`}
                    >
                      {type} Skin
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-stone-200 pt-4 flex gap-3">
              {(activeCategory || activeSkinType || searchQuery) && (
                <button
                  onClick={() => { clearAllFilters(); setMobileFiltersOpen(false); }}
                  className="flex-1 rounded-md border border-stone-300 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition text-center"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 rounded-md bg-stone-900 hover:bg-stone-800 py-2.5 text-xs font-semibold text-white transition text-center"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
