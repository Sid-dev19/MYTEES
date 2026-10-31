import type { Metadata } from "next";
import { OrderSuccess } from "@/features/OrderSuccess";

export const metadata: Metadata = { title: "Order Confirmed", robots: { index: false } };
export default function Page() { return <OrderSuccess />; }
