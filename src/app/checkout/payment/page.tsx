import type { Metadata } from "next";
import { PaymentStep } from "@/features/Checkout";

export const metadata: Metadata = { title: "Checkout — Payment", robots: { index: false } };
export default function Page() { return <PaymentStep />; }
