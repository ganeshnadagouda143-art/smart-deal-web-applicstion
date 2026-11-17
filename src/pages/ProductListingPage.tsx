import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { PublicLayout } from '../layouts/PublicLayout';
import { useSmartDeal } from '../contexts/SmartDealContext';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES } from '../services/mockData';
import { ProductCategory } from '../types';

export const ProductListingPage: React.FC = () => {
  const { products } = useSmartDeal();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCat = (searchParams.get('category') as ProductCategory | 'All') || 'All';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc'>('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const paramCat = searchParams.get('category');
    if (paramCat) {
      setSelectedCategory(paramCat);
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products
      .filter((p) => {
        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
        if (p.discountedPrice > maxPrice) return false;
        const discountPct = ((p.originalPrice - p.discountedPrice) / p.originalPrice) * 100;
        if (discountPct < minDiscount) return false;
        if (p.sellerRating < minRating) return false;
        if (
          q &&
          !p.name.toLowerCase().includes(q) &&
          !p.sellerName.toLowerCase().includes(q) &&
          !p.category.toLowerCase().includes(q)
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.discountedPrice - b.discountedPrice;
        if (sortBy === 'price-desc') return b.discountedPrice - a.discountedPrice;
        return b.popularity - a.popularity;
      });
  }, [products, searchQuery, selectedCategory, maxPrice, minDiscount, minRating, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setMaxPrice(3000);
    setMinDiscount(0);
    setMinRating(0);
    setSortBy('popular');
    setSearchParams({});
  };

  return (
    <PublicLayout>
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D] tracking-tight">
              Explore Negotiable Products
            </h1>
            <p className="mt-1 text-sm text-[#64748B]">
              Compare verified Indian sellers, inspect bulk pricing tiers, or make a custom offer.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowMobileFilters((v) => !v)}
              className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#E2E8F0] bg-white text-sm font-medium text-[#14213D]"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-xs font-medium text-[#64748B] whitespace-nowrap">
                Sort by
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
              >
                <option value="popular">Popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`lg:col-span-3 space-y-6 ${
              showMobileFilters ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#14213D]">Filters</h2>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#2563EB] hover:underline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Search */}
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Search catalog
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Product or seller name..."
                    className="w-full pl-9 pr-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <p className="text-xs font-semibold text-[#1E293B] mb-2">Category</p>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('All')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      selectedCategory === 'All'
                        ? 'bg-[#14213D] text-white'
                        : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#14213D]'
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        selectedCategory === cat.name
                          ? 'bg-[#14213D] text-white'
                          : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#14213D]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-[#1E293B]">Max Bulk Price</span>
                  <span className="font-semibold text-[#2563EB] tabular-nums">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={3000}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#2563EB]"
                />
                <div className="flex justify-between text-[11px] text-[#64748B] tabular-nums">
                  <span>₹300</span>
                  <span>₹3,000</span>
                </div>
              </div>

              {/* Discount Filter */}
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Minimum bulk discount
                </label>
                <select
                  value={minDiscount}
                  onChange={(e) => setMinDiscount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#1E293B]"
                >
                  <option value={0}>Any discount</option>
                  <option value={15}>15% or more</option>
                  <option value={20}>20% or more</option>
                  <option value={25}>25% or more</option>
                </select>
              </div>

              {/* Seller Rating */}
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Seller rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#1E293B]"
                >
                  <option value={0}>All ratings</option>
                  <option value={4.5}>4.5★ and above</option>
                  <option value={4.8}>4.8★ and above</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-9">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#64748B] tabular-nums">
                Showing <span className="font-semibold text-[#14213D]">{filteredProducts.length}</span>{' '}
                {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-12 text-center">
                <p className="text-base font-semibold text-[#14213D]">
                  No products match your current filters
                </p>
                <p className="text-sm text-[#64748B] mt-1">
                  Try increasing the max price range or clearing category filters.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 rounded-lg bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8]"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
