import type { Metadata } from "next";
import { WishlistPage } from "@/features/Wishlist";

export const metadata: Metadata = { title: "Your Wishlist", robots: { index: false } };
export default function Page() { return <WishlistPage />; }
