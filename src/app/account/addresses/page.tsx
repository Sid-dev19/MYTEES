import type { Metadata } from "next";
import { AccountPage } from "@/features/Account";

export const metadata: Metadata = { title: "My Addresses", robots: { index: false } };
export default function Page() { return <AccountPage section="addresses" />; }
