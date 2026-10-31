import type { Metadata } from "next";
import { Listing } from "@/features/Listing";

export const metadata: Metadata = { title: "All T-Shirts", description: "Every MYTEES tee in one place. Oversized, graphic, minimal, street and premium cotton.", alternates: { canonical: "/t-shirts" } };

export default function Page() {
  return <Listing title="ALL TEES" sub="Every mood. Every fit." accent="#C6FF3D" sticker="NO BORING TEES" />;
}
