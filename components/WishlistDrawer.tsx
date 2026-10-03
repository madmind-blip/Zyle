'use client';

import React from 'react';
import Image from 'next/image';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/types';

interface WishlistDrawerProps {
  products: Product[];
}

export default function WishlistDrawer({ products }: WishlistDrawerProps) {
  const { wishlist, isWishlistOpen, closeWishlist, toggleWishlist, addToCart, formatPrice } = useCart();

  if (!isWishlistOpen) return null;

  const favoritedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeWishlist}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-neutral-200">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <h2 className="text-base sm:text-lg font-bold text-[#1D1D1F]">
                Saved Artifacts ({favoritedProducts.length})
              </h2>
            </div>
            <button
              onClick={closeWishlist}
              className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {favoritedProducts.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                  <Heart className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-1">Your wishlist is empty</h3>
                <p className="text-xs text-neutral-500 max-w-xs mb-6">
                  Save pieces you love while browsing to inspect or purchase them later.
                </p>
                <button
                  onClick={closeWishlist}
                  className="px-6 py-2.5 bg-[#111111] text-white rounded-full text-xs font-semibold"
                >
                  Discover Pieces
                </button>
              </div>
            ) : (
              favoritedProducts.map(product => (
                <div
                  key={product.id}
                  className="flex gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 items-center justify-between"
                >
                  <div className="relative w-16 h-20 bg-neutral-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1">
                    <Image
                      src={product.image || 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'}
                      alt={product.name}
                      fill
                      unoptimized={true}
                      sizes="64px"
                      className="object-contain p-1"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0 px-1">
                    <div className="text-[10px] text-neutral-500 uppercase font-semibold">
                      {product.category}
                    </div>
                    <h4 className="text-xs font-semibold text-[#1D1D1F] truncate">
                      {product.name}
                    </h4>
                    <div className="text-xs font-bold text-neutral-900 mt-1 tabular-nums">
                      {formatPrice(product.sellingPrice)}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 items-end">
                    <button
                      onClick={() => {
                        addToCart(product, product.sizes[0] || 'Free Size', 1);
                      }}
                      className="px-2.5 py-1.5 bg-[#111111] hover:bg-neutral-800 text-white rounded-md text-[11px] font-medium flex items-center gap-1 transition-colors"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="text-neutral-400 hover:text-red-500 p-1 text-[11px] transition-colors"
                      title="Remove"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-neutral-200 bg-neutral-50">
            <button
              onClick={closeWishlist}
              className="w-full py-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-semibold rounded-lg transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
