"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product, Size } from "@/types";
import { useStore } from "@/store";
import { cn, formatPrice } from "@/utils";
import { ProductImage, Rating } from "@/components/ui/primitives";
import { Sticker } from "@/components/ui/Sticker";
import { Doodle } from "@/components/bg";

export function WishlistButton({ productId, className }: { productId: string; className?: string }) {
  const saved = useStore((s) => s.wishlist.some((w) => w.productId === productId));
  const toggle = useStore((s) => s.toggleWishlist);
  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(productId); }}
      aria-pressed={saved} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      className={cn("grid h-9 w-9 place-items-center rounded-full border-2 border-ink bg-white shadow-pops", className)}
    >
      <motion.svg key={String(saved)} initial={{ scale: saved ? 0.4 : 1 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 12 }}
        viewBox="0 0 24 24" className={cn("h-4.5 w-4.5 h-[18px] w-[18px] stroke-ink", saved ? "fill-pink" : "fill-transparent")} strokeWidth="2.4">
        <path d="M12 21s-9-5.7-9-12a5 5 0 019-3 5 5 0 019 3c0 6.3-9 12-9 12z" />
      </motion.svg>
    </motion.button>
  );
}

export function ProductCard({ product, priority = false, tilt = 0 }: { product: Product; priority?: boolean; tilt?: number }) {
  const [color, setColor] = useState(product.colors[0].name);
  const [quick, setQuick] = useState(false);
  const add = useStore((s) => s.addToCart);
  const href = `/product/${product.slug}`;
  const topBadge = product.isLimited ? { t: "LIMITED", bg: "#FF6B1A" } : product.isNew ? { t: "NEW", bg: "#C6FF3D" } : product.isBestseller ? { t: "BESTSELLER", bg: "#FF2E93" } : null;
  const colorIdx = Math.max(0, product.colors.findIndex((c) => c.name === color));

  return (
    <motion.article
      whileHover={{ y: -6, rotate: tilt }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative" onMouseLeave={() => setQuick(false)}
    >
      <div className="relative overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-pop transition-shadow group-hover:shadow-popl">
        <Link href={href} data-cursor="VIEW" aria-label={`View ${product.name}`} className="relative block aspect-[4/5] overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
            <ProductImage product={product} color={color} view={0} priority={priority} />
          </div>
          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <ProductImage product={product} color={color} view={1} />
          </div>
        </Link>

        {topBadge && <Sticker size="xs" bg={topBadge.bg} rotate={-8} className="absolute left-2 top-2 z-10">{topBadge.t}</Sticker>}
        <WishlistButton productId={product.id} className="absolute right-2 top-2 z-10" />
        {product.rating >= 4.8 && product.reviewCount > 200 && (
          <Sticker size="xs" bg="#FFD81F" rotate={7} className="absolute bottom-2 right-2 z-10 hidden sm:inline-flex">🔥 HOT</Sticker>
        )}

        {/* Quick add */}
        <div className="absolute inset-x-0 bottom-0 z-20">
          <AnimatePresence>
            {quick && (
              <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 26, stiffness: 320 }} className="border-t-2 border-ink bg-white p-2.5">
                <p className="mb-1.5 text-center text-[10px] font-bold uppercase tracking-widest">Pick a size</p>
                <div className="grid grid-cols-6 gap-1">
                  {product.sizes.map((s: Size) => (
                    <button key={s} onClick={() => { add(product.id, s, color); setQuick(false); }} className="rounded-md border-2 border-ink py-1.5 text-[11px] font-bold hover:bg-lime">{s}</button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {!quick && (
            <button
              onClick={() => setQuick(true)} aria-label={`Quick add ${product.name}`}
              className="w-full translate-y-full border-t-2 border-ink bg-ink py-2.5 text-xs font-bold uppercase tracking-wider text-lime transition-transform duration-300 group-hover:translate-y-0 group-focus-within:translate-y-0 max-md:hidden"
            >
              + Quick Add
            </button>
          )}
        </div>
        {/* mobile quick add */}
        <button onClick={() => setQuick((q) => !q)} aria-label={`Quick add ${product.name}`} className="absolute bottom-2 left-2 z-10 grid h-9 w-9 place-items-center rounded-full border-2 border-ink bg-lime text-lg font-bold shadow-pops md:hidden">{quick ? "×" : "+"}</button>
      </div>

      <div className="mt-3 px-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold leading-snug sm:text-[15px]"><Link href={href} className="hover:text-purple">{product.name}</Link></h3>
          <Rating value={product.rating} className="shrink-0" />
        </div>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
          <span className="text-base font-extrabold">{formatPrice(product.price)}</span>
          <span className="text-xs text-ink/45 line-through">{formatPrice(product.compareAtPrice)}</span>
          <span className="rounded bg-pink/15 px-1.5 py-0.5 text-[11px] font-extrabold text-pink">{product.discount}% OFF</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5" role="radiogroup" aria-label="Colour">
          {product.colors.map((c) => (
            <button
              key={c.name} role="radio" aria-checked={color === c.name} aria-label={c.name} onClick={() => setColor(c.name)}
              className={cn("h-4 w-4 rounded-full border-2 border-ink transition-transform hover:scale-125", color === c.name && "ring-2 ring-offset-2 ring-ink")}
              style={{ background: c.hex }}
            />
          ))}
          {product.isLimited && <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-bold uppercase text-orange"><Doodle name="bolt" size={10} color="#FF6B1A" />Only {product.stock} left</span>}
        </div>
      </div>
    </motion.article>
  );
}
