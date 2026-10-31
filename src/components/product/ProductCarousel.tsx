"use client";
import { useRef } from "react";
import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

export function ProductCarousel({ products, dark = false }: { products: Product[]; dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * (ref.current.clientWidth * 0.8), behavior: "smooth" });
  const btn = `hidden md:grid absolute top-[38%] z-20 h-12 w-12 place-items-center rounded-full border-2 border-ink text-xl font-bold shadow-pop transition hover:-translate-y-0.5 ${dark ? "bg-lime" : "bg-white"}`;
  return (
    <div className="relative">
      <button aria-label="Previous" onClick={() => scroll(-1)} className={`${btn} -left-4`}>←</button>
      <button aria-label="Next" onClick={() => scroll(1)} className={`${btn} -right-4`}>→</button>
      <div ref={ref} className="hide-scroll -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 pt-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-1" tabIndex={0} aria-label="Product carousel">
        {products.map((p, i) => (
          <div key={p.id} className="w-[62vw] max-w-[280px] shrink-0 snap-start sm:w-[260px] lg:w-[calc((100%-3*1rem)/4)] lg:max-w-none">
            <ProductCard product={p} tilt={i % 2 ? 0.8 : -0.8} />
          </div>
        ))}
      </div>
    </div>
  );
}
