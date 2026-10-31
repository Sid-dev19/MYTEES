import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Listing } from "@/features/Listing";
import { collectionService } from "@/services/catalogServices";

type P = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return collectionService.listSync().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const c = collectionService.getBySlug((await params).slug);
  return c ? { title: c.name, description: `${c.tagline} ${c.description}`, alternates: { canonical: `/collections/${c.slug}` } } : {};
}

export default async function Page({ params }: P) {
  const c = collectionService.getBySlug((await params).slug);
  if (!c) notFound();
  return <Listing title={c.name.toUpperCase()} sub={c.tagline} base={{ collection: c.slug }} accent={c.accent} sticker="COLLECTION" />;
}
