'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  MapPin,
  RefreshCw,
  LogOut,
  PackageCheck,
  Heart,
  UserCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { PincodeData, UserProfile } from '@/lib/types';
import AuthModal from './AuthModal';
import { CustomerOrder } from '@/app/api/orders/user/route';

interface AccountDashboardProps {
  user: UserProfile;
  onClose: () => void;
}

function AccountDashboardContent({ user, onClose }: AccountDashboardProps) {
  const { updateProfile, verifyPincode, logout } = useAuth();
  const { updateCustomerDetails, openWishlist, wishlist, formatPrice } = useCart();

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<'tracking' | 'address'>('tracking');
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);

  // Address edit state
  const [name, setName] = useState(user.name || '');
  const [address, setAddress] = useState(user.address || '');
  const [pincode, setPincode] = useState(user.pincode || '');
  const [city, setCity] = useState(user.city || '');
  const [stateName, setStateName] = useState(user.state || '');
  const [pincodeStatus, setPincodeStatus] = useState<PincodeData | null>(null);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Fetch orders on mount
  useEffect(() => {
    let isMounted = true;
    const query = new URLSearchParams();
    if (user.email) query.set('email', user.email);
    if (user.phone) query.set('phone', user.phone);

    fetch(`/api/orders/user?${query.toString()}`)
      .then(r => r.json())
      .then(data => {
        if (isMounted && data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
          if (data.orders.length > 0) {
            setSelectedOrder(data.orders[0]);
          }
        }
      })
      .catch(err => console.warn('Could not load orders:', err))
      .finally(() => {
        if (isMounted) setLoadingOrders(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user.email, user.phone]);

  // Handle Indian Pincode Check
  const handlePincodeChange = async (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setPincode(clean);
    setPincodeStatus(null);

    if (clean.length === 6) {
      setIsCheckingPincode(true);
      const res = await verifyPincode(clean);
      setIsCheckingPincode(false);
      setPincodeStatus(res);

      if (res.valid) {
        if (res.district && !city) setCity(res.district);
        if (res.state) setStateName(res.state);
      }
    }
  };

  const handleSaveAddress = () => {
    updateProfile({
      name,
      address,
      pincode,
      city,
      state: stateName,
    });

    updateCustomerDetails({
      name,
      address,
      pincode,
      city,
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2200);
  };

  const handleCopyTracking = (trackingNum: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(trackingNum);
      setCopiedTracking(trackingNum);
      setTimeout(() => setCopiedTracking(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in max-w-full">
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div
        className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-stone-200 relative animate-scale-up max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-[#FAF9F5] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center font-medium text-sm">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-stone-900">
                  {user.name || 'Customer Account'}
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-medium border border-emerald-200/60">
                  <UserCheck className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
              </div>
              <p className="text-xs text-stone-500 font-normal">
                {user.email || `+91 ${user.phone}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-rose-600 hover:border-rose-200 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Sign out of account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-200/50 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-stone-200 px-5 bg-white text-xs font-medium shrink-0">
          <button
            onClick={() => setActiveTab('tracking')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'tracking'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>Order Tracking & Purchases ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('address')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'address'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Shipping Address</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-white">
          {activeTab === 'tracking' ? (
            <div className="space-y-6">
              {loadingOrders ? (
                <div className="py-12 text-center text-xs text-stone-400 flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-stone-400" />
                  <span>Loading your tracking updates...</span>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center text-xs text-stone-500">
                  <PackageCheck className="w-10 h-10 mx-auto mb-2 text-stone-300" />
                  <p className="font-medium text-stone-800 text-sm mb-1">No orders placed yet</p>
                  <p className="text-stone-500 max-w-xs mx-auto">
                    Your orders and live express tracking timelines will automatically appear here once dispatched.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Order Selector Chips if Multiple Orders */}
                  {orders.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {orders.map(order => (
                        <button
                          key={order.orderId}
                          onClick={() => setSelectedOrder(order)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer whitespace-nowrap ${
                            selectedOrder?.orderId === order.orderId
                              ? 'bg-stone-900 text-white border-stone-900'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {order.orderId} • {order.status}
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedOrder && (
                    <div className="space-y-5">
                      {/* Active Order Card */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-200">
                          <div>
                            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
                              Order Identifier
                            </div>
                            <div className="text-base font-bold font-mono text-stone-900">
                              {selectedOrder.orderId}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
                              Estimated Delivery
                            </div>
                            <div className="text-sm font-semibold text-emerald-700">
                              {selectedOrder.estimatedDelivery}
                            </div>
                          </div>
                        </div>

                        {/* Courier & Tracking Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-white border border-stone-200 text-xs mb-4">
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-stone-600 shrink-0" />
                            <span className="text-stone-600">
                              Partner: <strong className="text-stone-900">{selectedOrder.courierPartner}</strong>
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-stone-800 text-[11px]">
                              {selectedOrder.trackingNumber}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyTracking(selectedOrder.trackingNumber)}
                              className="p-1 text-stone-400 hover:text-stone-900 rounded cursor-pointer"
                              title="Copy AWB number"
                            >
                              {copiedTracking === selectedOrder.trackingNumber ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Step-by-Step Interactive Tracking Timeline */}
                        <div className="mt-5">
                          <div className="text-xs font-semibold text-stone-900 mb-3 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-stone-500" />
                            <span>Live Dispatch Timeline</span>
                          </div>

                          <div className="space-y-4 relative pl-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                            {selectedOrder.timeline.map((step, idx) => (
                              <div key={idx} className="relative flex items-start gap-3 text-xs">
                                <span
                                  className={`absolute -left-5 top-0.5 w-3.5 h-3.5 rounded-full border-2 bg-white flex items-center justify-center ${
                                    step.completed
                                      ? 'border-emerald-600 bg-emerald-600'
                                      : 'border-stone-300'
                                  }`}
                                >
                                  {step.completed && <Check className="w-2 h-2 text-white stroke-[3]" />}
                                </span>

                                <div className="flex-1">
                                  <div
                                    className={`font-medium ${
                                      step.current
                                        ? 'text-stone-900 font-bold'
                                        : step.completed
                                        ? 'text-stone-800'
                                        : 'text-stone-400'
                                    }`}
                                  >
                                    {step.title}
                                  </div>
                                  <div className="text-[11px] text-stone-500 mt-0.5">
                                    {step.location} • <span className="tabular-nums">{step.timestamp}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Items Ordered Breakdown */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200">
                        <div className="text-xs font-semibold text-stone-900 mb-3">
                          Items in this Package ({selectedOrder.items.length})
                        </div>

                        <div className="divide-y divide-stone-100">
                          {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="py-2.5 flex items-center gap-3">
                              {item.image && (
                                <div className="relative w-12 h-12 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-100">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    unoptimized
                                    className="object-contain p-1"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-stone-900 truncate">
                                  {item.name}
                                </div>
                                <div className="text-[11px] text-stone-500">
                                  Size: {item.size} • Qty: {item.quantity}
                                </div>
                              </div>
                              <div className="text-xs font-semibold text-stone-900 tabular-nums">
                                {formatPrice(item.price * item.quantity)}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 pt-3 border-t border-stone-100 flex justify-between items-center text-xs">
                          <span className="text-stone-500">Total Paid (Inclusive of all taxes)</span>
                          <span className="text-sm font-bold text-stone-950 tabular-nums">
                            {formatPrice(selectedOrder.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Saved Delivery Address Tab */
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Recipient Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tushar Hota"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Street Address & House / Flat No.
                </label>
                <input
                  type="text"
                  placeholder="Apartment, building, road, landmark"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                />
              </div>

              {/* Indian Postal Pincode Verification */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-stone-700">
                    6-Digit Postal Pincode
                  </label>
                  {isCheckingPincode && (
                    <span className="text-[10px] text-stone-400 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Verifying pincode...
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 400053 or 560001"
                    value={pincode}
                    onChange={e => handlePincodeChange(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900 font-mono"
                  />
                  <MapPin className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {pincodeStatus && (
                  <div className="mt-2 text-xs">
                    {pincodeStatus.valid ? (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="leading-tight text-[11px]">
                          <strong>Verified Postal Hub: </strong>
                          {pincodeStatus.district}, {pincodeStatus.state}
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span className="text-[11px]">{pincodeStatus.error}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    City / District
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Maharashtra"
                    value={stateName}
                    onChange={e => setStateName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveAddress}
                className="w-full py-3 bg-stone-900 hover:bg-black text-white text-xs font-medium rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 mt-3"
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Saved & Synchronized</span>
                  </>
                ) : (
                  <span>Save Shipping Address</span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer: Wishlist Link */}
        <div className="p-3.5 px-5 bg-stone-50 border-t border-stone-200 flex justify-between items-center text-xs shrink-0">
          <span className="text-stone-500">Saved Wishlist</span>
          <button
            onClick={() => {
              onClose();
              openWishlist();
            }}
            className="inline-flex items-center gap-1.5 text-stone-900 hover:text-black font-medium cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>View Items ({wishlist.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AccountModal() {
  const {
    user,
    isAuthenticated,
    isAccountModalOpen,
    closeAccountModal,
  } = useAuth();

  if (!isAccountModalOpen) return null;

  // Unauthenticated -> Show Email + Password Auth Modal
  if (!isAuthenticated || !user) {
    return <AuthModal isOpen={isAccountModalOpen} onClose={closeAccountModal} />;
  }

  // Authenticated -> Show Customer Account & Order Tracking Dashboard
  return <AccountDashboardContent user={user} onClose={closeAccountModal} />;
}
