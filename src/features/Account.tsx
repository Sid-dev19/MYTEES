"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { addressService, authService, orderService } from "@/services/accountServices";
import type { Address, Order } from "@/types";
import { cn, formatDate, formatPrice } from "@/utils";
import { EmptyState } from "@/components/ui/primitives";
import { Sticker } from "@/components/ui/Sticker";

type Section = "profile" | "orders" | "addresses";
const tabs: { id: Section | "wishlist"; label: string; href: string }[] = [
  { id: "profile", label: "Profile", href: "/account" },
  { id: "orders", label: "Orders", href: "/account/orders" },
  { id: "addresses", label: "Addresses", href: "/account/addresses" },
  { id: "wishlist", label: "Wishlist", href: "/wishlist" },
];

export function AccountPage({ section }: { section: Section }) {
  const router = useRouter();
  const hydrated = useStore((s) => s.hydrated);
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const toast = useStore((s) => s.toast);
  const wishCount = useStore((s) => s.wishlist.length);

  useEffect(() => { if (hydrated && !user) router.replace("/login"); }, [hydrated, user, router]);
  if (!hydrated || !user) return <div className="container-x py-12"><div className="skeleton h-72" /></div>;

  const logout = () => { authService.logout(); setUser(null); toast("Logged out. Come back soon 👋"); router.push("/"); };

  return (
    <div className="container-x py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="display text-5xl sm:text-7xl">HEY, <span className="text-purple">{user.name.split(" ")[0]}.</span></h1>
        <Sticker bg="#C6FF3D" rotate={5}>MYTEES MEMBER</Sticker>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
        <nav aria-label="Account" className="flex gap-2 overflow-x-auto pb-2 hide-scroll lg:flex-col lg:overflow-visible">
          {tabs.map((t) => (
            <Link key={t.id} href={t.href} aria-current={t.id === section ? "page" : undefined} className={cn("btn shrink-0 justify-between !rounded-xl", t.id === section ? "bg-ink !text-lime shadow-pop" : "bg-white hover:bg-lime")}>
              {t.label}{t.id === "wishlist" && <span className="rounded-full bg-pink px-2 text-xs">{wishCount}</span>}
            </Link>
          ))}
          <Link href="/track-order" className="btn shrink-0 !rounded-xl bg-white hover:bg-lime">Track order</Link>
          <button onClick={logout} className="btn shrink-0 !rounded-xl bg-white text-pink hover:bg-pink hover:text-ink">Logout</button>
        </nav>
        <div>
          {section === "profile" && <Profile />}
          {section === "orders" && <Orders />}
          {section === "addresses" && <Addresses />}
        </div>
      </div>
    </div>
  );
}

function Card({ title, children, color = "#fff" }: { title: string; children: React.ReactNode; color?: string }) {
  return <section className="rounded-2xl border-2 border-ink p-5 shadow-pop sm:p-6" style={{ background: color }}><h2 className="display mb-4 text-3xl">{title}</h2>{children}</section>;
}

function Profile() {
  const user = useStore((s) => s.user)!;
  const setUser = useStore((s) => s.setUser);
  const toast = useStore((s) => s.toast);
  const orders = orderService.list();
  const save = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const u = authService.updateProfile({ name: String(d.get("name")), phone: String(d.get("phone")) });
    if (u) { setUser(u); toast("Profile saved ✨"); }
  };
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[["Orders", orders.length, "#FF8AC4"], ["Spent", formatPrice(orders.reduce((s, o) => s + o.total, 0)), "#C6FF3D"], ["Tier", "Fresh", "#27E1F5"]].map(([l, v, c]) => (
          <div key={l as string} className="rounded-2xl border-2 border-ink p-4 shadow-pop" style={{ background: c as string }}><p className="text-xs font-extrabold uppercase">{l}</p><p className="display text-4xl">{v}</p></div>
        ))}
      </div>
      <Card title="Profile">
        <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          <div><label className="label" htmlFor="pn">Name</label><input id="pn" name="name" defaultValue={user.name} className="input" required /></div>
          <div><label className="label" htmlFor="pe">Email</label><input id="pe" value={user.email} readOnly className="input bg-ink/5" /></div>
          <div><label className="label" htmlFor="pp">Phone</label><input id="pp" name="phone" defaultValue={user.phone} inputMode="tel" className="input" placeholder="10-digit mobile" /></div>
          <div className="flex items-end"><button className="btn btn-pop btn-dark !text-lime">SAVE</button></div>
        </form>
      </Card>
      <Card title="Settings" color="#FFF1A8">
        <label className="flex items-center gap-3 text-sm font-bold"><input type="checkbox" defaultChecked className="h-5 w-5 accent-purple" /> Email me about new drops</label>
        <label className="mt-3 flex items-center gap-3 text-sm font-bold"><input type="checkbox" className="h-5 w-5 accent-purple" /> SMS order updates</label>
      </Card>
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  useEffect(() => setOrders(orderService.list()), []);
  if (!orders) return <div className="skeleton h-48" />;
  if (!orders.length) return <EmptyState emoji="📦" title="NO ORDERS YET." text="Your first tee is waiting." cta={{ label: "START SHOPPING", href: "/t-shirts" }} />;
  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <article key={o.id} className="rounded-2xl border-2 border-ink bg-white p-5 shadow-pop">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div><p className="font-display text-2xl">#{o.id}</p><p className="text-xs font-medium text-ink/60">{formatDate(o.createdAt)} · {o.items.length} item(s)</p></div>
            <span className="chip bg-lime">{o.status}</span>
          </div>
          <ul className="mt-3 space-y-1 text-sm">{o.items.map((i, k) => <li key={k} className="flex justify-between"><span>{i.name} · {i.color}/{i.size} × {i.quantity}</span><span className="font-bold">{formatPrice(i.price * i.quantity)}</span></li>)}</ul>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink/10 pt-3"><p className="font-extrabold">Total {formatPrice(o.total)}</p><Link href={`/track-order?id=${o.id}&c=${encodeURIComponent(o.email)}`} className="btn btn-pop btn-pink !py-2">TRACK ORDER</Link></div>
        </article>
      ))}
    </div>
  );
}

function Addresses() {
  const toast = useStore((s) => s.toast);
  const [list, setList] = useState<Address[]>([]);
  const [adding, setAdding] = useState(false);
  useEffect(() => setList(addressService.list()), []);
  const add = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    addressService.save({ fullName: d.fullName, phone: d.phone, line1: d.line1, city: d.city, state: d.state, pincode: d.pincode });
    setList(addressService.list()); setAdding(false); toast("Address saved 📍");
  };
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((a) => (
          <div key={a.id} className="rounded-2xl border-2 border-ink bg-white p-5 shadow-pop">
            {a.isDefault && <span className="chip mb-2 bg-lime">DEFAULT</span>}
            <p className="font-extrabold">{a.fullName}</p><p className="text-sm text-ink/75">{a.line1}, {a.city}, {a.state} — {a.pincode}</p><p className="text-sm">{a.phone}</p>
            <button onClick={() => { addressService.remove(a.id); setList(addressService.list()); }} className="mt-3 text-xs font-bold text-pink underline">Remove</button>
          </div>
        ))}
        {!list.length && !adding && <p className="rounded-2xl border-2 border-dashed border-ink p-8 text-center font-bold sm:col-span-2">No saved addresses yet.</p>}
      </div>
      {adding ? <Card title="New address" color="#E6D9FF"><AddressFields onSubmit={add} submit="SAVE ADDRESS" /></Card> : <button onClick={() => setAdding(true)} className="btn btn-pop btn-lime">+ ADD ADDRESS</button>}
    </div>
  );
}

export function AddressFields({ onSubmit, submit, defaults }: { onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; submit: string; defaults?: Partial<Address> }) {
  const f = (id: keyof Address, label: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className={id === "line1" ? "sm:col-span-2" : ""}><label className="label" htmlFor={`a-${id}`}>{label}</label><input id={`a-${id}`} name={id} required defaultValue={defaults?.[id] as string} className="input" {...extra} /></div>
  );
  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      {f("fullName", "Full name", { autoComplete: "name", placeholder: "Full Name" })}
      {f("phone", "Phone number", { inputMode: "tel", pattern: "[0-9]{10}", maxLength: 10, autoComplete: "tel", placeholder: "10-digit mobile" })}
      {f("pincode", "Pincode", { inputMode: "numeric", pattern: "[0-9]{6}", maxLength: 6, autoComplete: "postal-code", placeholder: "6-digit pincode" })}
      {f("city", "City", { autoComplete: "address-level2", placeholder: "City" })}
      {f("line1", "Address", { autoComplete: "street-address", placeholder: "House no., street, area" })}
      {f("state", "State", { autoComplete: "address-level1", placeholder: "State" })}
      <div className="sm:col-span-2"><button className="btn btn-pop btn-dark w-full !py-4 !text-lime sm:w-auto">{submit}</button></div>
    </form>
  );
}
