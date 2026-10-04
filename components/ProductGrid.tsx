'use client';

import React, { useState, useMemo, useRef } from 'react';
import { Product, SortOption } from '@/lib/types';
import ProductCard from './ProductCard';
import {
  Search,
  ArrowUpDown,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Watch,
  Shirt,
  Headphones,
  Package,
  Layers,
  Gem,
  Scissors,
  Glasses,
} from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onQuickView: (product: Product) => void;
  isLoading?: boolean;
}

const CATEGORY_ITEMS = [
  { name: 'All', icon: Sparkles },
  { name: 'Watches', icon: Watch },
  { name: 'Ethnic & Kurtas', icon: Shirt },
  { name: 'Audio & Electronics', icon: Headphones },
  { name: 'Combos', icon: Package },
  { name: 'Jackets', icon: Layers },
  { name: 'Women', icon: Gem },
  { name: 'Shirts', icon: Scissors },
  { name: 'Eyewear', icon: Glasses },
];

export default function ProductGrid({
  products,
  activeCategory,
  onSelectCategory,
  onQuickView,
  isLoading = false,
}: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Smooth scroll handler for category chevrons
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (activeCategory !== 'All') {
      result = result.filter(
        p => p.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (Array.isArray(p.tags)
            ? p.tags.some(t => t.toLowerCase() === q || t.toLowerCase().includes(q))
            : typeof p.tags === 'string'
            ? p.tags.toLowerCase().includes(q)
            : false)
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.sellingPrice - b.sellingPrice);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.sellingPrice - a.sellingPrice);
    } else if (sortBy === 'discount') {
      result.sort((a, b) => b.discountPercent - a.discountPercent);
    }

    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  const resetFilters = () => {
    onSelectCategory('All');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <section id="catalog" className="py-8 sm:py-16 max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 w-full scroll-mt-20">
      {/* Anchor helper for backwards compatibility */}
      <div id="catalog-grid" className="-mt-20 pt-20" />

      {/* Section Header: Clean editorial header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1">
            Curated Collection
          </div>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#1D1D1F]">
            The Atelier Catalog
          </h2>
        </div>
      </div>

      {/* Minimal Icon Category Pills Bar with Touch & Mouse Scroll Support */}
      <div className="relative group/cats mb-6">
        {/* Left Scroll Chevron */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/95 border border-neutral-300 shadow-sm items-center justify-center text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 transition-all opacity-0 group-hover/cats:opacity-100 cursor-pointer"
          aria-label="Scroll categories left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Container with minimal icons */}
        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1 w-full touch-pan-x select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {CATEGORY_ITEMS.map(({ name, icon: IconComponent }) => {
            const isActive = activeCategory.toLowerCase() === name.toLowerCase();
            return (
              <button
                key={name}
                onClick={() => {
                  onSelectCategory(name);
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-normal whitespace-nowrap flex-shrink-0 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#111111] text-white shadow-2xs font-medium'
                    : 'bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-200/80'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                <span>{name}</span>
              </button>
            );
          })}
        </div>

        {/* Right Scroll Chevron */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/95 border border-neutral-300 shadow-sm items-center justify-center text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 transition-all opacity-0 group-hover/cats:opacity-100 cursor-pointer"
          aria-label="Scroll categories right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Search & Sorting Bar */}
      <div className="bg-white rounded-xl border border-neutral-200/80 p-3 sm:p-4 mb-6 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search artifacts by name, material, category, or keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 focus:border-neutral-400 rounded-lg transition-all focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sorting Dropdown & Reset */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500 absolute left-3 pointer-events-none" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="pl-8 pr-8 py-2 text-xs font-normal bg-neutral-50 hover:bg-neutral-100/60 border border-neutral-200 rounded-lg text-neutral-800 appearance-none focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>

          {(searchQuery || activeCategory !== 'All' || sortBy !== 'featured') && (
            <button
              onClick={resetFilters}
              className="text-xs text-neutral-500 hover:text-neutral-900 px-2.5 py-2 font-normal transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results Count Bar: Direct seamless transition without tag cluster */}
      <div className="flex items-center justify-between text-xs text-neutral-500 mb-5">
        <span>
          Showing <strong className="text-neutral-900 tabular-nums font-medium">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'artifact' : 'artifacts'}
          {activeCategory !== 'All' && <span> in <strong>{activeCategory}</strong></span>}
          {searchQuery && <span> for &ldquo;{searchQuery}&rdquo;</span>}
        </span>
      </div>

      {/* Product Grid: Clean 2-items-per-tray mobile grid & 100% containment */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 px-2.5 sm:px-6 max-w-7xl mx-auto w-full">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={`skeleton-${idx}`}
              className="bg-white rounded-2xl p-3 border border-neutral-200/80 shadow-2xs flex flex-col justify-between"
            >
              <div className="relative aspect-[4/5] rounded-xl bg-neutral-200/70 animate-pulse overflow-hidden mb-3" />
              <div className="space-y-2 pb-1">
                <div className="h-2.5 w-16 bg-neutral-200/80 animate-pulse rounded" />
                <div className="h-3.5 w-3/4 bg-neutral-200/80 animate-pulse rounded" />
                <div className="h-3.5 w-1/3 bg-neutral-200/80 animate-pulse rounded mt-1.5" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 px-2.5 sm:px-6 max-w-7xl mx-auto w-full">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center bg-white rounded-2xl border border-neutral-200/80 p-8 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No artifacts matched your criteria</h3>
          <p className="text-xs text-neutral-500 mb-6 font-normal">
            Try adjusting your search terms, changing the category, or clearing active filters to browse our complete collection.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-normal rounded-full transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
}
