import { products } from "@/data/products";
import type { Product, ProductQuery } from "@/types";
import { wait } from "@/utils";

// Later: return (await apiClient.get<Product[]>("/products", { params: query })).data

export function filterProducts(list: Product[], q: ProductQuery): Product[] {
  let out = list.filter((p) => {
    if (q.gender && !(p.gender === q.gender || p.gender === "unisex")) return false;
    if (q.category?.length && !q.category.includes(p.category)) return false;
    if (q.collection && !p.collections.includes(q.collection)) return false;
    if (q.mood && p.mood !== q.mood) return false;
    if (q.sizes?.length && !q.sizes.some((s) => p.sizes.includes(s))) return false;
    if (q.colors?.length && !p.colors.some((c) => q.colors!.includes(c.name))) return false;
    if (q.fits?.length && !q.fits.includes(p.fit)) return false;
    if (q.fabrics?.length && !q.fabrics.some((f) => p.fabric.toLowerCase().includes(f.toLowerCase()))) return false;
    if (q.minPrice != null && p.price < q.minPrice) return false;
    if (q.maxPrice != null && p.price > q.maxPrice) return false;
    if (q.minRating != null && p.rating < q.minRating) return false;
    if (q.isNew && !p.isNew) return false;
    if (q.isBestseller && !p.isBestseller) return false;
    if (q.q) {
      const t = q.q.toLowerCase();
      const hay = `${p.name} ${p.category} ${p.fit} ${p.fabric} ${p.mood} ${p.gender} ${p.colors.map((c) => c.name).join(" ")} ${p.collections.join(" ")}`.toLowerCase();
      if (!t.split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  });
  out = [...out];
  switch (q.sort) {
    case "newest": out.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)); break;
    case "price-asc": out.sort((a, b) => a.price - b.price); break;
    case "price-desc": out.sort((a, b) => b.price - a.price); break;
    case "rating": out.sort((a, b) => b.rating - a.rating); break;
    default: out.sort((a, b) => b.reviewCount - a.reviewCount);
  }
  return out;
}

export const productService = {
  async list(q: ProductQuery = {}): Promise<Product[]> {
    await wait(250);
    return filterProducts(products, q);
  },
  /** synchronous variant for SSR / metadata */
  listSync: (q: ProductQuery = {}) => filterProducts(products, q),
  getBySlugSync: (slug: string) => products.find((p) => p.slug === slug),
  getByIdsSync: (ids: string[]) => ids.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[],
  async getBySlug(slug: string): Promise<Product | undefined> {
    await wait(200);
    return products.find((p) => p.slug === slug);
  },
  async related(p: Product, n = 4): Promise<Product[]> {
    return products.filter((x) => x.id !== p.id && (x.category === p.category || x.mood === p.mood)).slice(0, n);
  },
  allSync: () => products,
};
