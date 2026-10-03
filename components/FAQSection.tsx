'use client';

import React, { useState } from 'react';
import { ChevronDown, ShieldCheck, Truck, RefreshCw, MessageSquareQuote, CheckCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "What is ZYLE's fulfillment model?",
    answer:
      "ZYLE is a modern curation platform. We partner directly with verified manufacturing ateliers, specialist horologists, and garment factories across the globe to bring you high-grade essentials without traditional retail markup.",
  },
  {
    question: "How do I place and confirm my order?",
    answer:
      "Simply choose your items and tap \"Checkout via WhatsApp.\" Your order details are transmitted directly to our concierge desk at +91 70737 65833, where our fulfillment team confirms stock and coordinates dispatch directly from the source.",
  },
  {
    question: "What are the shipping timelines?",
    answer:
      "Orders are processed and verified within 24–48 hours. Express pan-India delivery typically takes 4 to 7 business days, complete with real-time consignment tracking sent to your WhatsApp.",
  },
  {
    question: "What is your return and exchange policy?",
    answer:
      "We provide a 7-day hassle-free replacement guarantee for any transit damages, sizing discrepancies, or manufacturing defects. Just message our support line with your unboxing video or photos.",
  },
  {
    question: "Are the prices inclusive of taxes?",
    answer:
      "Yes, all listed prices are all-inclusive with zero hidden checkout fees.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="trust-hub" className="py-16 sm:py-24 bg-white border-t border-neutral-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
            Transparency & Assurance
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F] mb-4">
            The Atelier Fulfillment Standard
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Eliminating intermediate warehouses and retail middlemen. Every artifact is verified and dispatched directly from the source atelier with human concierge oversight.
          </p>
        </div>

        {/* 4 Trust Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12">
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/70 text-center">
            <ShieldCheck className="w-5 h-5 text-neutral-900 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-neutral-900 mb-0.5">Verified Ateliers</h4>
            <p className="text-[11px] text-neutral-500">Zero imitation stock</p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/70 text-center">
            <Truck className="w-5 h-5 text-neutral-900 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-neutral-900 mb-0.5">Pan-India Express</h4>
            <p className="text-[11px] text-neutral-500">Free delivery nationwide</p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/70 text-center">
            <RefreshCw className="w-5 h-5 text-neutral-900 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-neutral-900 mb-0.5">7-Day Guarantee</h4>
            <p className="text-[11px] text-neutral-500">Hassle-free replacement</p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/70 text-center">
            <MessageSquareQuote className="w-5 h-5 text-neutral-900 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-neutral-900 mb-0.5">WhatsApp Concierge</h4>
            <p className="text-[11px] text-neutral-500">+91 70737 65833</p>
          </div>
        </div>

        {/* Accordion List */}
        <div className="divide-y divide-neutral-200 border-y border-neutral-200">
          {FAQ_DATA.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className="py-4 sm:py-5">
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between text-left gap-4 focus:outline-none group"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold text-neutral-900 group-hover:text-neutral-600 transition-colors">
                    {item.question}
                  </span>
                  <div className={`p-1 rounded-full bg-neutral-100 group-hover:bg-neutral-200 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-4 h-4 text-neutral-600" />
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed pr-6 animate-fade-in">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Direct Concierge Prompt */}
        <div className="mt-12 p-6 rounded-2xl bg-neutral-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-1">
              Have a specific question before ordering?
            </h4>
            <p className="text-xs text-neutral-400">
              Our fulfillment desk is active on WhatsApp to share high-resolution videos, live inventory, or sizing advice.
            </p>
          </div>
          <a
            href="https://wa.me/917073765833?text=Hi%20ZYLE%2C%20I%20have%20an%20inquiry%20regarding%20your%20curated%20collection."
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 shrink-0 shadow-sm"
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
