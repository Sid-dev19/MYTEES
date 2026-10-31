import type { Metadata } from "next";
import { Listing } from "@/features/Listing";

export const metadata: Metadata = { title: "Women's T-Shirts", description: "Look good. Feel better. Oversized and graphic tees for women.", alternates: { canonical: "/women" } };

export default function Page() {
  return <Listing title="WOMEN" sub="Look good. Feel better." base={{ gender: "women" }} accent="#FF8AC4" hideGender sticker="MAIN CHARACTER" />;
}
