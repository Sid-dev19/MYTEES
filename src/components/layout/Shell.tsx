"use client";
import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "@/store";
import { AnnouncementBar, Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import { SearchOverlay } from "./SearchOverlay";
import { Toasts } from "@/components/ui/Toasts";
import { Cursor } from "@/components/ui/Cursor";

export function Shell({ children }: { children: ReactNode }) {
  const hydrate = useStore((s) => s.hydrate);
  const pathname = usePathname();
  useEffect(() => hydrate(), [hydrate]);
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  const bare = pathname.startsWith("/checkout") || pathname === "/order-success";
  return (
    <>
      <a href="#main" className="sr-only z-[300] bg-lime p-3 font-bold focus:not-sr-only focus:fixed focus:left-2 focus:top-2">Skip to content</a>
      <AnnouncementBar />
      <Navbar />
      <main id="main">{children}</main>
      {!bare && <Footer />}
      <CartDrawer />
      <SearchOverlay />
      <Toasts />
      <Cursor />
    </>
  );
}
