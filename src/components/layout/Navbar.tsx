"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ANNOUNCEMENTS, NAV_LINKS } from "@/constants";
import { useStore } from "@/store";
import { cn } from "@/utils";
import { Logo } from "@/components/ui/Logo";
import { Marquee } from "@/components/ui/primitives";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "@/components/ui/Icons";
import { Doodle } from "@/components/bg";

export function AnnouncementBar() {
  const items = ANNOUNCEMENTS.flatMap((a) => [a, "✦"]);
  return (
    <div className="relative z-[60] border-b-2 border-ink bg-lime py-1.5 text-[11px] font-extrabold uppercase tracking-widest sm:text-xs">
      <Marquee items={items} />
      <span className="sr-only">{ANNOUNCEMENTS.join(". ")}</span>
    </div>
  );
}

function Badge({ n }: { n: number }) {
  if (!n) return null;
  return (
    <motion.span key={n} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 14 }}
      className="absolute -right-1.5 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full border-2 border-ink bg-pink px-1 text-[10px] font-extrabold text-white">
      {n}
    </motion.span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const cartCount = useStore((s) => s.cart.reduce((n, c) => n + c.quantity, 0));
  const wishCount = useStore((s) => s.wishlist.length);
  const user = useStore((s) => s.user);
  const { setSearchOpen, setCartOpen, menuOpen, setMenuOpen } = useStore();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setMenuOpen(false), [pathname, setMenuOpen]);

  const iconBtn = "relative grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-lime focus-visible:bg-lime";

  return (
    <>
      <header className={cn("sticky top-0 z-50 border-b-2 border-ink bg-paper/95 backdrop-blur transition-shadow", scrolled && "shadow-[0_4px_0_0_#0B0B0F]")}>
        <div className="container-x flex h-16 items-center justify-between gap-3 lg:h-[72px]">
          <div className="flex items-center gap-1 lg:hidden">
            <button className={iconBtn} aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><MenuIcon /></button>
          </div>
          <Logo className="max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2" />

          <nav aria-label="Main" className="hidden items-center gap-6 xl:gap-8 lg:flex">
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href || (l.label === "COLLECTIONS" && pathname.startsWith("/collections"));
              return (
                <Link key={l.href} href={l.href} data-active={active} className="group relative py-1 text-[13px] font-extrabold tracking-wide transition-colors hover:text-purple">
                  <span className="link-u" data-active={active}>{l.label}</span>
                  <span aria-hidden className="ml-0.5 inline-block -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">↗</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-0.5">
            <button className={iconBtn} aria-label="Search" onClick={() => setSearchOpen(true)}><SearchIcon /></button>
            <Link className={cn(iconBtn, "max-sm:hidden")} aria-label={user ? "Account" : "Log in"} href={user ? "/account" : "/login"}><UserIcon /></Link>
            <Link className={cn(iconBtn, "max-sm:hidden")} aria-label={`Wishlist, ${wishCount} items`} href="/wishlist"><HeartIcon /><Badge n={wishCount} /></Link>
            <button className={iconBtn} aria-label={`Bag, ${cartCount} items`} onClick={() => setCartOpen(true)}><BagIcon /><Badge n={cartCount} /></button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[90] lg:hidden">
            <motion.div className="absolute inset-0 bg-ink/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuOpen(false)} />
            <motion.nav
              aria-label="Mobile" role="dialog" aria-modal="true"
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col overflow-y-auto border-r-2 border-ink bg-purple p-5 text-white"
            >
              <div className="mb-6 flex items-center justify-between">
                <Logo light />
                <button aria-label="Close menu" onClick={() => setMenuOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink"><CloseIcon /></button>
              </div>
              <ul className="flex flex-col">
                {NAV_LINKS.map((l, i) => (
                  <motion.li key={l.href} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.05 * i }}>
                    <Link href={l.href} className="display flex items-center justify-between border-b border-white/20 py-3.5 text-4xl hover:text-lime">{l.label}<span className="text-xl">→</span></Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-6 grid grid-cols-2 gap-2 text-sm font-bold uppercase">
                <Link href={user ? "/account" : "/login"} className="btn btn-light">{user ? "Account" : "Log in"}</Link>
                <Link href="/wishlist" className="btn btn-lime">Wishlist ({wishCount})</Link>
                <Link href="/track-order" className="btn btn-light">Track order</Link>
                <Link href="/contact" className="btn btn-light">Help</Link>
              </div>
              <Doodle name="star" color="#C6FF3D" size={60} className="mt-auto ml-auto pt-6 animate-spinslow" />
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
