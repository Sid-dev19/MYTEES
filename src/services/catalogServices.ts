import { categories, collections } from "@/data/products";
import { coupons, seedReviews } from "@/data/misc";
import { productService } from "./productService";
import type { Coupon, Product, Review } from "@/types";
import { STORAGE_KEYS } from "@/constants";
import { readStorage, uid, wait, writeStorage } from "@/utils";

export const categoryService = {
  list: async () => categories,
  listSync: () => categories,
  getBySlug: (slug: string) => categories.find((c) => c.slug === slug),
};

export const collectionService = {
  list: async () => collections,
  listSync: () => collections,
  getBySlug: (slug: string) => collections.find((c) => c.slug === slug),
};

export const searchService = {
  /** Live suggestions. Later: GET /search/suggest?q= */
  suggest(q: string, limit = 6): Product[] {
    if (!q.trim()) return [];
    return productService.listSync({ q }).slice(0, limit);
  },
};

export const reviewService = {
  list(productId: string): Review[] {
    const mine = readStorage<Review[]>(STORAGE_KEYS.reviews, []).filter((r) => r.productId === productId);
    return [...mine, ...seedReviews.map((r) => ({ ...r, productId }))];
  },
  async add(productId: string, r: Pick<Review, "author" | "rating" | "title" | "body">): Promise<Review> {
    await wait(300);
    const review: Review = { id: uid("r"), productId, createdAt: new Date().toISOString(), ...r };
    writeStorage(STORAGE_KEYS.reviews, [review, ...readStorage<Review[]>(STORAGE_KEYS.reviews, [])]);
    return review;
  },
};

export const couponService = {
  async validate(code: string, subtotal: number): Promise<{ ok: true; coupon: Coupon } | { ok: false; message: string }> {
    await wait(300);
    const c = coupons.find((x) => x.code === code.trim().toUpperCase());
    if (!c) return { ok: false, message: "That code isn't a thing. Try again." };
    if (subtotal < c.minSubtotal) return { ok: false, message: `Add ₹${c.minSubtotal - subtotal} more to use ${c.code}.` };
    return { ok: true, coupon: c };
  },
  discountFor: (c: Coupon | null, subtotal: number) =>
    !c || subtotal < c.minSubtotal ? 0 : Math.min(subtotal, c.type === "percent" ? Math.round((subtotal * c.value) / 100) : c.value),
};
