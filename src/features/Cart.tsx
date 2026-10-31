"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { computeTotals, useStore } from "@/store";
import { couponService } from "@/services/catalogServices";
import { CartLines, TotalsBox } from "@/components/layout/CartDrawer";
import { EmptyState } from "@/components/ui/primitives";
import { GridBackground } from "@/components/bg";

export function CartPage() {
  const hydrated = useStore((s) => s.hydrated);
  const cart = useStore((s) => s.cart);
  const coupon = useStore((s) => s.coupon);
  const setCoupon = useStore((s) => s.setCoupon);
  const toast = useStore((s) => s.toast);
  const t = useMemo(() => computeTotals(cart, coupon), [cart, coupon]);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const apply = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const r = await couponService.validate(code, t.subtotal);
    setBusy(false);
    if (r.ok) { setCoupon(r.coupon); setMsg(""); toast(`${r.coupon.code} applied 🎉`); setCode(""); } else setMsg(r.message);
  };

  return (
    <div className="relative">
      <GridBackground variant="dots" className="opacity-50" />
      <div className="container-x relative py-8 sm:py-12">
        <h1 className="display text-5xl sm:text-7xl">YOUR BAG <span className="text-pink">({t.count})</span></h1>
        {!hydrated ? <div className="skeleton mt-8 h-64" /> : t.lines.length === 0 ? (
          <EmptyState emoji="🛍️" title="YOUR BAG IS SAD 😭" text="GO FIX THAT." cta={{ label: "CONTINUE SHOPPING", href: "/t-shirts" }} />
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="rounded-2xl border-2 border-ink bg-white px-4 shadow-pop sm:px-6"><CartLines /></div>
            <aside className="h-fit space-y-5 rounded-2xl border-2 border-ink bg-lime p-5 shadow-pop lg:sticky lg:top-24">
              <form onSubmit={apply}>
                <label htmlFor="coupon" className="label">Have a coupon?</label>
                <div className="flex gap-2">
                  <input id="coupon" value={code} onChange={(e) => setCode(e.target.value)} placeholder="MYTEES10" className="input uppercase" />
                  <button disabled={!code || busy} className="btn btn-dark !px-4 !text-lime">{busy ? "…" : "APPLY"}</button>
                </div>
                {msg && <p role="alert" className="mt-1.5 text-xs font-bold text-pink">{msg}</p>}
                {coupon && <p className="mt-2 flex items-center justify-between rounded-lg border-2 border-ink bg-white px-3 py-1.5 text-xs font-bold">{coupon.code} — {coupon.description}<button type="button" className="underline" onClick={() => setCoupon(null)}>Remove</button></p>}
                <p className="mt-2 text-[11px] font-medium text-ink/70">Try MYTEES10, FIRSTDROP or MOOD200.</p>
              </form>
              <div className="rounded-xl bg-white p-4"><TotalsBox t={t} /></div>
              <Link href="/checkout" className="btn btn-pop btn-dark w-full !py-4 text-base !text-lime">CHECKOUT →</Link>
              <Link href="/t-shirts" className="block text-center text-sm font-bold underline">Continue shopping</Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
