import type { Metadata } from "next";
import { AccountPage } from "@/features/Account";

export const metadata: Metadata = { title: "My Orders", robots: { index: false } };
export default function Page() { return <AccountPage section="orders" />; }
