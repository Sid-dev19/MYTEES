import type { Metadata, Viewport } from "next";
import { Anton, DM_Sans, Permanent_Marker } from "next/font/google";
import "@/styles/globals.css";
import { Shell } from "@/components/layout/Shell";
import { SITE } from "@/constants";

const display = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const hand = Permanent_Marker({ subsets: ["latin"], weight: "400", variable: "--font-hand", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "MYTEES — Wear Your Mood. Premium Gen-Z Tees", template: "%s | MYTEES" },
  description: SITE.description,
  openGraph: { title: "MYTEES — Wear Your Mood.", description: SITE.description, siteName: "MYTEES", type: "website", locale: "en_IN" },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#6C2BFF" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${hand.variable}`}>
      <body><Shell>{children}</Shell></body>
    </html>
  );
}
