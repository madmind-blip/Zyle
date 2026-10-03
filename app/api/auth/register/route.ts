import { NextResponse } from 'next/server';
import { supabase, isBackendConnected } from '@/lib/supabase';
import { findUserByEmail, saveUser } from '@/lib/userStore';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user exists in Supabase if configured
    if (isBackendConnected && supabase) {
      const { data: existing } = await supabase
        .from('customer_profiles')
        .select('email')
        .eq('email', cleanEmail)
        .single();

      if (existing) {
        return NextResponse.json(
          { success: false, error: 'An account with this email already exists.' },
          { status: 400 }
        );
      }

      const { data, error } = await supabase
        .from('customer_profiles')
        .insert([
          {
            email: cleanEmail,
            name: name.trim(),
            phone: phone?.trim() || '',
            password: password,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({
        success: true,
        user: { id: data.id, email: cleanEmail, name: name.trim(), phone: phone?.trim() || '' },
      });
    }

    // In-memory / Server fallback
    const existing = findUserByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists. Please log in.' },
        { status: 400 }
      );
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone?.trim() || '',
      password: password,
      createdAt: new Date().toISOString(),
    };

    saveUser(newUser);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
