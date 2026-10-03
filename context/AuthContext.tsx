'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, PincodeData } from '@/lib/types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAccountModalOpen: boolean;
  openAccountModal: () => void;
  closeAccountModal: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (details: Partial<UserProfile>) => void;
  verifyPincode: (pincode: string) => Promise<PincodeData>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('zyle_auth_vault');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.email || parsed.phone)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error hydrating auth state:', e);
    }
    return null;
  });
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Persist user to local storage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('zyle_auth_vault', JSON.stringify(user));
      } else {
        localStorage.removeItem('zyle_auth_vault');
      }
    } catch (e) {
      console.error('Error persisting auth state:', e);
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to sign in' };
      }

      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || '',
        isVerified: true,
        verifiedAt: new Date().toISOString(),
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during sign-in' };
    }
  };

  const register = async (formData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to create account' };
      }

      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || '',
        isVerified: true,
        verifiedAt: new Date().toISOString(),
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during registration' };
    }
  };

  const updateProfile = (details: Partial<UserProfile>) => {
    setUser(prev => {
      if (!prev) return null;
      return { ...prev, ...details };
    });
  };

  const verifyPincode = async (pincode: string): Promise<PincodeData> => {
    try {
      const res = await fetch(`/api/verify-pincode?pincode=${encodeURIComponent(pincode.trim())}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('Pincode verification error:', err);
      return {
        valid: false,
        pincode,
        error: 'Unable to reach postal verification server.',
      };
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('zyle_auth_vault');
    } catch (e) {
      console.error('Error clearing auth vault:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user && (user.email || user.isVerified)),
        isAccountModalOpen,
        openAccountModal: () => setIsAccountModalOpen(true),
        closeAccountModal: () => setIsAccountModalOpen(false),
        login,
        register,
        updateProfile,
        verifyPincode,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
