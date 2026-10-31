"use client";
import { create } from "zustand";
import type { CartItem, Coupon, Size, SortKey, User, WishlistItem } from "@/types";
import { cartService, wishlistService } from "@/services/cartWishlistServices";
import { authService } from "@/services/accountServices";
import { productService } from "@/services/productService";
import { couponService } from "@/services/catalogServices";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/constants";
import { haptic } from "@/utils";

export interface Toast { id: number; message: string }

interface State {
  hydrated: boolean;
  cart: CartItem[];
  wishlist: WishlistItem[];
  user: User | null;
  coupon: Coupon | null;
  // UI
  cartOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  toasts: Toast[];
  // actions
  hydrate: () => void;
  addToCart: (productId: string, size: Size, color: string, qty?: number) => void;
  removeFromCart: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  setUser: (u: User | null) => void;
  setCoupon: (c: Coupon | null) => void;
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  setMenuOpen: (v: boolean) => void;
  toast: (message: string) => void;
  dismissToast: (id: number) => void;
}

let toastId = 0;

export const useStore = create<State>((set, get) => ({
  hydrated: false,
  cart: [],
  wishlist: [],
  user: null,
  coupon: null,
  cartOpen: false,
  searchOpen: false,
  menuOpen: false,
  toasts: [],

  hydrate: () => {
    if (get().hydrated) return;
    set({ cart: cartService.load(), wishlist: wishlistService.load(), user: authService.getSession(), hydrated: true });
  },

  addToCart: (productId, size, color, qty = 1) => {
    const key = `${productId}|${size}|${color}`;
    const cart = [...get().cart];
    const i = cart.findIndex((c) => c.key === key);
    if (i >= 0) cart[i] = { ...cart[i], quantity: Math.min(10, cart[i].quantity + qty) };
    else cart.push({ key, productId, size, color, quantity: qty });
    cartService.save(cart);
    set({ cart });
    haptic([12, 30, 12]);
    get().toast("Added to your rotation 🔥");
  },
  removeFromCart: (key) => {
    const cart = get().cart.filter((c) => c.key !== key);
    cartService.save(cart);
    set({ cart });
  },
  setQty: (key, qty) => {
    const cart = get().cart.map((c) => (c.key === key ? { ...c, quantity: Math.max(1, Math.min(10, qty)) } : c));
    cartService.save(cart);
    set({ cart });
  },
  clearCart: () => {
    cartService.save([]);
    set({ cart: [], coupon: null });
  },

  toggleWishlist: (productId) => {
    const has = get().wishlist.some((w) => w.productId === productId);
    const wishlist = has
      ? get().wishlist.filter((w) => w.productId !== productId)
      : [{ productId, addedAt: new Date().toISOString() }, ...get().wishlist];
    wishlistService.save(wishlist);
    set({ wishlist });
    haptic(has ? 8 : [10, 40, 10]);
    get().toast(has ? "Removed from wishlist" : "Saved to your future outfits ❤️");
  },

  setUser: (user) => set({ user }),
  setCoupon: (coupon) => set({ coupon }),
  setCartOpen: (cartOpen) => set({ cartOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),

  toast: (message) => {
    const id = ++toastId;
    set({ toasts: [...get().toasts.slice(-2), { id, message }] });
    setTimeout(() => get().dismissToast(id), 2600);
  },
  dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));

/** Derived cart totals. Pass the cart + coupon; computed from catalog prices. */
export function computeTotals(cart: CartItem[], coupon: Coupon | null) {
  const lines = cart
    .map((c) => ({ item: c, product: productService.getByIdsSync([c.productId])[0] }))
    .filter((l) => l.product);
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.item.quantity, 0);
  const mrp = lines.reduce((s, l) => s + l.product.compareAtPrice * l.item.quantity, 0);
  const discount = couponService.discountFor(coupon, subtotal);
  const after = subtotal - discount;
  const shipping = lines.length === 0 || after >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return { lines, subtotal, mrp, savings: mrp - subtotal, discount, shipping, total: after + shipping, count: cart.reduce((n, c) => n + c.quantity, 0) };
}

export type { SortKey };
