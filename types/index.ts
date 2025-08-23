export interface User {
  id: string;
  name?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  sale_price?: number; // Supabase field name
  images: string[];
  categoryId: string;
  category_id?: string; // Supabase field name
  tags: string[];
  dimensions: {
    width: number;
    height: number;
  };
  materials: string[];
  inStock: boolean;
  in_stock?: boolean; // Supabase field name
  stockCount: number;
  stock_count?: number; // Supabase field name
  rating: number;
  reviewCount: number;
  review_count?: number; // Supabase field name
  featured: boolean;
  sizes: string[];
  frames: string[];
  createdAt: Date;
  created_at?: string; // Supabase field name
  updatedAt: Date;
  updated_at?: string; // Supabase field name
  category?: Category;
  reviews?: Review[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
  createdAt: Date;
  updatedAt: Date;
  products?: Product[];
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  userId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  product?: Product;
}

export interface Order {
  id: string;
  userId?: string;
  guestEmail?: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  promoCode?: string;
  shippingAddress: Address;
  billingAddress: Address;
  paymentIntent?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  orderItems?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  size: string;
  frame?: string;
  options?: any;
  order?: Order;
  product?: Product;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  frame: string;
  product?: Product;
  options?: any;
  user?: User;
  product?: Product;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: Date;
  user?: User;
  product?: Product;
}

export interface Address {
  id: string;
  userId: string;
  type: AddressType;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface Newsletter {
  id: string;
  email: string;
  active: boolean;
  createdAt: Date;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum AddressType {
  SHIPPING = 'SHIPPING',
  BILLING = 'BILLING',
}

export interface FilterOptions {
  category?: string;
  priceRange?: [number, number];
  size?: string[];
  colorScheme?: string[];
  materials?: string[];
  inStock?: boolean;
}

export interface SortOptions {
  field: 'price' | 'rating' | 'createdAt' | 'name';
  direction: 'asc' | 'desc';
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  saveAddress?: boolean;
  useShippingForBilling?: boolean;
  billingAddress?: Omit<CheckoutFormData, 'saveAddress' | 'useShippingForBilling' | 'billingAddress'>;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  expMonth?: number;
  expYear?: number;
}
