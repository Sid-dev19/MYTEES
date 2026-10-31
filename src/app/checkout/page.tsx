import type { Metadata } from "next";
import { AddressStep, CheckoutShell } from "@/features/Checkout";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };
export default function Page() { return <CheckoutShell step="address"><AddressStep /></CheckoutShell>; }
