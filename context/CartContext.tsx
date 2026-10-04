'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, CustomerDetails } from '@/lib/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size?: string, quantity?: number, customFitNote?: string) => boolean;
  updateQuantity: (itemId: string, newQty: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  activeQuickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  customerDetails: CustomerDetails;
  updateCustomerDetails: (details: Partial<CustomerDetails>) => void;
  subtotalAmount: number;
  shippingAmount: number;
  totalAmount: number;
  totalItems: number;
  formatPrice: (amount: number) => string;
  triggerWhatsAppCheckout: (directItem?: { product: Product; size: string; quantity: number; customFitNote?: string }) => string;
}

const DEFAULT_CUSTOMER_DETAILS: CustomerDetails = {
  name: '',
  phone: '',
  address: '',
  city: '',
  pincode: '',
  paymentPreference: 'Cash on Delivery',
  notes: '',
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>(DEFAULT_CUSTOMER_DETAILS);
  const [isMounted, setIsMounted] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState<Product | null>(null);

  // Safely hydrate from localStorage strictly after initial mount on the client
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedCart = localStorage.getItem('zyle_cart');
        if (savedCart) {
          const parsed: CartItem[] = JSON.parse(savedCart);
          const cleaned = parsed.map(item => ({
            ...item,
            image: item.image || item.product?.image,
            IMAGE: item.IMAGE || item.image || item.product?.image,
            name: item.name || item.product?.name,
            NAME: item.NAME || item.name || item.product?.name,
          }));
          setCart(cleaned);
        }

        const savedWishlist = localStorage.getItem('zyle_wishlist');
        if (savedWishlist) {
          setWishlist(JSON.parse(savedWishlist));
        }

        const savedCust = localStorage.getItem('zyle_customer');
        if (savedCust) {
          setCustomerDetails(JSON.parse(savedCust));
        }
      } catch (e) {
        console.error('Error hydrating state from localStorage', e);
      }
      setIsMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Persist state to localStorage only after mounting
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('zyle_cart', JSON.stringify(cart));
      localStorage.setItem('zyle_wishlist', JSON.stringify(wishlist));
      localStorage.setItem('zyle_customer', JSON.stringify(customerDetails));
    } catch (e) {
      console.error('Error saving state to localStorage', e);
    }
  }, [cart, wishlist, customerDetails, isMounted]);

  // Stock Guard protected addToCart
  const addToCart = (product: Product, size?: string, quantity: number = 1, customFitNote?: string): boolean => {
    const availableStock = product.stock ?? 100;
    if (availableStock <= 0 || product.isOutOfStock || product.inStock === false) {
      console.warn(`[Stock Guard Blocked] Product "${product.name}" is currently sold out.`);
      return false;
    }

    const defaultSize = Array.isArray(product.sizes)
      ? product.sizes[0] || 'Free Size'
      : typeof product.sizes === 'string'
      ? product.sizes.split(',')[0]?.trim() || 'Free Size'
      : 'Free Size';
    const chosenSize = size || defaultSize;
    const cleanFitNote = customFitNote?.trim() || '';
    const itemId = cleanFitNote ? `${product.id}-${chosenSize}-${cleanFitNote.slice(0, 12)}` : `${product.id}-${chosenSize}`;

    setCart(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, availableStock);
        return prev.map(item =>
          item.id === itemId
            ? {
                ...item,
                image: product.image,
                IMAGE: product.image,
                name: product.name,
                NAME: product.name,
                quantity: nextQty,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          image: product.image,
          IMAGE: product.image,
          name: product.name,
          NAME: product.name,
          selectedSize: chosenSize,
          customFitNote: cleanFitNote,
          quantity: Math.min(quantity, availableStock),
        },
      ];
    });

    setIsCartOpen(true);
    return true;
  };

  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const maxStock = item.product?.stock ?? 100;
          return { ...item, quantity: Math.min(newQty, maxStock) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const updateCustomerDetails = (details: Partial<CustomerDetails>) => {
    setCustomerDetails(prev => ({ ...prev, ...details }));
  };

  // Pricing calculations: Flat ₹149 Cash on Delivery shipping fee, ₹0 for UPI/Prepaid
  const subtotalAmount = cart.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);
  const shippingAmount = customerDetails.paymentPreference === 'Cash on Delivery' && subtotalAmount > 0 ? 149 : 0;
  const totalAmount = subtotalAmount + shippingAmount;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Production Order Reference ID Generator: ZYLE-ORD-YYMMDD-XXXX
  const generateOrderId = (): string => {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ZYLE-ORD-${yy}${mm}${dd}-${rand}`;
  };

  const triggerWhatsAppCheckout = (directItem?: {
    product: Product;
    size: string;
    quantity: number;
    customFitNote?: string;
  }): string => {
    const WHATSAPP_NUMBER = '917073765833';
    const orderId = generateOrderId();

    let itemsText = '';
    let grandTotal = 0;
    let shippingChargeText = '';

    const isCod = customerDetails.paymentPreference === 'Cash on Delivery';

    if (directItem) {
      const lineTotal = directItem.product.sellingPrice * directItem.quantity;
      const directShipping = isCod ? 149 : 0;
      grandTotal = lineTotal + directShipping;
      shippingChargeText = isCod ? '₹149 (Cash on Delivery Handling & Insurance)' : 'FREE (Prepaid / UPI Express)';
      const fitNoteLine = directItem.customFitNote ? `\n  - Custom Fit / Note: ${directItem.customFitNote}` : '';
      itemsText = `• ${directItem.product.name}\n  - Size: ${directItem.size}${fitNoteLine}\n  - Qty: ${directItem.quantity}\n  - Price: ${formatPrice(lineTotal)}`;
    } else {
      if (cart.length === 0) return orderId;
      grandTotal = totalAmount;
      shippingChargeText = isCod ? '₹149 (Cash on Delivery Handling & Insurance)' : 'FREE (Prepaid / UPI Express)';
      itemsText = cart
        .map(item => {
          const fitNoteLine = item.customFitNote ? `\n  - Custom Fit / Note: ${item.customFitNote}` : '';
          return `• ${item.name || item.product.name}\n  - Size: ${item.selectedSize}${fitNoteLine}\n  - Qty: ${item.quantity}\n  - Price: ${formatPrice(
            item.product.sellingPrice * item.quantity
          )}`;
        })
        .join('\n\n');
    }

    const custName = customerDetails.name.trim() || '[Customer Name]';
    const custPhone = customerDetails.phone.trim() || '[Phone]';
    const addressParts = [
      customerDetails.address.trim(),
      customerDetails.city.trim(),
      customerDetails.pincode.trim(),
    ].filter(Boolean);
    const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : '[Delivery Address, City, Pincode]';
    const paymentPref = customerDetails.paymentPreference || 'Cash on Delivery';

    // Asynchronously log hot lead to backend database / server route
    try {
      const leadPayload = {
        orderId,
        items: directItem
          ? [
              {
                productId: directItem.product.id,
                name: directItem.product.name,
                size: directItem.size,
                quantity: directItem.quantity,
                price: directItem.product.sellingPrice,
                customFitNote: directItem.customFitNote,
              },
            ]
          : cart.map(item => ({
              productId: item.product.id,
              name: item.name || item.product.name,
              size: item.selectedSize,
              quantity: item.quantity,
              price: item.product.sellingPrice,
              customFitNote: item.customFitNote,
            })),
        customerDetails,
        totalAmount: grandTotal,
        source: directItem ? 'direct_whatsapp' : 'cart_whatsapp',
        timestamp: new Date().toISOString(),
      };

      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload),
      }).catch(err => {
        console.warn('Background lead logging note:', err);
      });
    } catch (err) {
      console.warn('Silent lead logging error:', err);
    }

    // Build WhatsApp message with unique Order Reference
    const message = `*NEW ORDER REQUEST — ZYLE*
*Order Reference:* ${orderId}
───────────────────────────
*Items Ordered:*
${itemsText}

───────────────────────────
*Subtotal:* ${formatPrice(directItem ? directItem.product.sellingPrice * directItem.quantity : subtotalAmount)}
*Delivery Charges:* ${shippingChargeText}
*Total Payable:* ${formatPrice(grandTotal)}
*Payment Mode:* ${paymentPref}

*Customer Details:*
- Name: ${custName}
- Phone: ${custPhone}
- Shipping Address: ${fullAddress}
───────────────────────────
Please confirm availability and dispatch window for ${orderId}.`;

    const encoded = encodeURIComponent(message);
    const targetUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

    if (typeof window !== 'undefined') {
      window.location.href = targetUrl;
    }

    return orderId;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen(prev => !prev),
        activeQuickViewProduct,
        openQuickView: (product: Product) => setActiveQuickViewProduct(product),
        closeQuickView: () => setActiveQuickViewProduct(null),
        wishlist,
        toggleWishlist,
        isInWishlist,
        isWishlistOpen,
        openWishlist: () => setIsWishlistOpen(true),
        closeWishlist: () => setIsWishlistOpen(false),
        customerDetails,
        updateCustomerDetails,
        subtotalAmount,
        shippingAmount,
        totalAmount,
        totalItems,
        formatPrice,
        triggerWhatsAppCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
