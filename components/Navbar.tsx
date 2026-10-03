'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Heart, Search, User, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/lib/types';

interface NavbarProps {
  onSearchChange?: (val: string) => void;
  searchValue?: string;
  onCategorySelect?: (cat: string) => void;
  products?: Product[];
}

const NAV_CATEGORIES = [
  { label: 'All Catalog', cat: 'All' },
  { label: 'Watches', cat: 'Watches' },
  { label: 'Kurtas & Ethnic', cat: 'Ethnic & Kurtas' },
  { label: 'Audio', cat: 'Audio & Electronics' },
  { label: 'Combos', cat: 'Combos' },
  { label: 'Outerwear', cat: 'Jackets' },
  { label: 'Women', cat: 'Women' },
  { label: 'Trust & FAQ', cat: 'faq' },
];

export default function Navbar({
  onSearchChange,
  searchValue = '',
  onCategorySelect,
  products = [],
}: NavbarProps) {
  const { totalItems, openCart, wishlist, openWishlist, openQuickView } = useCart();
  const { isAuthenticated, openAccountModal } = useAuth();
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute live matching product suggestions (max 5)
  const matchingProducts = useMemo(() => {
    if (!searchValue.trim() || products.length === 0) return [];
    const q = searchValue.toLowerCase().trim();
    return products
      .filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      )
      .slice(0, 5);
  }, [searchValue, products]);

  // Compute matching category tags
  const matchingCategories = useMemo(() => {
    if (!searchValue.trim()) return [];
    const q = searchValue.toLowerCase().trim();
    return NAV_CATEGORIES
      .filter(item => item.cat !== 'All' && item.cat !== 'faq' && item.label.toLowerCase().includes(q))
      .slice(0, 3);
  }, [searchValue]);

  const handleNavClick = (cat: string) => {
    if (cat === 'faq') {
      const el = document.getElementById('trust-hub');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      if (onCategorySelect) onCategorySelect(cat);
      const el = document.getElementById('catalog') || document.getElementById('catalog-grid');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setShowSuggestions(false);
  };

  const handleSelectProductSuggestion = (product: Product) => {
    openQuickView(product);
    setShowSuggestions(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-neutral-200/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-[#1D1D1F] hover:opacity-90 transition-opacity flex items-center gap-2 brand-logo font-display"
          >
            <span>ZYLE</span>
          </Link>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium text-neutral-600">
          {NAV_CATEGORIES.map(item => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.cat)}
              className="hover:text-neutral-900 transition-colors relative py-1 text-xs uppercase tracking-wider font-medium cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Search, Account, Wishlist & Cart Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Quick Search with Live Suggestions */}
          <div ref={searchContainerRef} className="relative flex items-center">
            {showSearchInput ? (
              <div className="relative">
                <div className="flex items-center bg-white border border-neutral-300 rounded-full px-3 py-1 shadow-sm w-48 sm:w-64 transition-all duration-200">
                  <Search className="w-3.5 h-3.5 text-neutral-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search horology, audio..."
                    value={searchValue}
                    onFocus={() => setShowSuggestions(true)}
                    onChange={e => {
                      if (onSearchChange) onSearchChange(e.target.value);
                      setShowSuggestions(true);
                    }}
                    className="w-full text-xs text-neutral-800 bg-transparent focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setShowSearchInput(false);
                      setShowSuggestions(false);
                      if (onSearchChange) onSearchChange('');
                    }}
                    className="text-neutral-400 hover:text-neutral-700 text-xs ml-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Floating Live Search Auto-Suggestions Dropdown */}
                {showSuggestions && searchValue.trim().length > 0 && (
                  <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-neutral-200/90 overflow-hidden z-50 animate-scale-up">
                    {/* Matching Categories Shortcuts */}
                    {matchingCategories.length > 0 && (
                      <div className="p-2 border-b border-neutral-100 bg-neutral-50/60">
                        <div className="text-[10px] uppercase font-semibold text-neutral-400 px-2 py-1 tracking-wider">
                          Categories
                        </div>
                        <div className="flex flex-wrap gap-1.5 px-2 pb-1">
                          {matchingCategories.map(c => (
                            <button
                              key={c.cat}
                              onClick={() => handleNavClick(c.cat)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-neutral-200 text-[11px] font-medium text-neutral-800 hover:border-neutral-400 transition-colors cursor-pointer"
                            >
                              <Tag className="w-2.5 h-2.5 text-neutral-400" />
                              <span>{c.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matching Products List */}
                    <div className="p-2">
                      <div className="text-[10px] uppercase font-semibold text-neutral-400 px-2 py-1 tracking-wider">
                        Matching Artifacts ({matchingProducts.length})
                      </div>

                      {matchingProducts.length > 0 ? (
                        <div className="space-y-1 mt-1">
                          {matchingProducts.map(item => (
                            <button
                              key={item.id}
                              onClick={() => handleSelectProductSuggestion(item)}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-50 transition-colors text-left group cursor-pointer"
                            >
                              <div className="relative w-9 h-9 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-neutral-100 flex items-center justify-center">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  unoptimized
                                  className="object-contain p-0.5"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-neutral-900 truncate group-hover:text-black">
                                  {item.name}
                                </div>
                                <div className="text-[10px] text-neutral-500">
                                  {item.category} • ₹{item.sellingPrice.toLocaleString('en-IN')}
                                </div>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all shrink-0" />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="px-3 py-4 text-center text-xs text-neutral-400">
                          No direct product matches found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowSearchInput(true);
                  setShowSuggestions(true);
                }}
                className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80 rounded-full transition-colors cursor-pointer"
                aria-label="Open search"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Account Vault / Sign-In Button */}
          <button
            onClick={openAccountModal}
            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80 rounded-full transition-colors relative cursor-pointer"
            aria-label={isAuthenticated ? 'Account Vault' : 'Sign in'}
            title={isAuthenticated ? 'Client Account Vault' : 'Mobile Number Sign-In'}
          >
            <User className="w-4 h-4" />
            {isAuthenticated && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={openWishlist}
            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80 rounded-full transition-colors relative cursor-pointer"
            aria-label="View Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-neutral-900 text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Bag Button */}
          <button
            onClick={openCart}
            className="flex items-center gap-2 bg-[#111111] hover:bg-neutral-800 text-white px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm active:scale-95 cursor-pointer"
            aria-label="Open Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="bg-white/20 px-1.5 py-0.2 rounded-full text-[11px] font-semibold tabular-nums">
              {totalItems}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
