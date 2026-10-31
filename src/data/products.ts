import type { Category, Collection, ColorOption, Fit, Gender, Mood, Product, Size } from "@/types";
import { SIZES } from "@/constants";

export const COLOR_MAP: Record<string, ColorOption> = {
  Black: { name: "Black", hex: "#0B0B0F" },
  White: { name: "White", hex: "#FFFFFF" },
  Cream: { name: "Cream", hex: "#F5E9CF" },
  Purple: { name: "Purple", hex: "#6C2BFF" },
  Pink: { name: "Pink", hex: "#FF2E93" },
  Lime: { name: "Lime", hex: "#C6FF3D" },
  Orange: { name: "Orange", hex: "#FF6B1A" },
  Blue: { name: "Blue", hex: "#1F4BFF" },
  Cyan: { name: "Cyan", hex: "#27E1F5" },
  Yellow: { name: "Yellow", hex: "#FFD81F" },
  Grey: { name: "Grey", hex: "#A8A8B3" },
  Sand: { name: "Sand", hex: "#C9AE8A" },
};

export const categories: Category[] = [
  { id: "c1", slug: "oversized", name: "Oversized", tagline: "Roomy. Relaxed. Rule-breaking.", accent: "#FF2E93" },
  { id: "c2", slug: "graphic", name: "Graphic", tagline: "Prints that talk first.", accent: "#C6FF3D" },
  { id: "c3", slug: "minimal", name: "Minimal", tagline: "Quiet flex energy.", accent: "#27E1F5" },
  { id: "c4", slug: "street", name: "Street", tagline: "Built for the block.", accent: "#FF6B1A" },
  { id: "c5", slug: "everyday", name: "Everyday", tagline: "Your daily go-to.", accent: "#FFD81F" },
  { id: "c6", slug: "premium-cotton", name: "Premium Cotton", tagline: "Softer than your ex's apology.", accent: "#6C2BFF" },
];

export const collections: Collection[] = [
  { id: "col1", slug: "main-character-energy", name: "Main Character Energy", tagline: "You're the lead. Dress like it.", description: "Loud prints, louder confidence.", accent: "#6C2BFF" },
  { id: "col2", slug: "off-duty-uniform", name: "Off-Duty Uniform", tagline: "Weekend-ready, always.", description: "Easy tees for the days with no plans.", accent: "#C6FF3D" },
  { id: "col3", slug: "graphic-attack", name: "Graphic Attack", tagline: "Prints with opinions.", description: "Bold graphics for bold people.", accent: "#FF6B1A" },
  { id: "col4", slug: "after-hours", name: "After Hours", tagline: "Made for the late ones.", description: "Dark tones, neon moods.", accent: "#1F4BFF" },
];

export const moods: { slug: Mood; label: string; emoji: string; color: string; text: string; line: string }[] = [
  { slug: "happy", label: "HAPPY", emoji: ":)", color: "#FFD81F", text: "#0B0B0F", line: "Good vibes only." },
  { slug: "chaotic", label: "CHAOTIC", emoji: "⚡", color: "#FF2E93", text: "#0B0B0F", line: "Organised mess." },
  { slug: "chill", label: "CHILL", emoji: "~", color: "#27E1F5", text: "#0B0B0F", line: "Zero rush." },
  { slug: "bold", label: "BOLD", emoji: "★", color: "#FF6B1A", text: "#0B0B0F", line: "Turn it up." },
  { slug: "lazy", label: "LAZY", emoji: "zZ", color: "#C6FF3D", text: "#0B0B0F", line: "Bed is calling." },
  { slug: "main-character", label: "MAIN CHARACTER", emoji: "✦", color: "#6C2BFF", text: "#FFFFFF", line: "Cue the spotlight." },
];

type Seed = {
  name: string; graphic: string; price: number; compare: number; category: string; gender: Gender; fit: Fit;
  fabric: string; colors: string[]; mood: Mood; cols: string[]; rating: number; reviews: number;
  isNew?: boolean; best?: boolean; limited?: boolean; stock?: number; days: number;
};

const seeds: Seed[] = [
  { name: "Essential Oversized Black Tee", graphic: "ESSENTIAL", price: 599, compare: 799, category: "oversized", gender: "unisex", fit: "Oversized", fabric: "240 GSM Cotton", colors: ["Black", "White", "Grey"], mood: "chill", cols: ["off-duty-uniform"], rating: 4.8, reviews: 412, best: true, days: 90 },
  { name: "Midnight Graphic Tee", graphic: "MIDNIGHT", price: 649, compare: 899, category: "graphic", gender: "men", fit: "Oversized", fabric: "240 GSM Cotton", colors: ["Black", "Purple", "Blue"], mood: "bold", cols: ["after-hours", "graphic-attack"], rating: 4.7, reviews: 233, isNew: true, days: 4 },
  { name: "Off-Duty Cream Tee", graphic: "OFF DUTY", price: 549, compare: 749, category: "everyday", gender: "unisex", fit: "Regular", fabric: "Combed Cotton", colors: ["Cream", "Sand", "White"], mood: "lazy", cols: ["off-duty-uniform"], rating: 4.6, reviews: 187, days: 60 },
  { name: "Street Code Oversized Tee", graphic: "STREET CODE", price: 699, compare: 999, category: "street", gender: "men", fit: "Oversized", fabric: "260 GSM Heavy Cotton", colors: ["Black", "Grey", "Orange"], mood: "bold", cols: ["graphic-attack"], rating: 4.9, reviews: 521, best: true, days: 70 },
  { name: "Minimal Logo White Tee", graphic: "MYTEES", price: 449, compare: 649, category: "minimal", gender: "unisex", fit: "Regular", fabric: "Combed Cotton", colors: ["White", "Black", "Cream"], mood: "chill", cols: ["off-duty-uniform"], rating: 4.5, reviews: 301, days: 120 },
  { name: "Chaos Club Oversized Tee", graphic: "CHAOS CLUB", price: 599, compare: 799, category: "graphic", gender: "unisex", fit: "Oversized", fabric: "240 GSM Cotton", colors: ["Black", "Purple", "White", "Sand"], mood: "chaotic", cols: ["graphic-attack", "main-character-energy"], rating: 4.8, reviews: 120, isNew: true, best: true, days: 2 },
  { name: "Main Character Tee", graphic: "MAIN CHARACTER", price: 649, compare: 899, category: "graphic", gender: "women", fit: "Oversized", fabric: "240 GSM Cotton", colors: ["Purple", "Pink", "White"], mood: "main-character", cols: ["main-character-energy"], rating: 4.9, reviews: 342, best: true, days: 45 },
  { name: "After Hours Tee", graphic: "AFTER HOURS", price: 649, compare: 899, category: "graphic", gender: "unisex", fit: "Oversized", fabric: "240 GSM Cotton", colors: ["Purple", "Black", "Blue"], mood: "chaotic", cols: ["after-hours"], rating: 4.7, reviews: 98, isNew: true, days: 6 },
  { name: "Retro Wave Tee", graphic: "RETRO WAVE", price: 599, compare: 849, category: "graphic", gender: "women", fit: "Regular", fabric: "Combed Cotton", colors: ["Pink", "Cyan", "White"], mood: "happy", cols: ["main-character-energy"], rating: 4.6, reviews: 144, days: 50 },
  { name: "No Signal Graphic Tee", graphic: "NO SIGNAL", price: 699, compare: 999, category: "graphic", gender: "men", fit: "Oversized", fabric: "260 GSM Heavy Cotton", colors: ["Black", "Yellow", "Grey"], mood: "chaotic", cols: ["graphic-attack", "after-hours"], rating: 4.8, reviews: 276, best: true, days: 30 },
  { name: "Weekend Uniform Tee", graphic: "WEEKEND", price: 499, compare: 699, category: "everyday", gender: "unisex", fit: "Relaxed", fabric: "Combed Cotton", colors: ["Grey", "Sand", "Cream"], mood: "lazy", cols: ["off-duty-uniform"], rating: 4.4, reviews: 210, days: 100 },
  { name: "Good Vibes Tee", graphic: "GOOD VIBES", price: 549, compare: 799, category: "graphic", gender: "women", fit: "Regular", fabric: "Combed Cotton", colors: ["White", "Yellow", "Orange"], mood: "happy", cols: ["main-character-energy"], rating: 4.7, reviews: 167, days: 40 },
  { name: "Smiley Riot Oversized Tee", graphic: ":) RIOT", price: 649, compare: 899, category: "oversized", gender: "unisex", fit: "Oversized", fabric: "240 GSM Cotton", colors: ["Yellow", "Black", "Lime"], mood: "happy", cols: ["graphic-attack"], rating: 4.8, reviews: 89, isNew: true, days: 3 },
  { name: "Lazy Sunday Tee", graphic: "LAZY SUNDAY", price: 449, compare: 599, category: "everyday", gender: "unisex", fit: "Relaxed", fabric: "Bio-washed Cotton", colors: ["Cyan", "Cream", "Grey"], mood: "lazy", cols: ["off-duty-uniform"], rating: 4.3, reviews: 134, days: 80 },
  { name: "Loud Pack Oversized Tee", graphic: "LOUD PACK", price: 749, compare: 1099, category: "oversized", gender: "men", fit: "Oversized", fabric: "260 GSM Heavy Cotton", colors: ["Orange", "Black", "Blue"], mood: "bold", cols: ["graphic-attack"], rating: 4.6, reviews: 76, limited: true, stock: 14, isNew: true, days: 5 },
  { name: "Pima Soft Premium Tee", graphic: "PIMA", price: 799, compare: 1199, category: "premium-cotton", gender: "men", fit: "Regular", fabric: "100% Pima Cotton", colors: ["White", "Black", "Sand"], mood: "chill", cols: ["off-duty-uniform"], rating: 4.9, reviews: 156, days: 35 },
  { name: "Cloud Nine Premium Tee", graphic: "CLOUD 9", price: 849, compare: 1249, category: "premium-cotton", gender: "women", fit: "Relaxed", fabric: "Supima Cotton", colors: ["Cyan", "White", "Pink"], mood: "chill", cols: ["off-duty-uniform"], rating: 4.8, reviews: 92, days: 25 },
  { name: "Night Shift Street Tee", graphic: "NIGHT SHIFT", price: 699, compare: 949, category: "street", gender: "men", fit: "Oversized", fabric: "260 GSM Heavy Cotton", colors: ["Black", "Blue", "Grey"], mood: "bold", cols: ["after-hours"], rating: 4.7, reviews: 143, days: 28 },
  { name: "Hot Girl Walk Tee", graphic: "HOT GIRL WALK", price: 599, compare: 799, category: "graphic", gender: "women", fit: "Regular", fabric: "Combed Cotton", colors: ["Pink", "White", "Lime"], mood: "main-character", cols: ["main-character-energy"], rating: 4.8, reviews: 258, best: true, days: 20 },
  { name: "Quiet Minimal Black Tee", graphic: "QUIET", price: 499, compare: 699, category: "minimal", gender: "women", fit: "Regular", fabric: "Combed Cotton", colors: ["Black", "Cream", "Grey"], mood: "chill", cols: ["off-duty-uniform"], rating: 4.5, reviews: 118, days: 75 },
  { name: "Block Party Street Tee", graphic: "BLOCK PARTY", price: 649, compare: 899, category: "street", gender: "unisex", fit: "Oversized", fabric: "240 GSM Cotton", colors: ["Lime", "Black", "Orange"], mood: "bold", cols: ["graphic-attack"], rating: 4.6, reviews: 101, days: 22 },
  { name: "Glitch Mode Tee", graphic: "GLITCH MODE", price: 699, compare: 999, category: "graphic", gender: "men", fit: "Oversized", fabric: "240 GSM Cotton", colors: ["Blue", "Black", "Cyan"], mood: "chaotic", cols: ["after-hours", "graphic-attack"], rating: 4.7, reviews: 84, isNew: true, limited: true, stock: 9, days: 1 },
  { name: "Daydream Everyday Tee", graphic: "DAYDREAM", price: 399, compare: 549, category: "everyday", gender: "women", fit: "Regular", fabric: "Combed Cotton", colors: ["Yellow", "Sand", "White"], mood: "happy", cols: ["off-duty-uniform"], rating: 4.4, reviews: 192, days: 110 },
  { name: "Plot Twist Oversized Tee", graphic: "PLOT TWIST", price: 649, compare: 899, category: "oversized", gender: "women", fit: "Oversized", fabric: "240 GSM Cotton", colors: ["Purple", "Cream", "Black"], mood: "main-character", cols: ["main-character-energy"], rating: 4.9, reviews: 61, isNew: true, days: 7 },
];

// Stock photography (Unsplash) used until real MYTEES shoots are available.
// Replace by editing `images` on a product, or point these helpers at your CDN.
const U = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&h=1125&q=80`;
const PHOTO = {
  blackMen: ["1503341504253-dff4815485f1", "1583743814966-8936f5b7be1a", "1576566588028-4147f3842f27", "1618354691373-d851c5c3a990"],
  blackWomen: ["1529374255404-311a2a4f1fd9", "1583743814966-8936f5b7be1a", "1618354691373-d851c5c3a990", "1503341504253-dff4815485f1"],
  lightMen: ["1503342217505-b0a15ec3261c", "1521572163474-6864f9cf17ab", "1622445275463-afa2ab738c34", "1562157873-818bc0726f68"],
  lightWomen: ["1581655353564-df123a1eb820", "1571945153237-4929e783af4a", "1622445275463-afa2ab738c34", "1529374255404-311a2a4f1fd9"],
};
const DARK = new Set(["Black", "Purple", "Blue"]);
function photosFor(gender: Gender, firstColor: string, i: number): string[] {
  const key = `${DARK.has(firstColor) ? "black" : "light"}${gender === "women" ? "Women" : "Men"}` as keyof typeof PHOTO;
  const pool = PHOTO[key];
  return pool.map((_, k) => U(pool[(i + k) % pool.length]));
}

const slugify =(s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const DAY = 86400000;
const BASE_DATE = Date.UTC(2026, 9, 30);

export const products: Product[] = seeds.map((s, i) => {
  const colors = s.colors.map((c) => COLOR_MAP[c]);
  const sizes: Size[] = SIZES;
  const slug = slugify(s.name);
  return {
    id: `p${i + 1}`,
    slug,
    name: s.name,
    description: `${s.name} — a ${s.fit.toLowerCase()} fit tee built for people who don't do boring. Super soft, prints that don't fade, and a drape that just works with everything you own.`,
    price: s.price,
    compareAtPrice: s.compare,
    discount: Math.round(((s.compare - s.price) / s.compare) * 100),
    category: s.category,
    gender: s.gender,
    fit: s.fit,
    fabric: s.fabric,
    colors,
    sizes,
    images: photosFor(s.gender, s.colors[0], i),
    graphic: s.graphic,
    mood: s.mood,
    collections: s.cols,
    rating: s.rating,
    reviewCount: s.reviews,
    isNew: !!s.isNew,
    isBestseller: !!s.best,
    isLimited: s.limited,
    stock: s.stock ?? 120,
    variants: colors.flatMap((c) => sizes.map((size) => ({ id: `${slug}-${c.name}-${size}`, color: c.name, size, stock: 20, sku: `MT-${i + 1}-${c.name.slice(0, 2).toUpperCase()}-${size}` }))),
    createdAt: new Date(BASE_DATE - s.days * DAY).toISOString(),
  };
});
