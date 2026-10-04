import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const csvUrl = process.env.NEXT_PUBLIC_PRODUCTS_CSV_URL;

  if (!csvUrl) {
    return NextResponse.json({
      success: false,
      error: 'NEXT_PUBLIC_PRODUCTS_CSV_URL is missing.',
      products: [],
    }, { status: 500 });
  }

  try {
    const response = await fetch(`${csvUrl}${csvUrl.includes('?') ? '&' : '?'}t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Accept': 'text/csv; charset=utf-8' },
    });

    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

    const csvText = await response.text();
    const parsedProducts = parseGoogleSheetCSV(csvText);

    // Reverse order: newest items added to the bottom of the sheet appear first
    return NextResponse.json({
      success: true,
      count: parsedProducts.length,
      products: parsedProducts.reverse(),
    });
  } catch (error: any) {
    console.error('Catalog fetch error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch catalog',
      products: [],
    }, { status: 500 });
  }
}

// True CSV character-by-character parser (Preserves spaces, quotes, and punctuation)
function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(cleanCell(current));
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(cleanCell(current));
  return fields;
}

function cleanCell(val: string): string {
  return val.replace(/^["']|["']$/g, '').trim();
}

function parseGoogleSheetCSV(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (lines.length < 2) return [];

  // Parse Header row and map column positions
  const rawHeaders = parseCSVLine(lines[0]);
  const headerIndices: Record<string, number> = {};
  rawHeaders.forEach((h, idx) => {
    const cleanHeader = h.toLowerCase().replace(/[^a-z0-9]/g, '');
    headerIndices[cleanHeader] = idx;
  });

  return lines.slice(1).map((line, idx) => {
    const cols = parseCSVLine(line);

    // Multi-alias getter: matches headers regardless of case or spaces in Google Sheets
    const getVal = (aliases: string[]) => {
      for (const alias of aliases) {
        const key = alias.toLowerCase().replace(/[^a-z0-9]/g, '');
        const index = headerIndices[key];
        if (index !== undefined && cols[index] !== undefined && cols[index] !== '') {
          return cols[index];
        }
      }
      return '';
    };

    const name = getVal(['name', 'title', 'productname', 'itemname', 'product', 'item', 'description']);
    const category = getVal(['category', 'cat', 'collection', 'type', 'section']) || 'Curated';

    // Sanitize prices by stripping currency symbols (₹, Rs, commas)
    const parsePrice = (raw: string) => Number(raw.replace(/[^0-9.]/g, '')) || 0;
    const price = parsePrice(getVal(['price', 'sellingprice', 'offerprice', 'rate']));
    const origPrice = parsePrice(getVal(['originalprice', 'mrp', 'regularprice', 'actualprice'])) || price;
    const sellingPrice = price > 0 ? price : origPrice;
    const mrp = origPrice > 0 ? origPrice : sellingPrice;
    const stock = Number(getVal(['stock', 'quantity', 'qty', 'inventory']) || 100);

    return {
      id: getVal(['id']) || `${idx + 1}`,
      name: name || category || 'Curated Piece',
      category: category,
      sellingPrice,
      originalPrice: mrp,
      mrp,
      discountPercent: mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0,
      sizes: getVal(['sizes', 'size', 'availablesizes']) || 'Free Size',
      stock,
      isOutOfStock: stock <= 0,
      image: getVal(['image', 'imageurl', 'img', 'photo', 'picture', 'imagelink']),
      description: getVal(['description', 'desc', 'details', 'about']),
      tags: getVal(['tags', 'tag']),
    };
  }).filter(product => product.image && product.image.startsWith('http'));
}
