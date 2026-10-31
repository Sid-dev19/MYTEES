import type { Metadata } from "next";
import { AuthForm } from "@/features/Auth";

export const metadata: Metadata = { title: "Log In", robots: { index: false } };
export default function Page() { return <AuthForm mode="login" />; }
