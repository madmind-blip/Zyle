import { NextRequest, NextResponse } from 'next/server';
import { OrderLead } from '@/lib/types';

export const dynamic = 'force-dynamic';

// In-memory persistent order leads cache across server lifecycle
const loggedOrders: OrderLead[] = [];

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const orderId: string = data.orderId || `ZYLE-ORD-${Date.now().toString(36).toUpperCase()}`;
    const items = Array.isArray(data.items) ? data.items : [];
    const customerDetails = data.customerDetails || {};
    const totalAmount = Number(data.totalAmount) || 0;
    const source = data.source || 'cart_whatsapp';
    const timestamp = data.timestamp || new Date().toISOString();

    const newLead: OrderLead = {
      orderId,
      items,
      customerDetails,
      totalAmount,
      source,
      timestamp,
    };

    // Store in-memory buffer (kept up to 200 most recent orders)
    loggedOrders.unshift(newLead);
    if (loggedOrders.length > 200) {
      loggedOrders.pop();
    }

    console.log(
      `[ZYLE LEAD LOGGED] Order: ${orderId} | ₹${totalAmount} | Cust: ${customerDetails.name || 'Anonymous'} (${customerDetails.phone || 'N/A'}) | Items: ${items.length} | Source: ${source}`
    );

    return NextResponse.json({
      success: true,
      message: 'Order lead captured successfully',
      orderId,
      loggedAt: timestamp,
    });
  } catch (error) {
    console.error('Failed to log order lead:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid order lead payload' },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    totalLeads: loggedOrders.length,
    recentOrders: loggedOrders.slice(0, 50),
  });
}
