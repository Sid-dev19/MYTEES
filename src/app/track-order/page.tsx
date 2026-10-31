import type { Metadata } from "next";
import { TrackOrder } from "@/features/TrackOrder";

export const metadata: Metadata = { title: "Track Your Order", description: "Track your MYTEES order status in real time.", alternates: { canonical: "/track-order" } };
export default function Page() { return <TrackOrder />; }
