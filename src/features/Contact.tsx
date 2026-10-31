"use client";
import { useState } from "react";
import { useStore } from "@/store";
import { BlobBackground, DoodleBackground, GrainOverlay } from "@/components/bg";
import { wait } from "@/utils";

export function ContactPage() {
  const toast = useStore((s) => s.toast);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setBusy(true); await wait(700); setBusy(false); setSent(true); toast("Message sent 💌"); };
  return (
    <div className="relative overflow-hidden bg-[#E6D9FF]">
      <BlobBackground colors={["#FF8AC4", "#27E1F5", "#FFD81F"]} className="opacity-50" /><GrainOverlay className="opacity-30" /><DoodleBackground density="low" />
      <div className="container-x relative grid gap-10 py-12 sm:py-20 lg:grid-cols-2">
        <div>
          <h1 className="display text-6xl sm:text-9xl">SAY <span className="text-pink">HI.</span></h1>
          <p className="mt-3 max-w-md text-lg font-bold">Order issue, collab idea, or just a compliment? We read everything.</p>
          <ul className="mt-6 space-y-2 text-sm font-bold"><li>📧 hello@mytees.in</li><li>📞 +91 90000 00000 (10am–7pm, Mon–Sat)</li><li>📍 Mumbai, India</li></ul>
        </div>
        <div className="rounded-2xl border-2 border-ink bg-paper p-6 shadow-popl">
          {sent ? <div role="status" className="py-10 text-center"><p className="text-5xl">💌</p><p className="display mt-2 text-4xl">MESSAGE SENT.</p><p className="mt-1 text-sm font-medium">We'll get back within 24 hours.</p></div> : (
            <form onSubmit={submit} className="space-y-4">
              <div><label className="label" htmlFor="cn">Name</label><input id="cn" required className="input" autoComplete="name" /></div>
              <div><label className="label" htmlFor="ce">Email</label><input id="ce" type="email" required className="input" autoComplete="email" /></div>
              <div><label className="label" htmlFor="cm">Message</label><textarea id="cm" required rows={5} className="input" /></div>
              <button disabled={busy} className="btn btn-pop btn-dark w-full !py-4 !text-lime">{busy ? "SENDING…" : "SEND IT →"}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
