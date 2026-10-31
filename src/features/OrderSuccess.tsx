"use client";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { orderService } from "@/services/accountServices";
import type { Order } from "@/types";
import { formatDate, formatPrice } from "@/utils";
import { BlobBackground, Doodle, GrainOverlay } from "@/components/bg";
import { Logo } from "@/components/ui/Logo";

const CONFETTI = ["#FF2E93", "#C6FF3D", "#FFD81F", "#27E1F5", "#FF6B1A", "#6C2BFF"];

function Confetti() {
  const pieces = Array.from({ length: 36 }, (_, i) => ({ i, x: (i * 53) % 100, d: (i % 7) * 0.12, c: CONFETTI[i % 6], r: (i * 47) % 360, s: 6 + (i % 4) * 3 }));
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.span key={p.i} className="absolute top-0 block" style={{ left: `${p.x}%`, width: p.s, height: p.s * 1.6, background: p.c, border: "1.5px solid #0B0B0F" }}
          initial={{ y: -40, rotate: 0, opacity: 1 }} animate={{ y: "105vh", rotate: p.r + 540, opacity: [1, 1, 0] }} transition={{ duration: 3.2 + (p.i % 5) * 0.3, delay: p.d, ease: "easeIn" }} />
      ))}
    </div>
  );
}

function Inner() {
  const id = useSearchParams().get("id");
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  useEffect(() => { setOrder(id ? orderService.get(id) ?? null : orderService.list()[0] ?? null); }, [id]);

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#C6FF3D]">
      <BlobBackground colors={["#FF2E93", "#27E1F5", "#FFD81F"]} className="opacity-50" />
      <GrainOverlay />
      <Confetti />
      <header className="relative border-b-2 border-ink bg-paper"><div className="container-x flex h-16 items-center"><Logo /></div></header>
      <div className="container-x relative grid place-items-center py-10 sm:py-16">
        <div className="w-full max-w-2xl rounded-[2rem] border-2 border-ink bg-paper p-6 text-center shadow-[10px_10px_0_0_#0B0B0F] sm:p-10">
          <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 12 }} className="mx-auto mb-2 text-7xl" aria-hidden>📦</motion.div>
          <h1 className="display text-6xl sm:text-8xl">IT'S OFFICIAL. 🔥</h1>
          <p className="mt-2 text-lg font-bold">Your MYTEES are on their way.</p>
          {order === undefined ? <div className="skeleton mx-auto mt-6 h-40" /> : order === null ? (
            <p className="mt-6 text-sm font-medium">We couldn't find that order here, but if you just placed it, check your account.</p>
          ) : (
            <div className="mt-6 space-y-4 text-left">
              <div className="grid gap-3 sm:grid-cols-3">
                {[["Order ID", `#${order.id}`], ["Total", formatPrice(order.total)], ["Est. delivery", formatDate(order.estimatedDelivery)]].map(([k, v]) => <div key={k} className="rounded-xl border-2 border-ink bg-sun p-3"><p className="text-[10px] font-extrabold uppercase">{k}</p><p className="font-display text-xl">{v}</p></div>)}
              </div>
              <ul className="divide-y-2 divide-ink/10 rounded-xl border-2 border-ink bg-white px-4">
                {order.items.map((i, k) => <li key={k} className="flex justify-between gap-3 py-3 text-sm"><span className="font-bold">{i.name} <span className="font-medium text-ink/60">· {i.color}/{i.size} × {i.quantity}</span></span><span className="font-extrabold">{formatPrice(i.price * i.quantity)}</span></li>)}
              </ul>
              <p className="text-xs font-medium text-ink/70">Shipping to {order.address.fullName}, {order.address.city} · Paid via {order.paymentMethod}. Confirmation sent to {order.email}.</p>
            </div>
          )}
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={order ? `/track-order?id=${order.id}&c=${encodeURIComponent(order.email)}` : "/track-order"} className="btn btn-pop btn-pink">TRACK ORDER</Link>
            <Link href="/t-shirts" className="btn btn-pop btn-light">CONTINUE SHOPPING</Link>
          </div>
        </div>
      </div>
      <Doodle name="star" color="#0B0B0F" size={60} className="absolute bottom-10 left-8 hidden animate-spinslow sm:block" />
    </div>
  );
}

export function OrderSuccess() { return <Suspense><Inner /></Suspense>; }
