import type { Metadata } from "next";
import { Listing } from "@/features/Listing";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

export default function Page() {
  return <Listing title="SEARCH" sub="Found it? Add it." accent="#E6D9FF" />;
}
