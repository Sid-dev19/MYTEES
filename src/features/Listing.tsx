"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Product, ProductQuery, Size, SortKey } from "@/types";
import { productService } from "@/services/productService";
import { categories, COLOR_MAP } from "@/data/products";
import { SIZES, SORT_OPTIONS } from "@/constants";
import { cn } from "@/utils";
import { ProductCard } from "@/components/product/ProductCard";
import { Dialog, EmptyState, ProductGridSkeleton } from "@/components/ui/primitives";
import { BlobBackground, Doodle, DoodleBackground, FunkyGradientBackground, GrainOverlay } from "@/components/bg";
import { Sticker } from "@/components/ui/Sticker";
import { ChevronIcon, CloseIcon, FilterIcon } from "@/components/ui/Icons";

interface Filters {
  category: string[]; sizes: Size[]; colors: string[]; gender: string[]; fits: string[]; fabrics: string[]; maxPrice: number; minRating: number;
}
const emptyFilters = (): Filters => ({ category: [], sizes: [], colors: [], gender: [], fits: [], fabrics: [], maxPrice: 2000, minRating: 0 });
const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

function FilterGroup({ title, children, open = true }: { title: string; children: React.ReactNode; open?: boolean }) {
  const [o, setO] = useState(open);
  return (
    <div className="border-b-2 border-ink/10 py-4">
      <button className="flex w-full items-center justify-between text-left text-sm font-extrabold uppercase tracking-wide" aria-expanded={o} onClick={() => setO(!o)}>
        {title}<ChevronIcon width={18} height={18} className={cn("transition-transform", o && "rotate-180")} />
      </button>
      {o && <div className="mt-3">{children}</div>}
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm font-semibold">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span className="grid h-5 w-5 place-items-center rounded border-2 border-ink bg-white text-[11px] peer-checked:bg-lime peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-purple">{checked && "✓"}</span>
      {label}
    </label>
  );
}

function FilterPanel({ f, set, hideGender }: { f: Filters; set: (f: Filters) => void; hideGender?: boolean }) {
  return (
    <div>
      <FilterGroup title="Category">{categories.map((c) => <Check key={c.slug} label={c.name} checked={f.category.includes(c.slug)} onChange={() => set({ ...f, category: toggle(f.category, c.slug) })} />)}</FilterGroup>
      {!hideGender && <FilterGroup title="Gender">{["men", "women", "unisex"].map((g) => <Check key={g} label={g[0].toUpperCase() + g.slice(1)} checked={f.gender.includes(g)} onChange={() => set({ ...f, gender: toggle(f.gender, g) })} />)}</FilterGroup>}
      <FilterGroup title="Size">
        <div className="flex flex-wrap gap-2">{SIZES.map((s) => <button key={s} aria-pressed={f.sizes.includes(s)} onClick={() => set({ ...f, sizes: toggle(f.sizes, s) })} className={cn("h-10 min-w-[44px] rounded-lg border-2 border-ink px-2 text-xs font-bold", f.sizes.includes(s) ? "bg-ink text-lime" : "bg-white hover:bg-lime")}>{s}</button>)}</div>
      </FilterGroup>
      <FilterGroup title="Color">
        <div className="flex flex-wrap gap-2.5">{Object.values(COLOR_MAP).map((c) => <button key={c.name} aria-label={c.name} aria-pressed={f.colors.includes(c.name)} title={c.name} onClick={() => set({ ...f, colors: toggle(f.colors, c.name) })} className={cn("h-8 w-8 rounded-full border-2 border-ink transition-transform hover:scale-110", f.colors.includes(c.name) && "ring-2 ring-offset-2 ring-ink")} style={{ background: c.hex }} />)}</div>
      </FilterGroup>
      <FilterGroup title="Price">
        <input type="range" min={399} max={2000} step={50} value={f.maxPrice} onChange={(e) => set({ ...f, maxPrice: +e.target.value })} className="w-full accent-purple" aria-label="Maximum price" />
        <div className="flex justify-between text-xs font-bold"><span>₹399</span><span>Up to ₹{f.maxPrice}</span></div>
      </FilterGroup>
      <FilterGroup title="Fit" open={false}>{["Oversized", "Regular", "Relaxed"].map((x) => <Check key={x} label={x} checked={f.fits.includes(x)} onChange={() => set({ ...f, fits: toggle(f.fits, x) })} />)}</FilterGroup>
      <FilterGroup title="Fabric" open={false}>{["Cotton", "Pima", "Supima", "Heavy"].map((x) => <Check key={x} label={x === "Heavy" ? "Heavy Cotton (260 GSM)" : x === "Cotton" ? "Cotton" : `${x} Cotton`} checked={f.fabrics.includes(x)} onChange={() => set({ ...f, fabrics: toggle(f.fabrics, x) })} />)}</FilterGroup>
      <FilterGroup title="Rating" open={false}>{[4.5, 4, 3].map((r) => <Check key={r} label={`${r}★ & above`} checked={f.minRating === r} onChange={() => set({ ...f, minRating: f.minRating === r ? 0 : r })} />)}</FilterGroup>
    </div>
  );
}

export interface ListingProps {
  title: string; sub?: string; base?: ProductQuery; accent?: string; hideGender?: boolean; sticker?: string; searchTerm?: string;
}

function ListingInner({ title, sub, base = {}, accent = "#C6FF3D", hideGender, sticker, searchTerm }: ListingProps) {
  const params = useSearchParams();
  const [f, setF] = useState<Filters>(emptyFilters);
  const [sort, setSort] = useState<SortKey>("popular");
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const urlCat = params.get("category");
  const urlMood = params.get("mood");
  const urlQ = searchTerm ?? params.get("q") ?? undefined;
  useEffect(() => { setF({ ...emptyFilters(), category: urlCat ? [urlCat] : [] }); }, [urlCat]);

  const query: ProductQuery = useMemo(() => ({
    ...base,
    mood: urlMood ?? undefined,
    q: urlQ,
    category: f.category.length ? f.category : undefined,
    sizes: f.sizes, colors: f.colors, fits: f.fits, fabrics: f.fabrics.map((x) => (x === "Heavy" ? "Heavy" : x)),
    maxPrice: f.maxPrice, minRating: f.minRating || undefined, sort,
    gender: base.gender ?? undefined,
  }), [base, f, sort, urlMood, urlQ]);

  const [list, setList] = useState<Product[]>([]);
  useEffect(() => {
    let live = true;
    setLoading(true);
    productService.list(query).then((r) => {
      if (!live) return;
      setList(f.gender.length && !base.gender ? r.filter((p) => f.gender.includes(p.gender)) : r);
      setLoading(false);
    });
    return () => { live = false; };
  }, [query, f.gender, base.gender]);

  const active = f.category.length + f.sizes.length + f.colors.length + f.gender.length + f.fits.length + f.fabrics.length + (f.minRating ? 1 : 0) + (f.maxPrice < 2000 ? 1 : 0);
  const sortLabel = SORT_OPTIONS.find((s) => s.value === sort)!.label;

  return (
    <>
      <section className="relative isolate overflow-hidden border-b-2 border-ink" style={{ background: accent }}>
        <FunkyGradientBackground from={accent} via="#fff" to={accent} className="opacity-50" />
        <GrainOverlay />
        <DoodleBackground density="low" />
        <div className="container-x relative py-8 sm:py-14">
          <nav aria-label="Breadcrumb" className="text-xs font-bold uppercase text-ink/60"><a href="/" className="hover:text-ink">Home</a> / <span className="text-ink">{title}</span></nav>
          <h1 className="display mt-2 text-[clamp(3rem,11vw,8rem)]">{title}</h1>
          {sub && <p className="mt-2 max-w-xl text-sm font-bold sm:text-base">{sub}</p>}
          {sticker && <Sticker bg="#fff" rotate={6} className="absolute right-4 top-6 hidden sm:inline-flex">{sticker}</Sticker>}
          {(urlMood || urlQ) && <p className="mt-3 text-sm font-bold">{urlMood && <>Mood: <span className="chip bg-white">{urlMood}</span></>} {urlQ && <>Results for <span className="chip bg-white">“{urlQ}”</span></>}</p>}
        </div>
      </section>

      <div className="container-x py-6 sm:py-10">
        {/* toolbar */}
        <div className="sticky top-16 z-30 -mx-4 mb-5 flex items-center justify-between gap-2 border-b-2 border-ink bg-paper/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:pb-5">
          <p className="text-sm font-bold">{loading ? "Loading…" : `${list.length} tee${list.length === 1 ? "" : "s"}`}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setFilterOpen(true)} className="btn btn-light !px-4 !py-2 lg:hidden"><FilterIcon width={16} height={16} />Filter{active ? ` (${active})` : ""}</button>
            <button onClick={() => setSortOpen(true)} className="btn btn-light !px-4 !py-2 lg:hidden">Sort</button>
            <label className="hidden items-center gap-2 text-sm font-bold lg:flex">Sort by
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="rounded-lg border-2 border-ink bg-white px-3 py-2 text-sm font-bold">
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border-2 border-ink bg-white p-4 shadow-pop">
              <div className="flex items-center justify-between"><h2 className="display text-2xl">Filters</h2>{active > 0 && <button onClick={() => setF(emptyFilters())} className="text-xs font-bold underline">Clear all</button>}</div>
              <FilterPanel f={f} set={setF} hideGender={!!base.gender} />
            </div>
          </aside>
          <div>
            {loading ? <ProductGridSkeleton n={8} /> : list.length === 0 ? (
              <EmptyState emoji="🔍" title={urlQ ? "NOTHING MATCHED THAT VIBE." : "NO TEES FOUND."} text="Try loosening a filter or two." cta={{ label: "CLEAR FILTERS", href: "/t-shirts" }} />
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-3 xl:grid-cols-4">
                {list.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 4} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* mobile filter sheet */}
      <Dialog open={filterOpen} onClose={() => setFilterOpen(false)} label="Filters" side="right" className="flex h-full w-full max-w-sm flex-col border-l-2 border-ink bg-paper">
        <div className="flex items-center justify-between border-b-2 border-ink bg-lime px-5 py-4"><h2 className="display text-3xl">Filters</h2><button aria-label="Close filters" data-autofocus onClick={() => setFilterOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-white"><CloseIcon /></button></div>
        <div className="flex-1 overflow-y-auto px-5"><FilterPanel f={f} set={setF} hideGender={!!base.gender} /></div>
        <div className="grid grid-cols-2 gap-3 border-t-2 border-ink bg-white p-4">
          <button onClick={() => setF(emptyFilters())} className="btn btn-light">CLEAR</button>
          <button onClick={() => setFilterOpen(false)} className="btn btn-dark !text-lime">SHOW {list.length}</button>
        </div>
      </Dialog>
      <Dialog open={sortOpen} onClose={() => setSortOpen(false)} label="Sort" side="center" className="w-full max-w-sm rounded-2xl border-2 border-ink bg-paper p-5 shadow-popl">
        <h2 className="display mb-3 text-3xl">Sort by</h2>
        <div role="radiogroup" className="space-y-2">
          {SORT_OPTIONS.map((o) => (
            <button key={o.value} role="radio" aria-checked={sort === o.value} onClick={() => { setSort(o.value); setSortOpen(false); }} className={cn("flex w-full items-center justify-between rounded-xl border-2 border-ink px-4 py-3 text-left text-sm font-bold", sort === o.value ? "bg-lime" : "bg-white")}>{o.label}{sort === o.value && "✓"}</button>
          ))}
        </div>
        <span className="sr-only">Current: {sortLabel}</span>
        <Doodle name="star" color="#FF2E93" size={28} className="absolute -right-3 -top-3" />
      </Dialog>
    </>
  );
}

export function Listing(props: ListingProps) {
  return <Suspense fallback={<div className="container-x py-10"><ProductGridSkeleton /></div>}><ListingInner {...props} /></Suspense>;
}
