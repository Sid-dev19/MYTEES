"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Product, Size } from "@/types";
import { useStore } from "@/store";
import { productService } from "@/services/productService";
import { reviewService } from "@/services/catalogServices";
import { sizeGuide } from "@/data/misc";
import { cn, formatDate, formatPrice, readStorage, writeStorage } from "@/utils";
import { STORAGE_KEYS } from "@/constants";
import { Accordion, Dialog, ProductImage, Rating } from "@/components/ui/primitives";
import { Sticker } from "@/components/ui/Sticker";
import { WishlistButton, ProductCard } from "@/components/product/ProductCard";
import { QtyStepper } from "@/components/layout/CartDrawer";
import { CashIcon, CloseIcon, LeafIcon, ReturnIcon, ShirtIcon } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/primitives";

function Gallery({ product, color }: { product: Product; color: string }) {
  const views = [0, 1, 2, 3];
  const [i, setI] = useState(0);
  const strip = useRef<HTMLDivElement>(null);
  const onScroll = () => { const el = strip.current; if (el) setI(Math.round(el.scrollLeft / el.clientWidth)); };
  const [zoom, setZoom] = useState(false);
  return (
    <div className="grid gap-3 lg:grid-cols-[84px_1fr]">
      <div className="order-2 flex gap-2 lg:order-1 lg:flex-col" role="tablist" aria-label="Product images">
        {views.map((v) => (
          <button key={v} role="tab" aria-selected={i === v} aria-label={`Image ${v + 1}`} onClick={() => { setI(v); strip.current?.scrollTo({ left: v * strip.current.clientWidth, behavior: "smooth" }); }}
            className={cn("h-20 w-16 overflow-hidden rounded-lg border-2 lg:h-24 lg:w-full", i === v ? "border-ink shadow-pops" : "border-ink/20")}>
            <ProductImage product={product} view={v} color={color} />
          </button>
        ))}
      </div>
      <div className="order-1 lg:order-2">
        <div ref={strip} onScroll={onScroll} className="hide-scroll flex snap-x snap-mandatory overflow-x-auto rounded-2xl border-2 border-ink shadow-pop lg:overflow-hidden">
          {views.map((v) => (
            <div key={v} data-cursor="ZOOM" onMouseEnter={() => setZoom(true)} onMouseLeave={() => setZoom(false)} className={cn("relative aspect-[4/5] w-full shrink-0 snap-center overflow-hidden bg-white", v !== i && "lg:hidden")}>
              <div className={cn("h-full w-full transition-transform duration-500", zoom && "lg:scale-125")}><ProductImage product={product} view={v} color={color} priority={v === 0} /></div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-center gap-1.5 lg:hidden" aria-hidden>{views.map((v) => <span key={v} className={cn("h-1.5 rounded-full bg-ink transition-all", i === v ? "w-6" : "w-1.5 opacity-30")} />)}</div>
      </div>
    </div>
  );
}

function SizeGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} label="Size guide" className="w-full max-w-lg rounded-2xl border-2 border-ink bg-paper p-5 shadow-popl sm:p-7">
      <div className="flex items-start justify-between"><h2 className="display text-4xl">Size Guide</h2><button data-autofocus aria-label="Close" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-lime"><CloseIcon /></button></div>
      <p className="mt-1 text-sm font-medium text-ink/70">Body measurements in inches. Oversized tees run roomy — go true to size for the baggy look.</p>
      <table className="mt-4 w-full overflow-hidden rounded-xl border-2 border-ink text-center text-sm">
        <thead className="bg-ink text-lime"><tr>{["Size", "Chest", "Length", "Shoulder"].map((h) => <th key={h} className="px-2 py-2.5 font-extrabold uppercase">{h}</th>)}</tr></thead>
        <tbody>{sizeGuide.map((r, i) => <tr key={r.size} className={i % 2 ? "bg-white" : "bg-cream"}><td className="py-2 font-extrabold">{r.size}</td><td>{r.chest}"</td><td>{r.length}"</td><td>{r.shoulder}"</td></tr>)}</tbody>
      </table>
    </Dialog>
  );
}

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const addToCart = useStore((s) => s.addToCart);
  const toast = useStore((s) => s.toast);
  const setCartOpen = useStore((s) => s.setCartOpen);
  const [color, setColor] = useState(product.colors[0].name);
  const [size, setSize] = useState<Size | null>(null);
  const [qty, setQty] = useState(1);
  const [guide, setGuide] = useState(false);
  const [shake, setShake] = useState(false);
  const [added, setAdded] = useState(false);
  const [bar, setBar] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const reviews = useMemo(() => reviewService.list(product.id), [product.id]);
  const [recent, setRecent] = useState<Product[]>([]);

  useEffect(() => { productService.related(product, 4).then(setRelated); }, [product]);
  useEffect(() => {
    const ids = [product.id, ...readStorage<string[]>(STORAGE_KEYS.recent + ".viewed", []).filter((x) => x !== product.id)].slice(0, 6);
    writeStorage(STORAGE_KEYS.recent + ".viewed", ids);
    setRecent(productService.getByIdsSync(ids.slice(1, 5)));
  }, [product.id]);
  useEffect(() => {
    const el = ctaRef.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setBar(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el); return () => io.disconnect();
  }, []);

  const need = () => { if (!size) { setShake(true); toast("Pick a size first 👆"); setTimeout(() => setShake(false), 500); return false; } return true; };
  const onAdd = () => { if (!need()) return; addToCart(product.id, size!, color, qty); setAdded(true); setCartOpen(true); setTimeout(() => setAdded(false), 1400); };
  const onBuy = () => { if (!need()) return; addToCart(product.id, size!, color, qty); router.push("/checkout"); };

  const perks = [[<LeafIcon key="1" />, "100% Cotton"], [<ShirtIcon key="2" />, `${product.fit} Fit`], [<ReturnIcon key="3" />, "7-Day Returns"], [<CashIcon key="4" />, "Cash on Delivery"]];

  return (
    <>
      <div className="container-x py-5 sm:py-8">
        <nav aria-label="Breadcrumb" className="mb-4 text-xs font-bold uppercase text-ink/60">
          <Link href="/" className="hover:text-ink">Home</Link> / <Link href="/t-shirts" className="hover:text-ink">T-Shirts</Link> / <span className="text-ink">{product.name}</span>
        </nav>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          <div className="relative">
            <Gallery product={product} color={color} />
            {product.isNew && <Sticker size="sm" bg="#C6FF3D" rotate={-8} className="absolute left-3 top-3 z-10">NEW DROP</Sticker>}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-start justify-between gap-3">
              <h1 className="display text-4xl sm:text-5xl">{product.name}</h1>
              <WishlistButton productId={product.id} className="mt-1 shrink-0" />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Rating value={product.rating} />
              <a href="#reviews" className="text-xs font-bold underline">{product.reviewCount} reviews</a>
            </div>
            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-extrabold">{formatPrice(product.price)}</span>
              <span className="text-lg text-ink/45 line-through">{formatPrice(product.compareAtPrice)}</span>
              <span className="rounded-md border-2 border-ink bg-pink px-2 py-0.5 text-sm font-extrabold">{product.discount}% OFF</span>
            </div>
            <p className="mt-1 text-xs font-medium text-ink/60">Inclusive of all taxes. Free shipping above ₹999.</p>
            <p className="mt-4 text-sm leading-relaxed text-ink/80">{product.description}</p>

            <div className="mt-6">
              <p className="label">Color: <span className="font-medium normal-case">{color}</span></p>
              <div className="flex gap-3" role="radiogroup" aria-label="Colour">
                {product.colors.map((c) => (
                  <button key={c.name} role="radio" aria-checked={color === c.name} aria-label={c.name} onClick={() => setColor(c.name)} className={cn("h-9 w-9 rounded-full border-2 border-ink transition-transform hover:scale-110", color === c.name && "ring-2 ring-offset-2 ring-ink scale-110")} style={{ background: c.hex }} />
                ))}
              </div>
            </div>

            <motion.div animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : {}} className="mt-6">
              <div className="flex items-center justify-between"><p className="label !mb-0">Size {size && <span className="font-medium normal-case">: {size}</span>}</p><button onClick={() => setGuide(true)} className="text-xs font-bold uppercase underline">Size guide</button></div>
              <div className="mt-2 grid grid-cols-6 gap-2" role="radiogroup" aria-label="Size">
                {product.sizes.map((s) => (
                  <motion.button key={s} whileTap={{ scale: 0.9 }} role="radio" aria-checked={size === s} onClick={() => setSize(s)}
                    className={cn("h-12 rounded-xl border-2 border-ink text-sm font-extrabold transition-all", size === s ? "-translate-y-0.5 bg-ink text-lime shadow-[3px_3px_0_0_#FF2E93]" : "bg-white hover:bg-lime")}>{s}</motion.button>
                ))}
              </div>
            </motion.div>

            <div className="mt-6 flex items-center gap-4"><span className="label !mb-0">Qty</span><QtyStepper value={qty} onChange={(n) => setQty(Math.max(1, Math.min(10, n)))} /></div>

            <div ref={ctaRef} className="mt-6 grid gap-3">
              <motion.button whileTap={{ scale: 0.97 }} onClick={onAdd} className="btn btn-pop btn-dark relative !py-4 text-base !text-lime">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={String(added)} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}>{added ? "ADDED ✓ 🔥" : "ADD TO BAG"}</motion.span>
                </AnimatePresence>
              </motion.button>
              <button onClick={onBuy} className="btn btn-pop btn-pink !py-4 text-base">BUY NOW</button>
            </div>

            <div className="mt-6 grid grid-cols-4 gap-2 text-center">
              {perks.map(([ic, t]) => <div key={t as string} className="rounded-xl border-2 border-ink bg-white p-2"><span className="mx-auto grid place-items-center">{ic}</span><p className="mt-1 text-[10px] font-extrabold uppercase leading-tight">{t}</p></div>)}
            </div>

            <div className="mt-8">
              <Accordion items={[
                { title: "Description", body: product.description },
                { title: "Fabric & Care", body: <ul className="list-disc space-y-1 pl-5"><li>{product.fabric}</li><li>Machine wash cold, inside out</li><li>Do not bleach · Tumble dry low</li><li>Iron on reverse, never on the print</li></ul> },
                { title: "Fit", body: `${product.fit} fit. ${product.fit === "Oversized" ? "Drop shoulders and a roomy body. Go true to size for the baggy look, size down for a closer fit." : "Easy, true-to-size cut. Size up if you like it looser."}` },
                { title: "Shipping & Returns", body: "Free shipping above ₹999 · Delivered in 2–7 business days · Cash on Delivery available · 7-day easy returns & exchanges on unworn tees with tags." },
              ]} />
            </div>
          </div>
        </div>

        <section id="reviews" className="mt-16 scroll-mt-24">
          <h2 className="display text-4xl sm:text-6xl">WHAT PEOPLE SAY</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {reviews.slice(0, 4).map((r) => (
              <article key={r.id} className="rounded-2xl border-2 border-ink bg-white p-5 shadow-pop">
                <Rating value={r.rating} />
                <h3 className="mt-2 font-extrabold">{r.title}</h3>
                <p className="mt-1 text-sm text-ink/75">{r.body}</p>
                <p className="mt-3 text-xs font-bold text-ink/50">{r.author} · {formatDate(r.createdAt)}</p>
              </article>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-16">
            <SectionHeading title="PAIR IT WITH" sub="More tees from the same universe." />
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </section>
        )}
        {recent.length > 0 && (
          <section className="mt-16">
            <SectionHeading title="RECENTLY VIEWED" />
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">{recent.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </section>
        )}
      </div>

      {/* sticky mobile CTA */}
      <AnimatePresence>
        {bar && (
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t-2 border-ink bg-white p-3 lg:hidden">
            <div className="min-w-0 flex-1"><p className="truncate text-xs font-bold">{product.name}</p><p className="font-extrabold">{formatPrice(product.price)}</p></div>
            <button onClick={onAdd} className="btn btn-dark !text-lime !py-3">ADD TO BAG</button>
          </motion.div>
        )}
      </AnimatePresence>
      <SizeGuide open={guide} onClose={() => setGuide(false)} />
    </>
  );
}
