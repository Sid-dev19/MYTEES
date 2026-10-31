import type { Address, Order, OrderItem, OrderStatus, User } from "@/types";
import { STORAGE_KEYS, ORDER_STEPS } from "@/constants";
import { readStorage, uid, wait, writeStorage } from "@/utils";

// All of these use localStorage for now. Later: swap for apiClient calls.

export const authService = {
  getSession: () => readStorage<User | null>(STORAGE_KEYS.user, null),
  async login(email: string, _password: string): Promise<User> {
    await wait(500);
    const user: User = { id: "u1", name: email.split("@")[0].replace(/[._]/g, " "), email };
    writeStorage(STORAGE_KEYS.user, user);
    return user;
  },
  async register(name: string, email: string, _password: string): Promise<User> {
    await wait(600);
    const user: User = { id: uid("u"), name, email };
    writeStorage(STORAGE_KEYS.user, user);
    return user;
  },
  async forgotPassword(_email: string) {
    await wait(500);
    return { ok: true };
  },
  logout: () => writeStorage(STORAGE_KEYS.user, null),
  updateProfile(patch: Partial<User>): User | null {
    const u = readStorage<User | null>(STORAGE_KEYS.user, null);
    if (!u) return null;
    const next = { ...u, ...patch };
    writeStorage(STORAGE_KEYS.user, next);
    return next;
  },
};

export const addressService = {
  list: () => readStorage<Address[]>(STORAGE_KEYS.addresses, []),
  save(a: Omit<Address, "id">): Address {
    const list = addressService.list();
    const addr: Address = { ...a, id: uid("addr"), isDefault: list.length === 0 };
    writeStorage(STORAGE_KEYS.addresses, [...list, addr]);
    return addr;
  },
  remove(id: string) {
    writeStorage(STORAGE_KEYS.addresses, addressService.list().filter((a) => a.id !== id));
  },
};

export const orderService = {
  list: () => readStorage<Order[]>(STORAGE_KEYS.orders, []),
  get: (id: string) => orderService.list().find((o) => o.id === id),
  async place(data: {
    items: OrderItem[]; subtotal: number; discount: number; shipping: number; total: number;
    address: Address; email: string; paymentMethod: string;
  }): Promise<Order> {
    await wait(900);
    const eta = new Date(Date.now() + 5 * 86400000).toISOString();
    const order: Order = {
      ...data,
      id: `MYT${Math.floor(100000 + Math.random() * 900000)}`,
      status: "PLACED",
      createdAt: new Date().toISOString(),
      estimatedDelivery: eta,
    };
    writeStorage(STORAGE_KEYS.orders, [order, ...orderService.list()]);
    return order;
  },
  /** Mock tracking: status advances with order age so the timeline demos nicely. */
  async track(id: string, contact: string): Promise<{ order: Order; status: OrderStatus } | null> {
    await wait(600);
    const order = orderService.get(id.trim().toUpperCase());
    if (!order) return null;
    const c = contact.trim().toLowerCase();
    if (c && c !== order.email.toLowerCase() && c !== order.address.phone) return null;
    const hrs = (Date.now() - +new Date(order.createdAt)) / 3600000;
    const idx = Math.min(ORDER_STEPS.length - 1, Math.floor(hrs / 6) + 1);
    return { order, status: ORDER_STEPS[Math.max(1, idx)] };
  },
};
