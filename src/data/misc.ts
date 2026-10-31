import type { Coupon, Review } from "@/types";

export const coupons: Coupon[] = [
  { code: "MYTEES10", type: "percent", value: 10, minSubtotal: 0, description: "10% off your bag" },
  { code: "MOOD200", type: "flat", value: 200, minSubtotal: 1499, description: "₹200 off above ₹1499" },
  { code: "FIRSTDROP", type: "percent", value: 15, minSubtotal: 799, description: "15% off above ₹799" },
];

export const seedReviews: Omit<Review, "productId">[] = [
  { id: "r1", author: "Aarav K.", rating: 5, title: "Fit is unreal", body: "Perfect oversized drop, fabric feels premium and the print hasn't faded after 10 washes.", createdAt: "2026-09-12" },
  { id: "r2", author: "Ishita S.", rating: 5, title: "Main character unlocked", body: "Got so many compliments. Colour is exactly like the pictures.", createdAt: "2026-09-28" },
  { id: "r3", author: "Rohan M.", rating: 4, title: "Great quality", body: "Thick cotton, doesn't go see-through. Size up if you want it baggier.", createdAt: "2026-08-30" },
  { id: "r4", author: "Meera T.", rating: 5, title: "Obsessed", body: "Ordered three more. Delivery was quick and the packaging was cute.", createdAt: "2026-10-05" },
];

export const faqs = [
  { q: "How long does delivery take?", a: "Metro cities: 2–4 business days. Rest of India: 4–7 business days. Free shipping above ₹999." },
  { q: "What's your return policy?", a: "7-day easy returns on unworn tees with tags. Refunds go to your original payment method." },
  { q: "Do you offer Cash on Delivery?", a: "Yes. COD is available on most pincodes. Prepaid orders get an extra 10% off." },
  { q: "How do I pick my size?", a: "Check the Size Guide on any product page. For the oversized look, go true to size. For a snug fit, size down." },
  { q: "How do I track my order?", a: "Head to Track Order and enter your Order ID plus the email or phone used at checkout." },
  { q: "Can I exchange for a different size?", a: "Absolutely. Raise an exchange within 7 days of delivery and we'll swap it free of charge." },
];

export const sizeGuide = [
  { size: "XS", chest: 36, length: 26, shoulder: 16 },
  { size: "S", chest: 38, length: 27, shoulder: 17 },
  { size: "M", chest: 40, length: 28, shoulder: 18 },
  { size: "L", chest: 42, length: 29, shoulder: 19 },
  { size: "XL", chest: 44, length: 30, shoulder: 20 },
  { size: "XXL", chest: 46, length: 31, shoulder: 21 },
];
