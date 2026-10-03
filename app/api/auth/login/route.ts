import { NextResponse } from 'next/server';
import { supabase, isBackendConnected } from '@/lib/supabase';
import { findUserByEmail } from '@/lib/userStore';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user exists in Supabase
    if (isBackendConnected && supabase) {
      const { data: user, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('email', cleanEmail)
        .single();

      if (error || !user || user.password !== password) {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password.' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone || '',
        },
      });
    }

    // In-memory fallback
    const user = findUserByEmail(cleanEmail);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'No account found with this email. Please create an account.' },
        { status: 401 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Incorrect password. Please try again.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Login failed' },
      { status: 500 }
    );
  }
}
