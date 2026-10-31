import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/features/ProductDetail";
import { productService } from "@/services/productService";
import { SITE } from "@/constants";

type P = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return productService.allSync().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = productService.getBySlugSync((await params).slug);
  if (!p) return {};
  const desc = `${p.name} — ${p.fit} fit, ${p.fabric}. ₹${p.price} (${p.discount}% off). Free shipping above ₹999.`;
  return {
    title: p.name,
    description: desc,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { title: `${p.name} | MYTEES`, description: desc, type: "website", url: `${SITE.url}/product/${p.slug}` },
  };
}

export default async function Page({ params }: P) {
  const p = productService.getBySlugSync((await params).slug);
  if (!p) notFound();
  const ld = {
    "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description,
    brand: { "@type": "Brand", name: "MYTEES" }, image: p.images,
    aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviewCount },
    offers: { "@type": "Offer", priceCurrency: "INR", price: p.price, availability: "https://schema.org/InStock", url: `${SITE.url}/product/${p.slug}` },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <ProductDetail product={p} />
    </>
  );
}
