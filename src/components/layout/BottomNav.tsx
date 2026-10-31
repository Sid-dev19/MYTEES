"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "@/store";
import { cn, haptic } from "@/utils";
import { BagIcon, HeartIcon, SearchIcon } from "@/components/ui/Icons";

const HomeIcon = (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...p}><path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" /></svg>;
const GridIcon = (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...p}><rect x="3" y="3" width="7.5" height="7.5" rx="2" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="2" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="2" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" /></svg>;

/** Floating app-style tab bar, mobile only. */
export function BottomNav() {
  const pathname = usePathname();
  const cartCount = useStore((s) => s.cart.reduce((n, c) => n + c.quantity, 0));
  const wishCount = useStore((s) => s.wishlist.length);
  const { setSearchOpen, setCartOpen } = useStore();

  if (pathname.startsWith("/checkout") || pathname === "/order-success" || pathname.startsWith("/product/")) return null;

  const link = (href: string, label: string, icon: React.ReactNode, active: boolean, badge = 0) => (
    <Link href={href} onClick={() => haptic(8)} aria-label={label} aria-current={active ? "page" : undefined} className="relative flex flex-1 flex-col items-center gap-0.5 py-1.5">
      {active && <motion.span layoutId="tab-pill" className="absolute inset-x-1 inset-y-0 rounded-2xl bg-lime" transition={{ type: "spring", stiffness: 500, damping: 34 }} />}
      <span className="relative">{icon}{badge > 0 && <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full border-2 border-ink bg-pink px-1 text-[9px] font-extrabold text-white">{badge}</span>}</span>
      <span className="relative text-[10px] font-extrabold uppercase tracking-wide">{label}</span>
    </Link>
  );
  const btn = (label: string, icon: React.ReactNode, onClick: () => void, badge = 0, hot = false) => (
    <button onClick={() => { haptic(8); onClick(); }} aria-label={label} className="relative flex flex-1 flex-col items-center gap-0.5 py-1.5">
      <span className={cn("relative grid place-items-center", hot && "-mt-6 h-12 w-12 rounded-full border-2 border-ink bg-pink shadow-pop")}>
        {icon}{badge > 0 && <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full border-2 border-ink bg-lime px-1 text-[9px] font-extrabold">{badge}</span>}
      </span>
      <span className="relative text-[10px] font-extrabold uppercase tracking-wide">{label}</span>
    </button>
  );

  return (
    <nav aria-label="Quick navigation" className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[55] lg:hidden">
      <div className="flex items-end rounded-[1.75rem] border-2 border-ink bg-white/95 px-1.5 pb-1 pt-1.5 shadow-popl backdrop-blur">
        {link("/", "Home", <HomeIcon />, pathname === "/")}
        {link("/t-shirts", "Shop", <GridIcon />, pathname === "/t-shirts" || pathname === "/men" || pathname === "/women" || pathname.startsWith("/collections"))}
        {btn("Bag", <BagIcon />, () => setCartOpen(true), cartCount, true)}
        {btn("Search", <SearchIcon />, () => setSearchOpen(true))}
        {link("/wishlist", "Saved", <HeartIcon />, pathname === "/wishlist", wishCount)}
      </div>
    </nav>
  );
}
