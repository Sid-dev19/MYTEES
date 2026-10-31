import type { Size, SortKey } from "@/types";

export const SITE = {
  name: "MYTEES",
  tagline: "WEAR YOUR MOOD.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://mytees.in",
  description: "Premium tees for people who don't do boring. Oversized, graphic and streetwear T-shirts from India.",
};

export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_FEE = 79;
export const PREPAID_DISCOUNT_PERCENT = 10;

export const SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating", label: "Top Rated" },
];

export const NAV_LINKS = [
  { label: "MEN", href: "/men" },
  { label: "WOMEN", href: "/women" },
  { label: "T-SHIRTS", href: "/t-shirts" },
  { label: "NEW ARRIVALS", href: "/new-arrivals" },
  { label: "BESTSELLERS", href: "/bestsellers" },
  { label: "COLLECTIONS", href: "/collections/main-character-energy" },
];

export const ANNOUNCEMENTS = [
  "NEW DROP JUST LANDED ✦",
  "FREE SHIPPING ABOVE ₹999",
  "10% OFF ON PREPAID ORDERS",
  "NO BORING TEES ALLOWED 😎",
  "YOUR NEXT FAVORITE TEE IS HERE.",
];

export const POPULAR_SEARCHES = ["Oversized", "Graphic", "Black", "White", "Streetwear"];

export const ORDER_STEPS = ["PLACED", "CONFIRMED", "PACKED", "SHIPPED", "OUT FOR DELIVERY", "DELIVERED"] as const;

export const STORAGE_KEYS = {
  cart: "mytees.cart.v1",
  wishlist: "mytees.wishlist.v1",
  user: "mytees.user.v1",
  orders: "mytees.orders.v1",
  addresses: "mytees.addresses.v1",
  recent: "mytees.recent.v1",
  reviews: "mytees.reviews.v1",
  coupon: "mytees.coupon.v1",
};
