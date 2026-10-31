import type { Metadata } from "next";
import { AuthForm } from "@/features/Auth";

export const metadata: Metadata = { title: "Forgot Password", robots: { index: false } };
export default function Page() { return <AuthForm mode="forgot" />; }
