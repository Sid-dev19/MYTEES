"use client";
import Link from "next/link";
import { useMemo } from "react";
import { computeTotals, useStore } from "@/store";
import { formatPrice } from "@/utils";
import { Dialog, EmptyState, ProductImage } from "@/components/ui/primitives";
import { CloseIcon, TrashIcon } from "@/components/ui/Icons";
import { FREE_SHIPPING_THRESHOLD } from "@/constants";

export function QtyStepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="inline-flex items-center rounded-full border-2 border-ink bg-white text-sm font-bold">
      <button aria-label="Decrease quantity" className="h-8 w-8 hover:bg-lime rounded-l-full" onClick={() => onChange(value - 1)} disabled={value <= 1}>−</button>
      <span className="w-7 text-center" aria-live="polite">{value}</span>
      <button aria-label="Increase quantity" className="h-8 w-8 hover:bg-lime rounded-r-full" onClick={() => onChange(value + 1)}>+</button>
    </div>
  );
}

export function CartLines({ compact = false }: { compact?: boolean }) {
  const cart = useStore((s) => s.cart);
  const coupon = useStore((s) => s.coupon);
  const { setQty, removeFromCart } = useStore();
  const t = useMemo(() => computeTotals(cart, coupon), [cart, coupon]);
  return (
    <ul className="divide-y-2 divide-ink/10">
      {t.lines.map(({ item, product }) => (
        <li key={item.key} className="flex gap-3 py-4">
          <Link href={`/product/${product.slug}`} className={`shrink-0 overflow-hidden rounded-xl border-2 border-ink ${compact ? "h-24 w-20" : "h-32 w-24 sm:h-36 sm:w-28"}`}>
            <ProductImage product={product} color={item.color} />
          </Link>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex justify-between gap-2">
              <Link href={`/product/${product.slug}`} className="text-sm font-bold leading-tight hover:text-purple">{product.name}</Link>
              <button aria-label={`Remove ${product.name}`} onClick={() => removeFromCart(item.key)} className="text-ink/50 hover:text-pink"><TrashIcon width={18} height={18} /></button>
            </div>
            <p className="mt-0.5 text-xs font-medium text-ink/60">{item.color} / {item.size}</p>
            <div className="mt-auto flex items-center justify-between pt-2">
              <QtyStepper value={item.quantity} onChange={(n) => setQty(item.key, n)} />
              <div className="text-right">
                <div className="text-sm font-extrabold">{formatPrice(product.price * item.quantity)}</div>
                <div className="text-[11px] text-ink/40 line-through">{formatPrice(product.compareAtPrice * item.quantity)}</div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function TotalsBox({ t }: { t: ReturnType<typeof computeTotals> }) {
  const row = "flex justify-between text-sm";
  return (
    <dl className="space-y-2">
      <div className={row}><dt>Subtotal</dt><dd className="font-bold">{formatPrice(t.subtotal)}</dd></div>
      {t.savings > 0 && <div className={row}><dt>You saved on MRP</dt><dd className="font-bold text-purple">−{formatPrice(t.savings)}</dd></div>}
      {t.discount > 0 && <div className={row}><dt>Coupon discount</dt><dd className="font-bold text-pink">−{formatPrice(t.discount)}</dd></div>}
      <div className={row}><dt>Shipping</dt><dd className="font-bold">{t.shipping === 0 ? "FREE" : formatPrice(t.shipping)}</dd></div>
      <div className="flex justify-between border-t-2 border-ink pt-3 font-display text-2xl uppercase"><dt>Total</dt><dd>{formatPrice(t.total)}</dd></div>
    </dl>
  );
}

export function CartDrawer() {
  const open = useStore((s) => s.cartOpen);
  const setOpen = useStore((s) => s.setCartOpen);
  const cart = useStore((s) => s.cart);
  const coupon = useStore((s) => s.coupon);
  const t = useMemo(() => computeTotals(cart, coupon), [cart, coupon]);
  const close = () => setOpen(false);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - (t.subtotal - t.discount));

  return (
    <Dialog open={open} onClose={close} label="Shopping bag" side="right" className="flex h-full w-full max-w-md flex-col border-l-2 border-ink bg-paper">
      <div className="flex items-center justify-between border-b-2 border-ink bg-lime px-5 py-4">
        <h2 className="display text-3xl">Your Bag <span className="text-xl">({t.count})</span></h2>
        <button aria-label="Close bag" onClick={close} className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-white" data-autofocus><CloseIcon /></button>
      </div>

      {t.lines.length === 0 ? (
        <div className="flex flex-1 flex-col justify-center px-5">
          <EmptyState emoji="🛍️" title="YOUR BAG IS SAD 😭" text="GO FIX THAT." className="py-6" />
          <Link href="/t-shirts" onClick={close} className="btn btn-pop btn-lime mx-auto">CONTINUE SHOPPING</Link>
        </div>
      ) : (
        <>
          <div className="border-b-2 border-ink/10 px-5 py-3 text-xs font-bold">
            {remaining > 0 ? <>Add <span className="text-pink">{formatPrice(remaining)}</span> more for FREE shipping</> : <>🎉 You've unlocked FREE shipping</>}
            <div className="mt-1.5 h-2 overflow-hidden rounded-full border-2 border-ink bg-white">
              <div className="h-full bg-pink transition-all" style={{ width: `${Math.min(100, ((t.subtotal - t.discount) / FREE_SHIPPING_THRESHOLD) * 100)}%` }} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-5"><CartLines compact /></div>
          <div className="border-t-2 border-ink bg-white px-5 py-4">
            <TotalsBox t={t} />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link href="/cart" onClick={close} className="btn btn-pop btn-light">VIEW BAG</Link>
              <Link href="/checkout" onClick={close} className="btn btn-pop btn-dark !bg-ink !text-lime">CHECKOUT</Link>
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
}
