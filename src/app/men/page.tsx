import type { Metadata } from "next";
import { Listing } from "@/features/Listing";

export const metadata: Metadata = { title: "Men's T-Shirts", description: "Oversized, graphic and street tees for men. Your everyday armor.", alternates: { canonical: "/men" } };

export default function Page() {
  return <Listing title="MEN" sub="Your everyday armor." base={{ gender: "men" }} accent="#FF6B1A" hideGender sticker="NEW DROP" />;
}
