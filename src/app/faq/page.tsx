import type { Metadata } from "next";
import Link from "next/link";
import { faqs } from "@/data/misc";
import { Accordion } from "@/components/ui/primitives";
import { DoodleBackground, GrainOverlay } from "@/components/bg";

export const metadata: Metadata = { title: "FAQ", description: "Answers on shipping, returns, sizing and more.", alternates: { canonical: "/faq" } };

export default function Page() {
  const ld = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="relative overflow-hidden border-b-2 border-ink bg-[#FFF1A8]">
        <GrainOverlay /><DoodleBackground density="low" />
        <div className="container-x relative py-12 sm:py-20"><h1 className="display text-6xl sm:text-9xl">GOT <span className="text-pink">QUESTIONS?</span></h1><p className="mt-2 text-lg font-bold">We've got answers.</p></div>
      </section>
      <div className="container-x max-w-3xl py-12 sm:py-16">
        <Accordion items={faqs.map((f) => ({ title: f.q, body: f.a }))} />
        <p className="mt-8 text-sm font-bold">Still stuck? <Link href="/contact" className="text-purple underline">Talk to a human →</Link></p>
      </div>
    </>
  );
}
