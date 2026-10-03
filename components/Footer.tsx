'use client';

import React from 'react';
import { MessageSquareQuote, ShieldCheck, Mail, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-neutral-300 border-t border-neutral-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-800">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <span className="text-2xl font-bold tracking-tight text-white block">
              ZYLE
            </span>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md leading-relaxed">
              Curated Modern Artifacts for Everyday Living. Connecting design-conscious individuals directly with certified horology workshops, audio labs, and textile ateliers across India and beyond.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Concierge Desk Active: +91 70737 65833</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Curations
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <a href="#catalog-grid" className="hover:text-white transition-colors">
                  Precision Horology & Watches
                </a>
              </li>
              <li>
                <a href="#catalog-grid" className="hover:text-white transition-colors">
                  Smart Audio & Electronics
                </a>
              </li>
              <li>
                <a href="#catalog-grid" className="hover:text-white transition-colors">
                  Atelier Outerwear & Jackets
                </a>
              </li>
              <li>
                <a href="#catalog-grid" className="hover:text-white transition-colors">
                  Minimalist Combos & Gift Sets
                </a>
              </li>
              <li>
                <a href="#catalog-grid" className="hover:text-white transition-colors">
                  Women&apos;s Tailored Edit
                </a>
              </li>
            </ul>
          </div>

          {/* Client Assurance */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Client Assurance
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>7-Day Replacement Guarantee</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>Pan-India Complimentary Express</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>Direct Atelier Quality Control</span>
              </li>
              <li className="pt-2">
                <a
                  href="https://wa.me/917073765833"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <MessageSquareQuote className="w-3.5 h-3.5" />
                  <span>WhatsApp Concierge</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} ZYLE. All rights reserved. Direct-to-Consumer Atelier Fulfillment.</p>
          <div className="flex items-center gap-6">
            <a href="#trust-hub" className="hover:text-neutral-300 transition-colors">
              Fulfillment Model
            </a>
            <a href="#trust-hub" className="hover:text-neutral-300 transition-colors">
              Exchange Policy
            </a>
            <a href="#trust-hub" className="hover:text-neutral-300 transition-colors">
              Shipping Information
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
