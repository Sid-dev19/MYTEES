"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/store";
import { POPULAR_SEARCHES, STORAGE_KEYS } from "@/constants";
import { searchService } from "@/services/catalogServices";
import { productService } from "@/services/productService";
import { Dialog, ProductImage, Skeleton } from "@/components/ui/primitives";
import { CloseIcon, SearchIcon } from "@/components/ui/Icons";
import { formatPrice, readStorage, writeStorage } from "@/utils";

export function SearchOverlay() {
  const open = useStore((s) => s.searchOpen);
  const setOpen = useStore((s) => s.setSearchOpen);
  const router = useRouter();
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => { if (open) setRecent(readStorage<string[]>(STORAGE_KEYS.recent, [])); else setQ(""); }, [open]);
  useEffect(() => { const t = setTimeout(() => setDebounced(q), 180); return () => clearTimeout(t); }, [q]);

  const results = useMemo(() => searchService.suggest(debounced, 6), [debounced]);
  const loading = q !== debounced;
  const trending = useMemo(() => productService.listSync({ isBestseller: true }).slice(0, 4), []);
  const close = () => setOpen(false);

  const go = (term: string) => {
    const t = term.trim();
    if (!t) return;
    writeStorage(STORAGE_KEYS.recent, [t, ...recent.filter((r) => r !== t)].slice(0, 5));
    close();
    router.push(`/search?q=${encodeURIComponent(t)}`);
  };

  return (
    <Dialog open={open} onClose={close} label="Search" side="top" className="max-h-[92vh] w-full overflow-y-auto border-b-2 border-ink bg-cream">
      <div className="container-x py-6 sm:py-10">
        <div className="flex items-start justify-between">
          <h2 className="display text-3xl sm:text-5xl">WHAT ARE YOU LOOKING FOR?</h2>
          <button aria-label="Close search" onClick={close} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-white"><CloseIcon /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); go(q); }} className="relative mt-5" role="search">
          <label htmlFor="site-search" className="sr-only">Search products</label>
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2" />
          <input id="site-search" data-autofocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your next favorite tee..." autoComplete="off" className="input !rounded-full !py-4 pl-12 text-base shadow-pop" />
        </form>

        {!q ? (
          <div className="mt-6 grid gap-8 md:grid-cols-[1fr_2fr]">
            <div>
              <h3 className="label">Popular searches</h3>
              <div className="flex flex-wrap gap-2">{POPULAR_SEARCHES.map((s) => <button key={s} onClick={() => go(s)} className="chip bg-white hover:bg-lime">{s}</button>)}</div>
              {recent.length > 0 && (<><h3 className="label mt-6">Recent</h3><div className="flex flex-wrap gap-2">{recent.map((s) => <button key={s} onClick={() => go(s)} className="chip bg-white hover:bg-sun">{s} ↗</button>)}</div></>)}
            </div>
            <div>
              <h3 className="label">Trending now</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {trending.map((p) => (
                  <Link key={p.id} href={`/product/${p.slug}`} onClick={close} className="group">
                    <div className="aspect-[4/5] overflow-hidden rounded-xl border-2 border-ink"><ProductImage product={p} /></div>
                    <p className="mt-1.5 truncate text-xs font-bold group-hover:text-purple">{p.name}</p>
                    <p className="text-xs font-extrabold">{formatPrice(p.price)}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : loading ? (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-[4/5]" />)}</div>
        ) : results.length === 0 ? (
          <div className="py-12 text-center"><div aria-hidden className="text-5xl">🫥</div><p className="display mt-2 text-4xl">NOTHING MATCHED THAT VIBE.</p><p className="mt-2 text-sm font-medium text-ink/60">Try “oversized”, “black” or “graphic”.</p></div>
        ) : (
          <div className="mt-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {results.map((p) => (
                <Link key={p.id} href={`/product/${p.slug}`} onClick={close} className="group">
                  <div className="aspect-[4/5] overflow-hidden rounded-xl border-2 border-ink"><ProductImage product={p} /></div>
                  <p className="mt-1.5 truncate text-xs font-bold group-hover:text-purple">{p.name}</p>
                  <p className="text-xs font-extrabold">{formatPrice(p.price)}</p>
                </Link>
              ))}
            </div>
            <button onClick={() => go(q)} className="btn btn-pop btn-dark mt-6 !text-lime">See all results for “{q}” →</button>
          </div>
        )}
      </div>
    </Dialog>
  );
}
