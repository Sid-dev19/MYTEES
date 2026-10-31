"use client";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/store";
import { Logo } from "@/components/ui/Logo";
import { Marquee } from "@/components/ui/primitives";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/ui/Icons";
import { BlobBackground, FloatingShape, GrainOverlay } from "@/components/bg";

const cols = [
  { t: "SHOP", l: [["Men", "/men"], ["Women", "/women"], ["T-Shirts", "/t-shirts"], ["New Arrivals", "/new-arrivals"], ["Bestsellers", "/bestsellers"]] },
  { t: "HELP", l: [["Track Order", "/track-order"], ["FAQ", "/faq"], ["Contact", "/contact"], ["Returns & Exchange", "/faq"], ["Size Guide", "/faq"]] },
  { t: "MYTEES", l: [["About", "/about"], ["Collections", "/collections/main-character-energy"], ["Account", "/account"], ["Wishlist", "/wishlist"]] },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const toast = useStore((s) => s.toast);
  return (
    <footer className="relative mt-20 overflow-hidden border-t-2 border-ink bg-purple text-white">
      <div className="border-b-2 border-ink bg-sun py-3 font-display text-2xl uppercase text-ink sm:text-4xl">
        <Marquee items={["MYTEES", "✦", "NO BORING TEES", "✦", "WEAR YOUR MOOD", "✦", "NEW DROP", "✦"]} />
      </div>
      <div className="relative">
        <BlobBackground colors={["#FF2E93", "#27E1F5", "#FF6B1A"]} className="opacity-40" />
        <GrainOverlay className="opacity-30" />
        <FloatingShape name="star" color="#C6FF3D" size={54} className="right-[6%] top-8 hidden sm:block" rotate={10} />
        <FloatingShape name="smile" color="#FFD81F" size={50} className="left-[45%] bottom-8 hidden md:block" />
        <div className="container-x relative grid gap-10 py-12 lg:grid-cols-[1.3fr_2fr] lg:py-16">
          <div>
            <h2 className="display text-5xl sm:text-7xl">GET THE <span className="text-lime">DROP</span> FIRST.</h2>
            <p className="mt-3 max-w-md text-sm font-medium text-white/80">Early access, secret codes and zero spam. Promise.</p>
            {done ? (
              <p className="mt-5 inline-block rounded-xl border-2 border-ink bg-lime px-4 py-3 font-bold text-ink shadow-pop">You're in. Welcome to the club 🔥</p>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (!email) return; setDone(true); toast("Subscribed! Check your inbox 💌"); }} className="mt-5 flex max-w-md flex-col gap-2 sm:flex-row">
                <label htmlFor="nl" className="sr-only">Email address</label>
                <input id="nl" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="input !border-ink text-ink" />
                <button className="btn btn-pop btn-lime">SUBSCRIBE →</button>
              </form>
            )}
            <div className="mt-6 flex gap-3">
              {[["Instagram", <InstagramIcon key="i" />], ["Facebook", <FacebookIcon key="f" />], ["YouTube", <YoutubeIcon key="y" />]].map(([n, ic]) => (
                <a key={n as string} href="#" aria-label={n as string} className="grid h-11 w-11 place-items-center rounded-full border-2 border-ink bg-white text-ink shadow-pops transition hover:-translate-y-1 hover:bg-pink">{ic}</a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {cols.map((c) => (
              <nav key={c.t} aria-label={c.t}>
                <h3 className="display mb-3 text-2xl text-lime">{c.t}</h3>
                <ul className="space-y-2 text-sm font-semibold">
                  {c.l.map(([n, h]) => <li key={n}><Link href={h} className="link-u">{n}</Link></li>)}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="container-x relative flex flex-col items-center justify-between gap-3 border-t border-white/25 py-6 text-xs font-medium text-white/80 sm:flex-row">
          <Logo light />
          <p>© {new Date().getFullYear()} MYTEES. Made with ♥ in India. No boring tees allowed.</p>
        </div>
      </div>
    </footer>
  );
}
