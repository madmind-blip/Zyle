'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, PincodeData } from '@/lib/types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAccountModalOpen: boolean;
  openAccountModal: () => void;
  closeAccountModal: () => void;
  sendOtp: (phone: string) => Promise<{ success: boolean; demoOtp?: string; error?: string }>;
  verifyOtp: (phone: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (details: Partial<UserProfile>) => void;
  verifyPincode: (pincode: string) => Promise<PincodeData>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Hydrate user from secure local storage
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem('zyle_auth_vault');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.phone && parsed.isVerified) {
            setUser(parsed);
          }
        }
      } catch (e) {
        console.error('Error hydrating auth state:', e);
      }
      setIsMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Persist user to secure local vault
  useEffect(() => {
    if (!isMounted) return;
    try {
      if (user) {
        localStorage.setItem('zyle_auth_vault', JSON.stringify(user));
      } else {
        localStorage.removeItem('zyle_auth_vault');
      }
    } catch (e) {
      console.error('Error persisting auth state:', e);
    }
  }, [user, isMounted]);

  const sendOtp = async (phone: string) => {
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to send OTP' };
      }
      return { success: true, demoOtp: data.demoOtp };
    } catch (err) {
      console.error('Error in sendOtp:', err);
      return { success: false, error: 'Network error communicating with OTP service' };
    }
  };

  const verifyOtp = async (phone: string, otp: string) => {
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', phone, otp }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Invalid OTP code' };
      }

      // Successful verification -> update user state or create profile
      setUser(prev => {
        const updated: UserProfile = {
          phone: data.phone,
          isVerified: true,
          verifiedAt: data.verifiedAt,
          name: prev?.name || '',
          address: prev?.address || '',
          city: prev?.city || '',
          district: prev?.district || '',
          state: prev?.state || '',
          pincode: prev?.pincode || '',
          savedAddresses: prev?.savedAddresses || [],
        };
        return updated;
      });

      return { success: true };
    } catch (err) {
      console.error('Error in verifyOtp:', err);
      return { success: false, error: 'Network error during verification' };
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
        isAuthenticated: Boolean(user && user.isVerified),
        isAccountModalOpen,
        openAccountModal: () => setIsAccountModalOpen(true),
        closeAccountModal: () => setIsAccountModalOpen(false),
        sendOtp,
        verifyOtp,
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
