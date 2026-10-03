'use client';

import React, { useState, useEffect } from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import ProductModal from '@/components/ProductModal';
import CartDrawer from '@/components/CartDrawer';
import WishlistDrawer from '@/components/WishlistDrawer';
import AccountModal from '@/components/AccountModal';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { parseProductsCSV, FALLBACK_CSV_RAW } from '@/lib/csvLoader';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(() => [...parseProductsCSV(FALLBACK_CSV_RAW)].reverse());
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchVal, setSearchVal] = useState<string>('');

  const { activeQuickViewProduct, openQuickView, closeQuickView } = useCart();

  // Background silent auto-sync from published Google Sheet CSV
  useEffect(() => {
    let isMounted = true;
    const fetchLatest = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.products && Array.isArray(data.products) && data.products.length > 0) {
            setProducts(data.products);
          }
        }
      } catch (e) {
        console.warn('Silent product sync fallback in place:', e);
      }
    };

    fetchLatest();

    // Auto-sync every 60 seconds
    const interval = setInterval(fetchLatest, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleExploreClick = () => {
    const el = document.getElementById('catalog') || document.getElementById('catalog-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-900 overflow-x-hidden">
      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Sticky Glassmorphic Header */}
      <Navbar
        searchValue={searchVal}
        onSearchChange={setSearchVal}
        onCategorySelect={setActiveCategory}
        products={products}
      />

      {/* Hero Banner */}
      <Hero onExploreClick={handleExploreClick} />

      {/* Main Interactive Product Grid & Search */}
      <ProductGrid
        products={products}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onQuickView={openQuickView}
      />

      {/* Dropshipping Fulfillment Trust Hub & FAQ Accordion */}
      <FAQSection />

      {/* Footer */}
      <Footer />

      {/* Product Quick View & Details Modal */}
      <ProductModal
        product={activeQuickViewProduct}
        onClose={closeQuickView}
      />

      {/* Slide-over Shopping Bag & Direct/WhatsApp Checkout Drawer */}
      <CartDrawer />

      {/* Wishlist Drawer */}
      <WishlistDrawer products={products} />

      {/* Client Account & Encrypted Vault Modal */}
      <AccountModal />
    </main>
  );
}
