import type { Metadata } from "next";
import { Listing } from "@/features/Listing";

export const metadata: Metadata = { title: "Bestsellers", description: "Everyone wants these. Our most-loved tees.", alternates: { canonical: "/bestsellers" } };

export default function Page() {
  return <Listing title="BESTSELLERS" sub="Everyone wants these." base={{ isBestseller: true }} accent="#FFD81F" sticker="HOT RIGHT NOW" />;
}
