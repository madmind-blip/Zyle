import { NextResponse } from 'next/server';
import { parseProductsCSV, FALLBACK_CSV_RAW } from '@/lib/csvLoader';
import { Product } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

// Reverse fallback items so the bottom of the catalog appears first
const FALLBACK_PRODUCTS: Product[] = [...parseProductsCSV(FALLBACK_CSV_RAW)].reverse();

function parseAndSanitizeCSV(text: string): Product[] {
  const parsed = parseProductsCSV(text);
  if (parsed && parsed.length > 0) {
    return parsed;
  }
  return FALLBACK_PRODUCTS;
}

export async function GET() {
  const csvUrl = process.env.NEXT_PUBLIC_PRODUCTS_CSV_URL;

  try {
    if (!csvUrl) {
      // If no custom CSV URL is configured, return the verified atelier catalog (newest first)
      return NextResponse.json({
        success: true,
        source: 'embedded-catalog',
        count: FALLBACK_PRODUCTS.length,
        products: FALLBACK_PRODUCTS,
      });
    }

    // Fetch with cache-busting timestamp and Next.js revalidation
    const fetchUrl = csvUrl.includes('?') ? `${csvUrl}&t=${Date.now()}` : `${csvUrl}?t=${Date.now()}`;
    const res = await fetch(fetchUrl, {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'text/csv, text/plain, */*',
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch Google Sheet CSV: HTTP ${res.status}`);
    }

    const csvText = await res.text();
    const sanitizedProducts = parseAndSanitizeCSV(csvText);

    // Reverse the array so the last row in Google Sheet becomes index 0 (Newest Drops First)
    const sortedProducts = [...sanitizedProducts].reverse();

    return NextResponse.json({
      success: true,
      source: 'live-sync',
      count: sortedProducts.length,
      products: sortedProducts,
    });
  } catch (error) {
    console.warn('Live CSV fetch failed, falling back to embedded catalog:', error);
    // Return the embedded fallback dataset so the site NEVER crashes (newest first)
    return NextResponse.json({
      success: true,
      source: 'fallback',
      count: FALLBACK_PRODUCTS.length,
      products: FALLBACK_PRODUCTS,
    });
  }
}
