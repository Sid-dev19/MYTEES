export type Gender = "men" | "women" | "unisex";
export type Fit = "Oversized" | "Regular" | "Relaxed";
export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";
export type Mood = "happy" | "chaotic" | "chill" | "bold" | "lazy" | "main-character";

export interface ColorOption {
  name: string;
  hex: string;
}

export interface ProductVariant {
  id: string;
  color: string;
  size: Size;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number;
  discount: number;
  category: string; // category slug
  gender: Gender;
  fit: Fit;
  fabric: string;
  colors: ColorOption[];
  sizes: Size[];
  /** Real image URLs can be dropped in here later. Empty => branded TeeArt fallback. */
  images: string[];
  graphic: string; // text printed on the tee (used by TeeArt)
  mood: Mood;
  collections: string[];
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isBestseller: boolean;
  isLimited?: boolean;
  stock: number;
  variants?: ProductVariant[];
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  accent: string;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  accent: string;
}

export interface CartItem {
  key: string; // productId|size|color
  productId: string;
  size: Size;
  color: string;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  size: Size;
  color: string;
  quantity: number;
  price: number;
}

export type OrderStatus = "PLACED" | "CONFIRMED" | "PACKED" | "SHIPPED" | "OUT FOR DELIVERY" | "DELIVERED";

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  address: Address;
  email: string;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  type: "percent" | "flat";
  value: number;
  minSubtotal: number;
  description: string;
}

export interface ProductQuery {
  gender?: Gender;
  category?: string[];
  collection?: string;
  mood?: string;
  sizes?: Size[];
  colors?: string[];
  fits?: string[];
  fabrics?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  isNew?: boolean;
  isBestseller?: boolean;
  q?: string;
  sort?: SortKey;
}

export type SortKey = "popular" | "newest" | "price-asc" | "price-desc" | "rating";
