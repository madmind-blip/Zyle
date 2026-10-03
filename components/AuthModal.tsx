'use client';

import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const {
    isAccountModalOpen,
    closeAccountModal,
    login,
    register,
    isAuthenticated,
  } = useAuth();
  const { updateCustomerDetails } = useCart();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const active = isOpen !== undefined ? isOpen : isAccountModalOpen;
  const handleClose = onClose || closeAccountModal;

  // If already authenticated and opened via AuthModal directly, close it
  if (!active || isAuthenticated) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    setLoading(true);

    if (mode === 'login') {
      const res = await login(email, password);
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to sign in. Please verify your credentials.');
      } else {
        setSuccessMsg('Signed in successfully!');
        setTimeout(() => handleClose(), 500);
      }
    } else {
      if (!name.trim()) {
        setLoading(false);
        setErrorMsg('Please enter your full name.');
        return;
      }

      const res = await register({ name, email, password, phone });
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to create account.');
      } else {
        setSuccessMsg('Account created successfully!');
        if (phone) {
          updateCustomerDetails({ name, phone });
        }
        setTimeout(() => handleClose(), 500);
      }
    }
  };

  const handleFillDemo = () => {
    setEmail('tushar@zyle.in');
    setPassword('password123');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="fixed inset-0 -z-10" onClick={handleClose} />

      <div
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-stone-200 relative animate-scale-up flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-stone-100 text-stone-900">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-900">
                {mode === 'login' ? 'Customer Sign In' : 'Create Customer Account'}
              </h2>
              <p className="text-[11px] text-stone-500 font-normal">
                Access your orders, live tracking & faster checkout
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-stone-100/70 border-b border-stone-200/80 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Tushar Hota"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs text-stone-900 rounded-xl border border-stone-300 focus:outline-none focus:border-stone-900"
                      required
                    />
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="e.g. 98765 43210"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs text-stone-900 rounded-xl border border-stone-300 focus:outline-none focus:border-stone-900"
                    />
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Used for automated SMS delivery tracking alerts.
                  </p>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs text-stone-900 rounded-xl border border-stone-300 focus:outline-none focus:border-stone-900"
                  required
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-stone-700">
                  Password <span className="text-rose-500">*</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs text-stone-900 rounded-xl border border-stone-300 focus:outline-none focus:border-stone-900"
                  required
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-stone-900 hover:bg-black text-white text-xs font-medium rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm mt-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Account' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Auto-Fill */}
          {mode === 'login' && (
            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500 text-[11px]">Testing demo account:</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="inline-flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-900 font-medium underline cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Auto-fill Demo Login</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
