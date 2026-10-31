import type { Metadata } from "next";
import { AccountPage } from "@/features/Account";

export const metadata: Metadata = { title: "My Account", robots: { index: false } };
export default function Page() { return <AccountPage section="profile" />; }
