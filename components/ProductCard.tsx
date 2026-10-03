'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, ShoppingBag, Heart, Check, Sparkles, Ban, Share2 } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart, formatPrice, isInWishlist, toggleWishlist } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = (product.stock !== undefined && product.stock <= 0) || Boolean(product.isOutOfStock) || product.inStock === false;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const added = addToCart(product, product.sizes[0] || 'Free Size', 1);
    if (added) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1800);
    }
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group flex flex-col bg-white rounded-2xl border border-neutral-200/80 hover:border-neutral-400/80 transition-all duration-300 overflow-hidden cursor-pointer shadow-2xs hover:shadow-md relative w-full"
    >
      {/* 100% Thumbnail Containment: Fixed-ratio, padded frame with neutral background */}
      <div className="relative w-full aspect-[4/5] bg-[#F5F5F7] rounded-2xl overflow-hidden flex items-center justify-center p-3">
        {/* Skeleton loading shimmer */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-neutral-200/80 animate-pulse flex items-center justify-center">
            <span className="text-[10px] text-neutral-400 font-medium">Loading...</span>
          </div>
        )}

        {/* Fallback container if image fails to load */}
        {imageError ? (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200 flex flex-col items-center justify-center p-3 text-center">
            <div className="w-8 h-8 rounded-full bg-white shadow-2xs flex items-center justify-center mb-1 text-neutral-600">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-medium text-neutral-800 line-clamp-1">{product.name}</span>
            <span className="text-[9px] text-neutral-500 mt-0.5">{product.category}</span>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={product.image}
              alt={product.name}
              fill
              unoptimized={true}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              } ${isOutOfStock ? 'grayscale-60 opacity-75' : ''}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
              priority={false}
            />
          </div>
        )}

        {/* Badges: Positioned neatly inside top-left corner */}
        {isOutOfStock ? (
          <span className="absolute top-2 left-2 z-10 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-900/90 text-neutral-200 backdrop-blur-md uppercase tracking-wider">
            SOLD OUT
          </span>
        ) : product.discountPercent > 0 ? (
          <span className="absolute top-2 left-2 z-10 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full bg-black/80 text-white backdrop-blur-md uppercase tracking-wider">
            SAVE {product.discountPercent}%
          </span>
        ) : null}

        {/* Wishlist & Share Actions: Positioned neatly inside top-right corner */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="p-1.5 rounded-full bg-white/90 backdrop-blur-md text-neutral-700 hover:text-red-500 transition-colors shadow-2xs cursor-pointer"
            aria-label="Add to wishlist"
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                isFavorited ? 'fill-red-500 text-red-500' : ''
              }`}
            />
          </button>

          <button
            onClick={async (e) => {
              e.stopPropagation();
              const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
              if (typeof navigator !== 'undefined' && navigator.share) {
                try {
                  await navigator.share({
                    title: `${product.name} — ZYLE`,
                    text: `Explore ${product.name} on ZYLE atelier:`,
                    url: shareUrl,
                  });
                  return;
                } catch (err) {}
              }
              if (typeof navigator !== 'undefined' && navigator.clipboard) {
                navigator.clipboard.writeText(shareUrl);
              }
            }}
            className="p-1.5 rounded-full bg-white/90 backdrop-blur-md text-neutral-600 hover:text-neutral-900 transition-colors shadow-2xs cursor-pointer opacity-0 group-hover:opacity-100"
            aria-label="Share artifact"
            title="Share"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Desktop Quick Actions Floating Overlay */}
        <div className="absolute bottom-2.5 inset-x-2.5 hidden sm:flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 py-1.5 px-2 bg-white/95 backdrop-blur-md hover:bg-white text-neutral-900 text-xs font-medium rounded-lg shadow-sm border border-neutral-200 flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`py-1.5 px-2.5 rounded-lg shadow-sm flex items-center justify-center gap-1 transition-colors ${
              isOutOfStock
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                : 'bg-[#111111] hover:bg-neutral-800 text-white text-xs font-medium cursor-pointer'
            }`}
            title={isOutOfStock ? 'Sold Out' : 'Add to bag'}
          >
            {isOutOfStock ? (
              <Ban className="w-3.5 h-3.5" />
            ) : isAdded ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <ShoppingBag className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Card Info Details: Clean, Effortless, Light & Refined */}
      <div className="p-2.5 sm:p-3.5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category kicker */}
          <div className="text-[10px] sm:text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1 truncate">
            {product.category}
          </div>

          {/* Product Name */}
          <h3 className="text-xs sm:text-sm font-normal text-neutral-900 line-clamp-2 leading-relaxed min-h-[2.5rem] group-hover:text-neutral-600 transition-colors mb-1.5">
            {product.name}
          </h3>

          {/* Available sizes */}
          <div className="text-[10px] sm:text-[11px] text-neutral-500 mb-2 truncate font-normal">
            {product.sizes.join(' · ')}
          </div>
        </div>

        {/* Price & Mobile Add Button */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-1.5">
          <div className="text-sm sm:text-base font-medium text-neutral-900 flex items-center gap-1.5 flex-wrap">
            <span className="tabular-nums">
              {formatPrice(product.sellingPrice)}
            </span>
            {product.originalPrice > product.sellingPrice && (
              <span className="text-[11px] sm:text-xs text-neutral-400 line-through tabular-nums font-normal">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Mobile quick add button with stock guard */}
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`sm:hidden p-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
              isOutOfStock
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                : 'bg-[#111111] active:bg-neutral-800 text-white cursor-pointer'
            }`}
            aria-label={isOutOfStock ? 'Sold Out' : 'Add to cart'}
          >
            {isOutOfStock ? (
              <Ban className="w-3.5 h-3.5" />
            ) : isAdded ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <ShoppingBag className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
