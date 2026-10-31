import type { Metadata } from "next";
import { Listing } from "@/features/Listing";

export const metadata: Metadata = { title: "New Arrivals", description: "Fresh out the box. The latest MYTEES drops.", alternates: { canonical: "/new-arrivals" } };

export default function Page() {
  return <Listing title="NEW ARRIVALS" sub="New energy. New fits." base={{ isNew: true }} accent="#27E1F5" sticker="JUST LANDED" />;
}
