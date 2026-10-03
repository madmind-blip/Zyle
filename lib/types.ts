export interface Product {
  id: string;
  name: string;
  category: string;
  sellingPrice: number;
  originalPrice: number;
  mrp?: number;
  discountPercent: number;
  sizes: string[];
  stock: number;
  inStock: boolean;
  isOutOfStock?: boolean;
  image: string;
  description: string;
  tags: string[];
  specs?: { label: string; value: string }[];
}

export interface CartItem {
  id: string; // unique per item + size combo
  product: Product;
  selectedSize: string;
  customFitNote?: string;
  quantity: number;
  image?: string;
  IMAGE?: string;
  name?: string;
  NAME?: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  paymentPreference: 'Cash on Delivery' | 'UPI / NetBanking' | 'Prepaid';
  notes?: string;
}

export interface OrderLead {
  orderId: string;
  items: {
    productId: string;
    name: string;
    size: string;
    quantity: number;
    price: number;
    customFitNote?: string;
  }[];
  customerDetails: CustomerDetails;
  totalAmount: number;
  source: 'cart_whatsapp' | 'direct_whatsapp' | 'direct_web_checkout';
  timestamp: string;
}

export interface UserProfile {
  phone: string;
  isVerified: boolean;
  name?: string;
  email?: string;
  address?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  verifiedAt?: string;
  savedAddresses?: Array<{
    id: string;
    label: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  }>;
}

export interface PincodeData {
  valid: boolean;
  pincode: string;
  district?: string;
  state?: string;
  division?: string;
  postOffices?: string[];
  error?: string;
}

export type SortOption = 'featured' | 'price-low' | 'price-high' | 'discount';
