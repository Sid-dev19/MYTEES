export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export const formatPrice = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage may be unavailable (private mode) */
  }
}

export const wait = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms));

export const uid = (prefix = "id") => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

/** Readable text colour for a given hex background. */
export function readableOn(hex: string) {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#0B0B0F" : "#FFFFFF";
}
