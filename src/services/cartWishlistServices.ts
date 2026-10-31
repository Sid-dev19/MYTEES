import type { CartItem, WishlistItem } from "@/types";
import { STORAGE_KEYS } from "@/constants";
import { readStorage, writeStorage } from "@/utils";

// localStorage-backed for now. Later: sync with /cart and /wishlist endpoints.
export const cartService = {
  load: () => readStorage<CartItem[]>(STORAGE_KEYS.cart, []),
  save: (items: CartItem[]) => writeStorage(STORAGE_KEYS.cart, items),
};

export const wishlistService = {
  load: () => readStorage<WishlistItem[]>(STORAGE_KEYS.wishlist, []),
  save: (items: WishlistItem[]) => writeStorage(STORAGE_KEYS.wishlist, items),
};
