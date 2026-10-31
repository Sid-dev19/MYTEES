import type { Metadata } from "next";
import { ContactPage } from "@/features/Contact";

export const metadata: Metadata = { title: "Contact", description: "Get in touch with the MYTEES team.", alternates: { canonical: "/contact" } };
export default function Page() { return <ContactPage />; }
