"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { orderService } from "@/services/accountServices";
import { ORDER_STEPS } from "@/constants";
import type { Order, OrderStatus } from "@/types";
import { cn, formatDate, formatPrice } from "@/utils";
import { BlobBackground, DoodleBackground, GrainOverlay } from "@/components/bg";

const emoji = ["📝", "✅", "📦", "🚚", "🛵", "🎉"];

function Inner() {
  const p = useSearchParams();
  const [id, setId] = useState(p.get("id") ?? "");
  const [contact, setContact] = useState(p.get("c") ?? "");
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<{ order: Order; status: OrderStatus } | null | undefined>(undefined);

  const run = async (i = id, c = contact) => { setBusy(true); setRes(await orderService.track(i, c)); setBusy(false); };
  useEffect(() => { if (p.get("id")) run(p.get("id")!, p.get("c") ?? ""); /* eslint-disable-next-line */ }, []);

  const idx = res ? ORDER_STEPS.indexOf(res.status as (typeof ORDER_STEPS)[number]) : -1;

  return (
    <div className="relative overflow-hidden bg-[#CFF8FF]">
      <BlobBackground colors={["#FF8AC4", "#FFD81F", "#C6FF3D"]} className="opacity-50" />
      <GrainOverlay className="opacity-30" />
      <DoodleBackground density="low" />
      <div className="container-x relative py-10 sm:py-16">
        <h1 className="display text-5xl sm:text-8xl">WHERE'S MY <span className="text-pink">TEE?</span></h1>
        <form onSubmit={(e) => { e.preventDefault(); run(); }} className="mt-6 grid max-w-3xl gap-3 rounded-2xl border-2 border-ink bg-white p-4 shadow-pop sm:grid-cols-[1fr_1fr_auto] sm:p-5">
          <div><label htmlFor="oid" className="label">Order ID</label><input id="oid" required value={id} onChange={(e) => setId(e.target.value)} placeholder="MYT123456" className="input uppercase" /></div>
          <div><label htmlFor="oc" className="label">Email or phone</label><input id="oc" required value={contact} onChange={(e) => setContact(e.target.value)} placeholder="you@email.com" className="input" /></div>
          <div className="flex items-end"><button disabled={busy} className="btn btn-pop btn-dark w-full !py-3.5 !text-lime">{busy ? "…" : "TRACK →"}</button></div>
        </form>

        {res === null && <p role="alert" className="mt-5 inline-block rounded-xl border-2 border-ink bg-pink px-4 py-2 font-bold">No order matched those details. Double-check and retry.</p>}

        {res && (
          <div className="mt-8 max-w-3xl rounded-2xl border-2 border-ink bg-paper p-5 shadow-pop sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="display text-3xl">#{res.order.id}</h2><span className="chip bg-lime">{res.status}</span></div>
            <p className="text-sm font-medium text-ink/70">Placed {formatDate(res.order.createdAt)} · {formatPrice(res.order.total)} · ETA {formatDate(res.order.estimatedDelivery)}</p>
            <ol className="mt-8">
              {ORDER_STEPS.map((s, i) => {
                const done = i <= idx, cur = i === idx;
                return (
                  <motion.li key={s} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="relative flex gap-4 pb-7 last:pb-0" aria-current={cur ? "step" : undefined}>
                    {i < ORDER_STEPS.length - 1 && <span aria-hidden className={cn("absolute left-[19px] top-10 h-[calc(100%-2rem)] w-1 rounded", i < idx ? "bg-ink" : "bg-ink/15")} />}
                    <span className={cn("relative grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-ink text-lg", done ? "bg-lime" : "bg-white grayscale", cur && "animate-floaty shadow-pop !bg-pink")}>{emoji[i]}</span>
                    <div className="pt-1"><p className={cn("font-display text-xl uppercase", !done && "text-ink/40")}>{s}</p>{cur && <p className="text-xs font-bold text-purple">You are here</p>}</div>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        )}
        <p className="mt-6 text-xs font-medium text-ink/60">Demo tracking: place an order, then track it here using its ID and checkout email.</p>
      </div>
    </div>
  );
}

export function TrackOrder() { return <Suspense><Inner /></Suspense>; }
