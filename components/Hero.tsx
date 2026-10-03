'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Clock, Truck, RefreshCw } from 'lucide-react';

interface HeroProps {
  onExploreClick?: () => void;
  onTrendingClick?: () => void;
}

const dynamicWords = [
  'Daily Rituals.',
  'Everyday Presence.',
  'Zero Guesswork.',
];

const TRUST_PILLARS = [
  {
    icon: Sparkles,
    title: 'Curated Daily',
    subtitle: 'Handpicked authentic drops',
    bg: 'bg-stone-100',
    color: 'text-stone-800',
  },
  {
    icon: Clock,
    title: '24–48h Dispatch',
    subtitle: 'Live order tracking alerts',
    bg: 'bg-stone-100',
    color: 'text-stone-800',
  },
  {
    icon: Truck,
    title: 'Free on UPI / ₹149 COD',
    subtitle: 'Express pan-India delivery',
    bg: 'bg-stone-100',
    color: 'text-stone-800',
  },
  {
    icon: RefreshCw,
    title: '7-Day Sizing Guarantee',
    subtitle: 'Hassle-free size exchange',
    bg: 'bg-stone-100',
    color: 'text-stone-800',
  },
];

export default function Hero({ onExploreClick }: HeroProps) {
  const [wordIdx, setWordIdx] = useState(0);
  const [isRevealing, setIsRevealing] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 1. Kinetic cycle interval
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRevealing(false);
      setTimeout(() => {
        setWordIdx(prev => (prev + 1) % dynamicWords.length);
        setIsRevealing(true);
      }, 350);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // 2. Interactive 3D Perspective Tilt on Mouse / Touch Move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 14, y: y * -14 });
  }, []);

  const handleMouseLeave = () => setMousePos({ x: 0, y: 0 });

  const handleExplore = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const el = document.getElementById('catalog') || document.getElementById('catalog-grid');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative pt-12 pb-14 sm:pt-18 sm:pb-22 overflow-hidden text-center px-4 bg-[#FAF9F5] border-b border-stone-200/70 select-none"
    >
      {/* Dynamic Cursor Aura Spotlight */}
      <div
        className="absolute w-80 h-80 rounded-full pointer-events-none -z-10 blur-3xl transition-transform duration-500 ease-out opacity-60"
        style={{
          background:
            'radial-gradient(circle, rgba(212,185,150,0.38) 0%, rgba(245,237,227,0.15) 70%, transparent 100%)',
          left: `calc(50% + ${mousePos.x * 12}px - 160px)`,
          top: `calc(50% + ${mousePos.y * -12}px - 160px)`,
        }}
      />

      {/* Curated Pre-header Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 border border-stone-200/80 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.03)] mb-6 transition-all hover:border-stone-300">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
        <span className="text-[11px] font-sans uppercase tracking-[0.2em] font-medium text-stone-600">
          Fresh Drops • Curated Daily • Pan-India
        </span>
      </div>

      {/* 3D Interactive Kinetic Headline */}
      <div
        className="max-w-4xl mx-auto transition-transform duration-200 ease-out"
        style={{
          perspective: '1000px',
          transform: `perspective(1000px) rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg)`,
        }}
      >
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-light text-stone-900 tracking-tight leading-[1.08]">
          <span className="block transform transition-transform hover:scale-[1.02] duration-300">
            Real Style.
          </span>

          {/* Staggered Interactive Word Reveal */}
          <span className="block mt-1 min-h-[1.25em] font-normal italic text-transparent bg-clip-text bg-gradient-to-r from-stone-900 via-stone-700 to-amber-900 overflow-hidden">
            <span className="inline-flex justify-center flex-wrap">
              {dynamicWords[wordIdx].split('').map((char, i) => (
                <span
                  key={`${wordIdx}-${i}`}
                  style={{
                    transitionDelay: `${i * 22}ms`,
                    transform: isRevealing
                      ? 'translateY(0) scale(1)'
                      : 'translateY(28px) scale(0.92)',
                    opacity: isRevealing ? 1 : 0,
                  }}
                  className="inline-block transition-all duration-400 ease-out hover:text-amber-700 hover:-translate-y-1 cursor-default"
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
          </span>
        </h1>
      </div>

      {/* Literal, Transparent Subtitle */}
      <p className="mt-5 text-xs sm:text-sm md:text-base text-stone-600 max-w-xl mx-auto leading-relaxed font-sans font-normal">
        Handpicked steel chronographs, breathable cotton sets, tailored outerwear, and rich audio. Distinctive pieces made to be worn and used every single day — with flat ₹149 Cash on Delivery.
      </p>

      {/* Single Confident Action Button */}
      <div className="mt-8 mb-12 sm:mb-16">
        <button
          onClick={handleExplore}
          className="group px-8 py-3.5 rounded-full bg-stone-900 hover:bg-black text-[#FAF9F5] text-xs sm:text-sm font-medium tracking-wide transition-all shadow-[0_4px_16px_rgba(0,0,0,0.12)] active:scale-95 hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)] inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Explore The Collection</span>
          <span className="text-xs transition-transform group-hover:translate-y-0.5">↓</span>
        </button>
      </div>

      {/* Continuous Dynamic Marquee Track with Warm Editorial Stone Styling */}
      <div className="relative w-full max-w-4xl mx-auto pt-7 border-t border-stone-200/80 overflow-hidden">
        {/* Subtle Left & Right Gradient Fade Masks */}
        <div className="absolute left-0 top-7 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#FAF9F5] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-7 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#FAF9F5] to-transparent z-10 pointer-events-none" />

        {/* Continuous Sliding Track */}
        <div className="flex animate-marquee gap-3 sm:gap-4 select-none py-1">
          {[...TRUST_PILLARS, ...TRUST_PILLARS].map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={`${pillar.title}-${idx}`}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/90 backdrop-blur-xs border border-stone-200/80 shadow-2xs whitespace-nowrap shrink-0 hover:bg-white transition-colors"
              >
                <div className={`p-2 rounded-lg ${pillar.bg} ${pillar.color} shrink-0`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-medium text-stone-900 leading-tight">
                    {pillar.title}
                  </div>
                  <div className="text-[11px] text-stone-500 leading-tight mt-0.5">
                    {pillar.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
