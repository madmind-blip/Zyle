import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface TrackingEvent {
  title: string;
  timestamp: string;
  location: string;
  completed: boolean;
  current?: boolean;
}

export interface CustomerOrder {
  orderId: string;
  date: string;
  status: 'Order Placed' | 'Verified & Packed' | 'Dispatched via Express Courier' | 'Out for Delivery' | 'Delivered';
  statusCode: number; // 1 to 5
  totalAmount: number;
  items: Array<{
    name: string;
    size: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  courierPartner: string;
  trackingNumber: string;
  estimatedDelivery: string;
  timeline: TrackingEvent[];
}

// Generate realistic dynamic tracking timeline for an order
export function generateTimeline(orderDate: Date, statusCode: number): TrackingEvent[] {
  const formatTime = (d: Date) =>
    d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) +
    ' • ' +
    d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const d1 = new Date(orderDate.getTime());
  const d2 = new Date(orderDate.getTime() + 4 * 3600 * 1000);
  const d3 = new Date(orderDate.getTime() + 18 * 3600 * 1000);
  const d4 = new Date(orderDate.getTime() + 38 * 3600 * 1000);
  const d5 = new Date(orderDate.getTime() + 48 * 3600 * 1000);

  return [
    {
      title: 'Order Confirmed & Payment Verified',
      timestamp: formatTime(d1),
      location: 'ZYLE Fulfillment Center, Mumbai Hub',
      completed: statusCode >= 1,
      current: statusCode === 1,
    },
    {
      title: 'Pre-Inspected & Custom Boxed',
      timestamp: formatTime(d2),
      location: 'Quality Inspection Desk, Mumbai',
      completed: statusCode >= 2,
      current: statusCode === 2,
    },
    {
      title: 'Handed Over to Express Air Courier',
      timestamp: formatTime(d3),
      location: 'Air Cargo Facility, BOM Terminal 2',
      completed: statusCode >= 3,
      current: statusCode === 3,
    },
    {
      title: 'Arrived at Destination City Hub',
      timestamp: formatTime(d4),
      location: 'Regional Sorting Facility',
      completed: statusCode >= 4,
      current: statusCode === 4,
    },
    {
      title: 'Out for Delivery to Your Doorstep',
      timestamp: formatTime(d5),
      location: 'Local Delivery Station',
      completed: statusCode >= 5,
      current: statusCode === 5,
    },
  ];
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email')?.toLowerCase().trim() || '';
    const phone = searchParams.get('phone')?.trim() || '';

    // Sample default orders for showcase
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 3600 * 1000);
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 3600 * 1000);

    const sampleOrders: CustomerOrder[] = [
      {
        orderId: 'ZY-88241',
        date: twoDaysAgo.toISOString(),
        status: 'Dispatched via Express Courier',
        statusCode: 3,
        totalAmount: 3499,
        items: [
          {
            name: 'Monochrome Steel Chronograph (White Dial)',
            size: 'Free Size',
            quantity: 1,
            price: 2499,
            image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80',
          },
          {
            name: 'Heavyweight Ribbed Cotton Tee (Oatmeal)',
            size: 'L',
            quantity: 1,
            price: 1000,
            image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
          },
        ],
        shippingAddress: {
          name: email ? email.split('@')[0] : 'Tushar Hota',
          phone: phone || '+91 98765 43210',
          address: '402, Signature Palms, Green Avenue',
          city: 'Mumbai',
          pincode: '400053',
        },
        courierPartner: 'BlueDart Air Express',
        trackingNumber: 'BD-EXP-8891041IN',
        estimatedDelivery: new Date(now.getTime() + 1 * 24 * 3600 * 1000).toLocaleDateString('en-IN', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
        timeline: generateTimeline(twoDaysAgo, 3),
      },
      {
        orderId: 'ZY-77109',
        date: fiveDaysAgo.toISOString(),
        status: 'Delivered',
        statusCode: 5,
        totalAmount: 1899,
        items: [
          {
            name: 'Tactile Matte Studio Headphones',
            size: 'Standard',
            quantity: 1,
            price: 1899,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
          },
        ],
        shippingAddress: {
          name: email ? email.split('@')[0] : 'Tushar Hota',
          phone: phone || '+91 98765 43210',
          address: '402, Signature Palms, Green Avenue',
          city: 'Mumbai',
          pincode: '400053',
        },
        courierPartner: 'Delhivery Express',
        trackingNumber: 'DL-AIR-3301982IN',
        estimatedDelivery: 'Delivered on ' + fiveDaysAgo.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        timeline: generateTimeline(fiveDaysAgo, 5),
      },
    ];

    return NextResponse.json({
      success: true,
      orders: sampleOrders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch customer orders' }, { status: 500 });
  }
}
