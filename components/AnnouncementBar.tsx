'use client';

import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck } from 'lucide-react';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#111111] text-[#F5F5F7] text-xs font-normal tracking-wide px-4 py-2 relative z-50 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center gap-2 sm:gap-3 text-center">
          <span className="inline-flex items-center gap-1.5 text-neutral-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-medium text-white">Direct Atelier Fulfillment</span>
          </span>
          <span className="text-neutral-600 hidden sm:inline">·</span>
          <span className="hidden sm:inline text-neutral-300">Complimentary Pan-India Delivery</span>
          <span className="text-neutral-600 hidden sm:inline">·</span>
          <span className="hidden md:inline text-neutral-400">7-Day Replacement Guarantee</span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-neutral-400 hover:text-white p-1 transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
