"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/utils";
import type { Product } from "@/types";
import { TeeArt } from "./TeeArt";

/* ---------- Product image (real image if present, else branded TeeArt) ---------- */
export function ProductImage({ product, view = 0, color, className, priority = false }: { product: Product; view?: number; color?: string; className?: string; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  const src = product.images.length ? product.images[view % product.images.length] : undefined;
  if (src && !failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={`${product.name} — view ${view + 1}`} loading={priority ? "eager" : "lazy"} decoding="async" onError={() => setFailed(true)} className={cn("h-full w-full object-cover", className)} />;
  }
  return <TeeArt product={product} color={color} view={view} className={cn("h-full w-full", className)} />;
}

/* ---------- Marquee ---------- */
export function Marquee({ items, className, itemClass, reverse = false }: { items: string[]; className?: string; itemClass?: string; reverse?: boolean }) {
  const row = (
    <>
      {items.map((t, i) => (
        <span key={i} className={cn("shrink-0 px-5", itemClass)}>{t}</span>
      ))}
    </>
  );
  return (
    <div className={cn("overflow-hidden whitespace-nowrap", className)} aria-hidden>
      <div className={cn("flex w-max animate-marquee will-change-transform", reverse && "[animation-direction:reverse]")}>
        <div className="flex">{row}</div>
        <div className="flex">{row}</div>
      </div>
    </div>
  );
}

/* ---------- Rating ---------- */
export function Rating({ value, count, className }: { value: number; count?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-bold", className)} aria-label={`Rated ${value} out of 5`}>
      <svg aria-hidden viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-sun stroke-ink" strokeWidth="2"><path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.7L6 22l1.5-7.2L2 10l7.1-1.1z" /></svg>
      {value.toFixed(1)}
      {count != null && <span className="font-medium text-ink/50">({count})</span>}
    </span>
  );
}

/* ---------- Accessible modal / drawer ---------- */
export function Dialog({ open, onClose, label, children, side = "center", className }: { open: boolean; onClose: () => void; label: string; children: ReactNode; side?: "center" | "right" | "top"; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    setTimeout(() => ref.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus() ?? ref.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus?.();
    };
  }, [open, onClose]);

  const variants = {
    center: { initial: { opacity: 0, scale: 0.92, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95 } },
    right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
    top: { initial: { y: "-100%" }, animate: { y: 0 }, exit: { y: "-100%" } },
  }[side];
  const pos = { center: "items-center justify-center p-4", right: "justify-end", top: "items-start" }[side];

  return (
    <AnimatePresence>
      {open && (
        <div className={cn("fixed inset-0 z-[80] flex", pos)}>
          <motion.div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} aria-hidden />
          <motion.div
            ref={ref} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1}
            {...variants} transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className={cn("relative outline-none", className)}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Accordion ---------- */
export function Accordion({ items, defaultOpen = 0 }: { items: { title: string; body: ReactNode }[]; defaultOpen?: number }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  return (
    <div className="border-t-2 border-ink">
      {items.map((it, i) => (
        <div key={it.title} className="border-b-2 border-ink">
          <h3>
            <button
              className="flex w-full items-center justify-between py-4 text-left font-display text-lg uppercase tracking-wide"
              aria-expanded={open === i} aria-controls={`acc-${i}`} onClick={() => setOpen(open === i ? null : i)}
            >
              {it.title}
              <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="text-2xl leading-none">+</motion.span>
            </button>
          </h3>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div id={`acc-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="pb-5 text-sm leading-relaxed text-ink/80">{it.body}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ---------- Section heading ---------- */
export function SectionHeading({ title, sub, cta, light = false, className }: { title: string; sub?: string; cta?: { label: string; href: string }; light?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-end justify-between gap-4 mb-6 sm:mb-10", className)}>
      <div>
        <h2 className={cn("display text-[clamp(2.4rem,7vw,5.5rem)]", light && "text-white")}>{title}</h2>
        {sub && <p className={cn("mt-2 text-sm sm:text-base font-medium", light ? "text-white/80" : "text-ink/70")}>{sub}</p>}
      </div>
      {cta && (
        <Link href={cta.href} className={cn("hidden sm:inline-flex shrink-0 link-u font-bold uppercase text-sm tracking-wide pb-1", light && "text-white")}>
          {cta.label} →
        </Link>
      )}
    </div>
  );
}

/* ---------- Branded empty / error ---------- */
export function EmptyState({ title, text, cta, emoji, className }: { title: string; text?: string; cta?: { label: string; href: string }; emoji?: string; className?: string }) {
  return (
    <div className={cn("relative mx-auto flex max-w-xl flex-col items-center py-16 text-center", className)}>
      {emoji && <div aria-hidden className="mb-3 text-6xl animate-floaty">{emoji}</div>}
      <h2 className="display text-4xl sm:text-6xl">{title}</h2>
      {text && <p className="mt-3 text-ink/70 font-medium">{text}</p>}
      {cta && <Link href={cta.href} className="btn btn-pop btn-lime mt-6">{cta.label} →</Link>}
    </div>
  );
}

export function ErrorState({ onRetry, title = "WHOOPS. SOMETHING WENT OFF SCRIPT.", text = "Don't worry, it's not you. It's us." }: { onRetry?: () => void; title?: string; text?: string }) {
  return (
    <div className="container-x grid min-h-[60vh] place-items-center py-16 text-center">
      <div>
        <div aria-hidden className="text-7xl mb-4">😵‍💫</div>
        <h1 className="display text-4xl sm:text-6xl max-w-2xl">{title}</h1>
        <p className="mt-3 text-ink/70 font-medium">{text}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {onRetry && <button onClick={onRetry} className="btn btn-pop btn-pink">TRY AGAIN</button>}
          <Link href="/" className="btn btn-pop btn-light">GO HOME</Link>
        </div>
      </div>
    </div>
  );
}

/* ---------- Skeletons ---------- */
export const Skeleton = ({ className }: { className?: string }) => <div className={cn("skeleton", className)} aria-hidden />;

export function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[4/5] w-full" />
      <Skeleton className="mt-3 h-4 w-3/4" />
      <Skeleton className="mt-2 h-4 w-1/2" />
    </div>
  );
}
export function ProductGridSkeleton({ n = 8 }: { n?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 lg:grid-cols-3 xl:grid-cols-4" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: n }).map((_, i) => <ProductCardSkeleton key={i} />)}
    </div>
  );
}
