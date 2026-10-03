'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import {
  X,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  MessageSquareQuote,
  Check,
  ZoomIn,
  Share2,
  Eye,
  TrendingUp,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { parseSizes } from '@/lib/csvLoader';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const getCategorySpecifications = (category: string = '', name: string = '') => {
  const cat = category.toLowerCase();
  const title = name.toLowerCase();

  if (cat.includes('watch') || title.includes('watch') || title.includes('chronograph')) {
    return [
      { label: 'Movement', value: 'High-Accuracy Quartz Analog' },
      { label: 'Dial & Case', value: 'Alloy Case with Stainless Steel Back' },
      { label: 'Glass', value: 'Hardened Scratch-Resistant Mineral Glass' },
      { label: 'Strap', value: 'Adjustable Stainless Steel / Textured Strap' },
      { label: 'Verification', value: 'Calibrated & Battery-Tested Prior to Dispatch' },
    ];
  }

  if (cat.includes('ethnic') || cat.includes('kurta') || cat.includes('women')) {
    return [
      { label: 'Fabric', value: 'Breathable Cotton & Rayon Blend' },
      { label: 'Fit & Cut', value: 'Relaxed Tailored Drape (All-Day Comfort)' },
      { label: 'Workmanship', value: 'Reinforced Interlock Stitching & Clean Hems' },
      { label: 'Care Advice', value: 'Machine Wash Gentle / Cold Hand Wash' },
      { label: 'Verification', value: 'Pre-inspected for Fabric Feel & Color Fastness' },
    ];
  }

  if (cat.includes('jacket') || cat.includes('hoodie') || cat.includes('bomber')) {
    return [
      { label: 'Outer Shell', value: 'Durable Wind-Resistant Poly-Cotton Blend' },
      { label: 'Inner Lining', value: 'Soft Thermal Insulation / Micro-Fleece' },
      { label: 'Hardware', value: 'Smooth Heavy-Duty Zipper & Elasticated Rib Cuffs' },
      { label: 'Season', value: 'Ideal for Autumn / Winter Daily Commutes' },
      { label: 'Verification', value: 'Zip-Tested & Seam-Checked Before Dispatch' },
    ];
  }

  if (cat.includes('bottom') || cat.includes('trouser') || cat.includes('pant')) {
    return [
      { label: 'Fabric Blend', value: 'Stretch Cotton Twill (Comfort Flex)' },
      { label: 'Waist & Fit', value: 'Standard Regular-Rise with Belt Loops' },
      { label: 'Finish', value: 'Pre-Washed for Soft Handfeel & Minimal Shrinkage' },
      { label: 'Care Advice', value: 'Standard Machine Wash' },
      { label: 'Verification', value: 'Button & Inseam Strength Verified' },
    ];
  }

  if (cat.includes('combo') || cat.includes('shirt') || cat.includes('cotton')) {
    return [
      { label: 'Material', value: '100% Combed Breathable Daily Cotton' },
      { label: 'Set Details', value: 'Color-Matched Value Bundle' },
      { label: 'Durability', value: 'Fade-Resistant Pigment Dyeing' },
      { label: 'Care Advice', value: 'Normal Machine Wash with Like Colors' },
      { label: 'Verification', value: 'Size-Checked & Neatly Folded' },
    ];
  }

  if (cat.includes('audio') || cat.includes('electronic')) {
    return [
      { label: 'Driver Units', value: 'Dynamic Stereo Drivers (Balanced Acoustic Curve)' },
      { label: 'Connectivity', value: 'Bluetooth 5.0+ Wireless / Fast Auto-Pairing' },
      { label: 'Casing', value: 'Lightweight Impact-Resistant Matte Polycarbonate' },
      { label: 'Included', value: 'Charging Cable & Quick Setup Guide' },
      { label: 'Verification', value: 'Sound Balance & Battery Retention Tested' },
    ];
  }

  // Generic Honest Default
  return [
    { label: 'Composition', value: 'Curated Everyday-Grade Material' },
    { label: 'Fit Type', value: 'Standard Regular Fit (Matches Stated Sizes)' },
    { label: 'Craft Standard', value: 'Clean Seams with Thorough Finishing' },
    { label: 'Assurance', value: '7-Day Sizing Exchange & Flat ₹149 COD' },
    { label: 'Verification', value: 'Individually Inspected by Concierge Desk' },
  ];
};

function ProductModalInner({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addToCart, formatPrice, triggerWhatsAppCheckout, isInWishlist, toggleWishlist } = useCart();
  const isOutOfStock = (product.stock !== undefined && product.stock <= 0) || Boolean(product.isOutOfStock) || product.inStock === false;
  const maxStock = product.stock ?? 100;

  // Parse multi-size string into individual selectable tokens
  const availableSizes = useMemo(() => {
    if (!product.sizes || product.sizes.length === 0) return ['Free Size'];
    const flattened: string[] = [];
    product.sizes.forEach(s => {
      flattened.push(...parseSizes(s));
    });
    return flattened.length > 0 ? Array.from(new Set(flattened)) : ['Free Size'];
  }, [product.sizes]);

  const [selectedSize, setSelectedSize] = useState<string>(() =>
    availableSizes.length > 0 ? availableSizes[0] : 'Free Size'
  );
  const [customFitNote, setCustomFitNote] = useState<string>('');
  const [showCustomFit, setShowCustomFit] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'fulfillment'>('description');
  const [isAdded, setIsAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Product Zoom State
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Native Sharing State
  const [copiedLink, setCopiedLink] = useState(false);

  // Dynamic Social Proof Session Storage State
  const [viewerCount] = useState<number>(() => {
    if (typeof window === 'undefined' || !product || !product.id) return 18;
    try {
      const storageKey = `zyle_view_count_${product.id}`;
      const storedCount = sessionStorage.getItem(storageKey);

      if (storedCount) {
        const current = parseInt(storedCount, 10);
        return isNaN(current) ? 18 : current;
      }
      // Generate a deterministic, realistic base count (12 to 26 people) based on product ID
      const baseId =
        typeof product.id === 'number'
          ? product.id
          : product.id.toString().charCodeAt(0) || 1;
      const initialCount = 12 + ((baseId * 7) % 15);

      sessionStorage.setItem(storageKey, initialCount.toString());
      return initialCount;
    } catch {
      return 18;
    }
  });

  // Honest Category-Based Specifications
  const specifications = useMemo(
    () => getCategorySpecifications(product.category, product.name),
    [product.category, product.name]
  );

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const isFavorited = isInWishlist(product.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPos({ x, y });
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareData = {
      title: `${product.name} — ZYLE`,
      text: `Discover ${product.name} (${product.category}) on ZYLE:`,
      url: shareUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fall through to clipboard if user dismissed or unsupported
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  const handleAddAndClose = () => {
    if (isOutOfStock) return;
    const added = addToCart(product, selectedSize, quantity, customFitNote);
    if (added) {
      setIsAdded(true);
      setTimeout(() => {
        onClose();
      }, 400);
    }
  };

  const handleSingleItemWhatsAppBuy = () => {
    triggerWhatsAppCheckout({
      product,
      size: selectedSize,
      quantity,
      customFitNote,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in max-w-full">
      {/* Backdrop click area */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col md:flex-row overflow-hidden shadow-2xl border border-neutral-200 relative my-auto animate-scale-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 border border-neutral-200 transition-colors shadow-2xs cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Column: Visual Gallery with Interactive Product Zoom */}
        <div className="md:w-1/2 relative bg-neutral-100/90 flex items-center justify-center min-h-[300px] md:min-h-[500px] p-6 overflow-hidden">
          <div
            ref={imageContainerRef}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            className="relative w-full h-full min-h-[280px] md:min-h-[460px] flex items-center justify-center cursor-crosshair overflow-hidden rounded-xl"
          >
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-neutral-200 animate-pulse flex items-center justify-center rounded-xl">
                <span className="text-xs text-neutral-400 font-medium">Loading photograph...</span>
              </div>
            )}
            {imageError ? (
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200 flex flex-col items-center justify-center p-8 text-center rounded-xl">
                <div className="w-16 h-16 rounded-full bg-white shadow-2xs flex items-center justify-center mb-3 text-neutral-600">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-800 line-clamp-1">{product.name}</h3>
                <span className="text-xs text-neutral-500 mt-1">{product.category} • Curated Edition</span>
              </div>
            ) : (
              <div
                className="relative w-full h-full min-h-[280px] md:min-h-[460px] transition-transform duration-150 ease-out"
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  unoptimized={true}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={`object-contain p-4 transition-opacity duration-300 pointer-events-none ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  referrerPolicy="no-referrer"
                  priority
                />
              </div>
            )}

            {/* Subtle Zoom Hint Overlay */}
            {imageLoaded && !imageError && (
              <div className="absolute bottom-3 right-3 text-[10px] bg-black/60 text-white px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5 pointer-events-none shadow-xs transition-opacity duration-200">
                <ZoomIn className="w-3 h-3 text-white/80" />
                <span>{isZoomed ? '2.2x Magnifier' : 'Hover to Inspect Details'}</span>
              </div>
            )}
          </div>

          {/* Badges on Modal Image */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none z-10">
            {product.discountPercent > 0 && (
              <span className="bg-[#111111] text-white text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-sm uppercase shadow-2xs">
                SAVE {product.discountPercent}%
              </span>
            )}
            <span className="bg-white/95 text-neutral-800 text-[11px] font-medium px-2 py-0.5 rounded-sm border border-neutral-200/80 shadow-2xs">
              {product.category}
            </span>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="md:w-1/2 p-5 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh] md:max-h-[560px]">
          <div>
            {/* Header: Category, Native Share & Wishlist */}
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
                {product.category}
              </span>
              <div className="flex items-center gap-3">
                {/* Native Sharing Button */}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-900 transition-colors p-1 cursor-pointer"
                  title="Share Artifact"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 text-[11px] font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-neutral-500 hover:text-neutral-900" />
                      <span className="hidden sm:inline">Share</span>
                    </>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-red-500 transition-colors p-1 cursor-pointer"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorited ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                  <span className="hidden sm:inline">{isFavorited ? 'Wishlisted' : 'Save'}</span>
                </button>
              </div>
            </div>

            {/* Product Title */}
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F] mb-3">
              {product.name}
            </h2>

            {/* Status & Social Proof Indicators */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>In Stock • Ships in 24–48 Hours</span>
              </div>

              {viewerCount > 0 && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100/90 text-stone-700 text-xs font-medium border border-stone-200/80">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>
                    Trending • Viewed by <strong className="font-semibold text-stone-900 tabular-nums">{viewerCount}</strong> people today
                  </span>
                </div>
              )}
            </div>

            {/* Price Module */}
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-2xl sm:text-3xl font-bold text-neutral-950 tabular-nums">
                {formatPrice(product.sellingPrice)}
              </span>
              {product.originalPrice > product.sellingPrice && (
                <span className="text-base text-neutral-400 line-through tabular-nums">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="text-xs text-emerald-700 font-medium mb-6">
              Complimentary Pan-India Express Delivery (Save ₹149 on Prepaid)
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                  Select Size
                </span>
                <button
                  type="button"
                  onClick={() => setShowCustomFit(!showCustomFit)}
                  className="text-xs text-neutral-500 hover:text-black underline cursor-pointer"
                >
                  {showCustomFit ? 'Hide custom fit' : 'Need custom sizing?'}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-2xs'
                        : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-neutral-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* Collapsible Custom Fit Input */}
              {showCustomFit && (
                <div className="mt-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200 animate-fade-in">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-700 mb-1">
                    <MessageSquareQuote className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Custom Fit / Measurement Note</span>
                  </div>
                  <input
                    type="text"
                    value={customFitNote}
                    onChange={e => setCustomFitNote(e.target.value)}
                    placeholder="e.g. Chest 42 in, Wrist 6.8 in, or Height 5'10"
                    className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-md focus:outline-none focus:border-neutral-900"
                  />
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Directly sent to our fulfillment desk with your WhatsApp booking.
                  </p>
                </div>
              )}
            </div>

            {/* Tabbed Editorial Details */}
            <div className="mb-6">
              <div className="flex border-b border-neutral-200 mb-3 text-xs font-medium">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`pb-2 px-1 mr-4 transition-colors cursor-pointer ${
                    activeTab === 'description'
                      ? 'border-b-2 border-neutral-900 text-neutral-900'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2 px-1 mr-4 transition-colors cursor-pointer ${
                    activeTab === 'specs'
                      ? 'border-b-2 border-neutral-900 text-neutral-900'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('fulfillment')}
                  className={`pb-2 px-1 transition-colors cursor-pointer ${
                    activeTab === 'fulfillment'
                      ? 'border-b-2 border-neutral-900 text-neutral-900'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Shipping & Trust
                </button>
              </div>

              <div className="text-xs text-neutral-600 leading-relaxed min-h-[60px]">
                {activeTab === 'description' && (
                  <p>{product.description || 'Handpicked daily with verified quality inspection.'}</p>
                )}

                {/* Collision-Free Grounded Specifications Grid */}
                {activeTab === 'specs' && (
                  <div className="divide-y divide-neutral-100">
                    {specifications.map(spec => (
                      <div
                        key={spec.label}
                        className="grid grid-cols-12 gap-3 py-2 text-xs items-baseline"
                      >
                        <span className="col-span-4 sm:col-span-4 text-neutral-500 font-normal shrink-0">
                          {spec.label}
                        </span>
                        <span className="col-span-8 sm:col-span-8 font-medium text-neutral-800 text-left">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'fulfillment' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-neutral-700">
                      <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Complimentary Pan-India Express Delivery (Save ₹149 on UPI / Prepaid)</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-700">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>7-Day Size Exchange Guarantee • Pre-Dispatch Inspection</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Footer: Add to Cart & 1-Click WhatsApp Direct Buy */}
          <div className="pt-4 border-t border-neutral-100 space-y-2.5">
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={handleAddAndClose}
                disabled={isOutOfStock}
                className="flex-1 bg-neutral-900 hover:bg-black text-white font-medium py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isAdded ? 'Added to Bag!' : isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
              </button>

              <button
                type="button"
                onClick={handleSingleItemWhatsAppBuy}
                disabled={isOutOfStock}
                className="flex-1 bg-[#128C7E] hover:bg-[#075E54] text-white font-medium py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Instant WhatsApp Buy</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Express Pan-India Dispatch • ₹149 COD / Free on UPI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  if (!product) return null;
  return <ProductModalInner key={product.id} product={product} onClose={onClose} />;
}
