"use client";
import { useMemo } from "react";
import { useStore } from "@/store";
import { productService } from "@/services/productService";
import { ProductCard } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/ui/primitives";
import { BlobBackground, DoodleBackground, GrainOverlay } from "@/components/bg";

export function WishlistPage() {
  const wishlist = useStore((s) => s.wishlist);
  const hydrated = useStore((s) => s.hydrated);
  const products = useMemo(() => productService.getByIdsSync(wishlist.map((w) => w.productId)), [wishlist]);
  return (
    <div className="relative overflow-hidden">
      <BlobBackground colors={["#E6D9FF", "#FFE1F0", "#E9FFB5"]} className="opacity-80" />
      <GrainOverlay className="opacity-20" />
      <DoodleBackground density="low" />
      <div className="container-x relative py-8 sm:py-12">
        <h1 className="display text-5xl sm:text-8xl">YOUR FUTURE <span className="text-pink">OUTFITS.</span></h1>
        {!hydrated ? <div className="skeleton mt-8 h-64" /> : products.length === 0 ? (
          <EmptyState emoji="❤️" title="NO CRUSHES YET ❤️" text="Start adding some." cta={{ label: "EXPLORE TEES", href: "/t-shirts" }} />
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        )}
      </div>
    </div>
  );
}
