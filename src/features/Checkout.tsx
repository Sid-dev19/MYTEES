"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { computeTotals, useStore } from "@/store";
import { orderService } from "@/services/accountServices";
import type { Address } from "@/types";
import { cn, formatPrice, readStorage, uid, writeStorage } from "@/utils";
import { PREPAID_DISCOUNT_PERCENT } from "@/constants";
import { Logo } from "@/components/ui/Logo";
import { ProductImage } from "@/components/ui/primitives";
import { EmptyState } from "@/components/ui/primitives";
import { AddressFields } from "./Account";
import { addressService } from "@/services/accountServices";

const DRAFT = "mytees.checkout.v1";
interface Draft { address?: Address; email?: string; delivery?: "standard" | "express" }

const STEPS = ["ADDRESS", "DELIVERY", "PAYMENT", "DONE"];

function Stepper({ current }: { current: number[] }) {
  return (
    <ol className="flex items-center justify-center gap-1 sm:gap-3" aria-label="Checkout progress">
      {STEPS.map((s, i) => {
        const on = current.includes(i), done = i < Math.min(...current);
        return (
          <li key={s} className="flex items-center gap-1 sm:gap-3" aria-current={on ? "step" : undefined}>
            <span className={cn("grid h-7 w-7 place-items-center rounded-full border-2 border-ink text-xs font-extrabold", on ? "bg-pink" : done ? "bg-lime" : "bg-white")}>{done ? "✓" : i + 1}</span>
            <span className={cn("text-[10px] font-extrabold tracking-wide sm:text-xs", on ? "text-ink" : "text-ink/50", !on && "max-sm:hidden")}>{s}</span>
            {i < STEPS.length - 1 && <span aria-hidden className="h-0.5 w-4 bg-ink/30 sm:w-10" />}
          </li>
        );
      })}
    </ol>
  );
}

function Summary({ prepaid, express = false }: { prepaid: boolean; express?: boolean }) {
  const cart = useStore((s) => s.cart);
  const coupon = useStore((s) => s.coupon);
  const t = useMemo(() => computeTotals(cart, coupon), [cart, coupon]);
  const pre = prepaid ? Math.round(((t.subtotal - t.discount) * PREPAID_DISCOUNT_PERCENT) / 100) : 0;
  return (
    <aside className="h-fit rounded-2xl border-2 border-ink bg-lime p-5 shadow-pop lg:sticky lg:top-24">
      <h2 className="display text-3xl">Order summary</h2>
      <ul className="mt-3 max-h-64 space-y-3 overflow-y-auto">
        {t.lines.map(({ item, product }) => (
          <li key={item.key} className="flex gap-3 text-sm"><div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg border-2 border-ink"><ProductImage product={product} color={item.color} /></div><div className="min-w-0 flex-1"><p className="truncate font-bold">{product.name}</p><p className="text-xs">{item.color}/{item.size} × {item.quantity}</p></div><p className="font-extrabold">{formatPrice(product.price * item.quantity)}</p></li>
        ))}
      </ul>
      <dl className="mt-4 space-y-1.5 border-t-2 border-ink pt-3 text-sm">
        <div className="flex justify-between"><dt>Subtotal</dt><dd className="font-bold">{formatPrice(t.subtotal)}</dd></div>
        {t.discount > 0 && <div className="flex justify-between"><dt>Coupon</dt><dd className="font-bold">−{formatPrice(t.discount)}</dd></div>}
        {pre > 0 && <div className="flex justify-between"><dt>Prepaid {PREPAID_DISCOUNT_PERCENT}% off</dt><dd className="font-bold">−{formatPrice(pre)}</dd></div>}
        <div className="flex justify-between"><dt>Shipping</dt><dd className="font-bold">{t.shipping ? formatPrice(t.shipping) : "FREE"}</dd></div>
        {express && <div className="flex justify-between"><dt>Express delivery</dt><dd className="font-bold">₹99</dd></div>}
        <div className="flex justify-between border-t-2 border-ink pt-2 font-display text-2xl uppercase"><dt>Total</dt><dd>{formatPrice(t.total - pre + (express ? 99 : 0))}</dd></div>
      </dl>
    </aside>
  );
}

export function CheckoutShell({ step, children, prepaid = false, express = false }: { step: "address" | "payment"; children: React.ReactNode; prepaid?: boolean; express?: boolean }) {
  const hydrated = useStore((s) => s.hydrated);
  const count = useStore((s) => s.cart.length);
  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b-2 border-ink bg-paper"><div className="container-x flex h-16 items-center justify-between"><Logo /><Link href="/cart" className="text-sm font-bold underline">← Back to bag</Link></div></header>
      <div className="container-x py-6 sm:py-10">
        <Stepper current={step === "address" ? [0] : [1, 2]} />
        {!hydrated ? <div className="skeleton mt-8 h-72" /> : count === 0 ? (
          <EmptyState emoji="🛍️" title="YOUR BAG IS SAD 😭" text="GO FIX THAT." cta={{ label: "CONTINUE SHOPPING", href: "/t-shirts" }} />
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
            <div>{children}</div>
            <Summary prepaid={prepaid} express={express} />
          </div>
        )}
      </div>
    </div>
  );
}

export function AddressStep() {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const [saved, setSaved] = useState<Address[]>([]);
  const [draft, setDraft] = useState<Draft>({});
  useEffect(() => { setSaved(addressService.list()); setDraft(readStorage<Draft>(DRAFT, {})); }, []);

  const go = (address: Address, email: string) => { writeStorage(DRAFT, { ...draft, address, email }); router.push("/checkout/payment"); };
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    go({ id: uid("addr"), fullName: d.fullName, phone: d.phone, line1: d.line1, city: d.city, state: d.state, pincode: d.pincode }, d.email);
  };

  return (
    <div className="space-y-6">
      <h1 className="display text-4xl sm:text-6xl">WHERE TO?</h1>
      {saved.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {saved.map((a) => <button key={a.id} onClick={() => go(a, user?.email ?? draft.email ?? "")} className="rounded-2xl border-2 border-ink bg-white p-4 text-left shadow-pop hover:bg-lime"><p className="font-extrabold">{a.fullName}</p><p className="text-sm">{a.line1}, {a.city} — {a.pincode}</p><p className="mt-2 text-xs font-bold uppercase text-purple">Deliver here →</p></button>)}
        </div>
      )}
      <div className="rounded-2xl border-2 border-ink bg-white p-5 shadow-pop sm:p-6">
        <h2 className="display mb-4 text-3xl">New address</h2>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className="label" htmlFor="c-email">Email</label><input id="c-email" name="email" type="email" required defaultValue={user?.email ?? draft.email} autoComplete="email" className="input" placeholder="you@email.com" /></div>
          <AddressInline defaults={draft.address} />
          <div className="sm:col-span-2"><button className="btn btn-pop btn-dark w-full !py-4 text-base !text-lime">CONTINUE TO PAYMENT →</button></div>
        </form>
      </div>
    </div>
  );
}

function AddressInline({ defaults }: { defaults?: Address }) {
  const f = (id: keyof Address, label: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className={id === "line1" ? "sm:col-span-2" : ""}><label className="label" htmlFor={`c-${id}`}>{label}</label><input id={`c-${id}`} name={id} required defaultValue={defaults?.[id] as string} className="input" {...extra} /></div>
  );
  return (
    <>
      {f("fullName", "Full name", { autoComplete: "name" })}
      {f("phone", "Phone", { inputMode: "tel", pattern: "[0-9]{10}", maxLength: 10, autoComplete: "tel", placeholder: "10-digit mobile" })}
      {f("line1", "Address", { autoComplete: "street-address", placeholder: "House no., street, area" })}
      {f("city", "City", { autoComplete: "address-level2" })}
      {f("state", "State", { autoComplete: "address-level1" })}
      {f("pincode", "Pincode", { inputMode: "numeric", pattern: "[0-9]{6}", maxLength: 6, autoComplete: "postal-code" })}
    </>
  );
}

export function PaymentStep() {
  const router = useRouter();
  const cart = useStore((s) => s.cart);
  const coupon = useStore((s) => s.coupon);
  const clearCart = useStore((s) => s.clearCart);
  const [delivery, setDelivery] = useState<"standard" | "express">("standard");
  const [method, setMethod] = useState<"upi" | "card" | "cod">("upi");
  const [draft, setDraft] = useState<Draft>({});
  const [busy, setBusy] = useState(false);
  useEffect(() => { const d = readStorage<Draft>(DRAFT, {}); if (!d.address && typeof window !== "undefined") router.replace("/checkout/address"); setDraft(d); }, [router]);
  const t = useMemo(() => computeTotals(cart, coupon), [cart, coupon]);

  const place = async () => {
    if (!draft.address || !draft.email) return;
    setBusy(true);
    const prepaid = method !== "cod";
    const pre = prepaid ? Math.round(((t.subtotal - t.discount) * PREPAID_DISCOUNT_PERCENT) / 100) : 0;
    const exp = delivery === "express" ? 99 : 0;
    const order = await orderService.place({
      items: t.lines.map((l) => ({ productId: l.product.id, name: l.product.name, size: l.item.size, color: l.item.color, quantity: l.item.quantity, price: l.product.price })),
      subtotal: t.subtotal, discount: t.discount + pre, shipping: t.shipping + exp, total: t.total - pre + exp,
      address: draft.address, email: draft.email, paymentMethod: method.toUpperCase(),
    });
    clearCart();
    writeStorage(DRAFT, {});
    router.push(`/order-success?id=${order.id}`);
  };

  const Opt = ({ active, onClick, title, sub, right }: { active: boolean; onClick: () => void; title: string; sub: string; right?: string }) => (
    <button role="radio" aria-checked={active} onClick={onClick} className={cn("flex w-full items-center gap-3 rounded-xl border-2 border-ink p-4 text-left transition", active ? "bg-sun shadow-pop" : "bg-white hover:bg-cream")}>
      <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-ink", active && "bg-ink")}>{active && <span className="h-2 w-2 rounded-full bg-lime" />}</span>
      <span className="flex-1"><span className="block text-sm font-extrabold">{title}</span><span className="block text-xs text-ink/70">{sub}</span></span>
      {right && <span className="text-sm font-extrabold">{right}</span>}
    </button>
  );

  return (
    <CheckoutShell step="payment" prepaid={method !== "cod"} express={delivery === "express"}>
      <div className="space-y-6">
        <h1 className="display text-4xl sm:text-6xl">ALMOST THERE.</h1>
        {draft.address && <div className="flex items-start justify-between gap-3 rounded-2xl border-2 border-ink bg-white p-4 shadow-pop"><div className="text-sm"><p className="font-extrabold">Deliver to {draft.address.fullName}</p><p className="text-ink/75">{draft.address.line1}, {draft.address.city}, {draft.address.state} — {draft.address.pincode}</p></div><Link href="/checkout/address" className="text-xs font-bold underline">Change</Link></div>}
        <section aria-labelledby="del"><h2 id="del" className="display mb-3 text-3xl">Delivery</h2>
          <div role="radiogroup" className="space-y-2">
            <Opt active={delivery === "standard"} onClick={() => setDelivery("standard")} title="Standard" sub="3–6 business days" right="Free" />
            <Opt active={delivery === "express"} onClick={() => setDelivery("express")} title="Express" sub="1–2 business days" right="₹99" />
          </div>
        </section>
        <section aria-labelledby="pay"><h2 id="pay" className="display mb-3 text-3xl">Payment</h2>
          <p className="mb-3 text-xs font-bold text-purple">Demo only — no real payment is processed.</p>
          <div role="radiogroup" className="space-y-2">
            <Opt active={method === "upi"} onClick={() => setMethod("upi")} title="UPI" sub={`Extra ${PREPAID_DISCOUNT_PERCENT}% off on prepaid`} />
            <Opt active={method === "card"} onClick={() => setMethod("card")} title="Credit / Debit Card" sub={`Extra ${PREPAID_DISCOUNT_PERCENT}% off on prepaid`} />
            <Opt active={method === "cod"} onClick={() => setMethod("cod")} title="Cash on Delivery" sub="Pay when your tees land" />
          </div>
        </section>
        <button onClick={place} disabled={busy} className="btn btn-pop btn-dark w-full !py-4 text-base !text-lime">{busy ? "PLACING YOUR ORDER…" : "PLACE ORDER →"}</button>
      </div>
    </CheckoutShell>
  );
}
