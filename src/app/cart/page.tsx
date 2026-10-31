import type { Metadata } from "next";
import { CartPage } from "@/features/Cart";

export const metadata: Metadata = { title: "Your Bag", robots: { index: false } };
export default function Page() { return <CartPage />; }
