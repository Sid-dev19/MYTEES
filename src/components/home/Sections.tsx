"use client";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { categories, moods } from "@/data/products";
import { productService } from "@/services/productService";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { ProductCard } from "@/components/product/ProductCard";
import { Marquee, SectionHeading, ProductImage } from "@/components/ui/primitives";
import { Sticker } from "@/components/ui/Sticker";
import { Doodle, DoodleBackground, FloatingShape, GrainOverlay, GridBackground, BlobBackground, Reveal } from "@/components/bg";
import { TruckIcon, LeafIcon, ReturnIcon, CashIcon } from "@/components/ui/Icons";

const trending = () => productService.listSync({ sort: "popular" }).slice(0, 10);
const arrivals = () => productService.listSync({ sort: "newest" }).slice(0, 10);
const best = () => productService.listSync({ isBestseller: true, sort: "popular" }).slice(0, 8);

export function Perks() {
  const p = [
    [<TruckIcon key="a" />, "Free shipping", "On orders above ₹999"],
    [<LeafIcon key="b" />, "100% cotton", "Soft, heavy, breathable"],
    [<ReturnIcon key="c" />, "7-day returns", "No questions, no drama"],
    [<CashIcon key="d" />, "Cash on delivery", "Pay when it lands"],
  ];
  return (
    <section aria-label="Perks" className="border-b-2 border-ink bg-white">
      <div className="container-x grid grid-cols-2 gap-4 py-5 md:grid-cols-4">
        {p.map(([i, t, s]) => (
          <div key={t as string} className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-ink bg-lime">{i}</span>
            <div><p className="text-sm font-extrabold uppercase">{t}</p><p className="text-xs text-ink/60">{s}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Trending() {
  return (
    <section className="relative overflow-hidden bg-sun py-14 sm:py-20">
      <GridBackground variant="dots" className="opacity-60" />
      <DoodleBackground density="low" />
      <div className="container-x relative">
        <SectionHeading title="WHAT'S POPPIN'" sub="The tees currently causing problems." cta={{ label: "SHOP ALL", href: "/t-shirts" }} />
        <ProductCarousel products={trending()} />
      </div>
    </section>
  );
}

const catColors: Record<string, string> = { oversized: "#FF2E93", graphic: "#C6FF3D", minimal: "#27E1F5", street: "#FF6B1A", everyday: "#FFD81F", "premium-cotton": "#6C2BFF" };
const catDoodle = ["star", "bolt", "circle", "spark", "smile", "heart"] as const;

export function Categories() {
  return (
    <section className="container-x py-14 sm:py-20">
      <SectionHeading title="PICK YOUR VIBE." sub="Six ways to say it without saying a word." />
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {categories.map((c, i) => {
          const dark = c.slug === "premium-cotton";
          const sample = productService.listSync({ category: [c.slug] })[0];
          return (
            <Reveal key={c.id} delay={i * 0.05}>
              <motion.div whileHover={{ rotate: i % 2 ? 1.5 : -1.5, y: -6 }} className="h-full">
                <Link href={`/t-shirts?category=${c.slug}`} data-cursor="EXPLORE" className="group relative block aspect-[4/5] overflow-hidden rounded-[1.6rem] border-2 border-ink shadow-pop sm:aspect-[5/4] lg:aspect-[4/3]" style={{ background: catColors[c.slug] }}>
                  <div className="absolute -bottom-6 -right-6 h-[75%] w-[70%] rotate-6 overflow-hidden rounded-2xl border-2 border-ink transition-transform duration-500 group-hover:rotate-3 group-hover:scale-105">
                    {sample && <ProductImage product={sample} />}
                  </div>
                  <Doodle name={catDoodle[i]} color={dark ? "#C6FF3D" : "#0B0B0F"} size={34} className="absolute right-3 top-3 animate-floaty" />
                  <div className={`relative p-4 sm:p-6 ${dark ? "text-white" : "text-ink"}`}>
                    <h3 className="display text-3xl sm:text-5xl lg:text-6xl">{c.name}</h3>
                    <p className="mt-1 hidden max-w-[60%] text-xs font-bold sm:block">{c.tagline}</p>
                    <span className="mt-3 inline-grid h-9 w-9 place-items-center rounded-full border-2 border-ink bg-white text-ink transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              </motion.div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export function Editorial() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const hero = productService.getBySlugSync("street-code-oversized-tee")!;
  const hero2 = productService.getBySlugSync("main-character-tee")!;
  return (
    <section ref={ref} className="relative overflow-hidden border-y-2 border-ink bg-ink py-16 text-white sm:py-24">
      <GridBackground variant="retro" className="opacity-20" />
      <div className="container-x relative grid items-center gap-10 lg:grid-cols-12">
        <div className="relative z-10 lg:col-span-7">
          <h2 className="display text-[clamp(4rem,14vw,11rem)] lg:-mr-40 lg:[text-shadow:0_0_0_#000]">
            <span className="block">NO</span><span className="block text-lime">BORING</span><span className="block text-pink">TEES.</span>
          </h2>
          <div className="mt-6 space-y-1 text-lg font-bold text-white/90 sm:text-xl">
            <p>For your coffee runs.</p><p>For your late-night plans.</p><p>For doing absolutely nothing.</p>
          </div>
          <Link href="/t-shirts" className="btn btn-pop btn-lime mt-7">SHOP NOW →</Link>
        </div>
        <motion.div style={{ y }} className="relative mx-auto w-full max-w-md lg:col-span-5">
          <div className="aspect-[4/5] -rotate-3 overflow-hidden rounded-[2rem] border-[3px] border-lime"><ProductImage product={hero} /></div>
          <div className="absolute -bottom-8 -left-6 aspect-[4/5] w-[42%] rotate-6 overflow-hidden rounded-2xl border-[3px] border-pink"><ProductImage product={hero2} /></div>
          <Sticker shape="starburst" size="lg" bg="#FFD81F" rotate={12} className="absolute -right-3 -top-6">PEOPLE LOVE THIS</Sticker>
        </motion.div>
      </div>
    </section>
  );
}

export function NewArrivals() {
  return (
    <section className="relative overflow-hidden bg-cream py-14 sm:py-20">
      <GridBackground variant="checker" />
      <FloatingShape name="star" color="#7ED900" size={44} className="right-[8%] top-10" />
      <FloatingShape name="squiggle" color="#7ED900" size={70} className="left-[3%] top-24 hidden md:block" />
      <FloatingShape name="spark" color="#7ED900" size={34} className="bottom-12 left-[40%]" />
      <div className="container-x relative">
        <SectionHeading title="FRESH OUT THE BOX." sub="New energy. New fits." cta={{ label: "VIEW ALL", href: "/new-arrivals" }} />
        <ProductCarousel products={arrivals()} />
      </div>
    </section>
  );
}

export function Banners() {
  const banner = (bg: string, fg: string, title: string, sub: string, cta: string, href: string, st: string, d: "star" | "bolt" | "smile") => (
    <Reveal>
      <Link href={href} className="group relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-[1.8rem] border-2 border-ink p-6 shadow-pop transition-shadow hover:shadow-popl sm:min-h-[380px] sm:p-8" style={{ background: bg, color: fg }}>
        <GrainOverlay className="opacity-40" />
        <Doodle name={d} color={fg === "#fff" ? "#C6FF3D" : "#0B0B0F"} size={90} className="absolute -right-4 -top-4 opacity-30 animate-spinslow" />
        <Sticker bg="#fff" color="#0B0B0F" rotate={-5} className="relative self-start">{st}</Sticker>
        <div className="relative">
          <h3 className="display text-5xl sm:text-6xl lg:text-7xl">{title}</h3>
          <p className="mt-2 text-sm font-bold">{sub}</p>
          <span className="btn btn-light mt-4 shadow-pop group-hover:bg-lime">{cta} →</span>
        </div>
      </Link>
    </Reveal>
  );
  return (
    <section className="container-x grid gap-4 py-14 sm:gap-6 sm:py-20 md:grid-cols-6">
      <div className="md:col-span-6 lg:col-span-3">{banner("#6C2BFF", "#fff", "MAIN CHARACTER ENERGY", "Loud prints. Louder confidence.", "SHOP COLLECTION", "/collections/main-character-energy", "COLLECTION 01", "star")}</div>
      <div className="md:col-span-3 lg:col-span-3">
        <div className="grid h-full gap-4 sm:gap-6">
          {banner("#C6FF3D", "#0B0B0F", "OFF-DUTY UNIFORM", "Easy tees for no-plan days.", "SHOP NOW", "/collections/off-duty-uniform", "COLLECTION 02", "smile")}
        </div>
      </div>
      <div className="md:col-span-6">{banner("#FF6B1A", "#0B0B0F", "GRAPHIC ATTACK", "Prints with opinions. Wear one.", "EXPLORE", "/collections/graphic-attack", "COLLECTION 03", "bolt")}</div>
    </section>
  );
}

export function BigMarquee() {
  return (
    <div className="border-y-2 border-ink bg-pink py-4 font-display text-4xl uppercase text-ink sm:text-6xl">
      <Marquee items={["MYTEES", "✦", "NO BORING TEES", "✦", "WEAR YOUR MOOD", "✦", "NEW DROP", "✦"]} />
    </div>
  );
}

export function Bestsellers() {
  return (
    <section className="relative overflow-hidden bg-[#FF8AC4] py-14 sm:py-20">
      <BlobBackground colors={["#FFD81F", "#27E1F5", "#C6FF3D"]} className="opacity-50" />
      <GrainOverlay className="opacity-30" />
      <DoodleBackground density="low" />
      <div className="container-x relative">
        <SectionHeading title="EVERYONE WANTS THESE." sub="The ones that keep selling out." />
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
          {best().map((p, i) => <ProductCard key={p.id} product={p} tilt={i % 2 ? 0.6 : -0.6} />)}
        </div>
        <div className="mt-10 text-center"><Link href="/bestsellers" className="btn btn-pop btn-lime !px-8 !py-4">SHOP BESTSELLERS →</Link></div>
      </div>
    </section>
  );
}

export function ShopByMood() {
  return (
    <section className="container-x py-14 sm:py-20">
      <SectionHeading title="SHOP BY MOOD" sub="Tell us how you feel. We'll tell you what to wear." />
      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
        {moods.map((m, i) => (
          <Reveal key={m.slug} delay={i * 0.05}>
            <motion.div whileHover={{ rotate: i % 2 ? -2 : 2, scale: 1.03 }}>
              <Link href={`/t-shirts?mood=${m.slug}`} className="group relative flex aspect-square flex-col justify-between overflow-hidden rounded-[1.5rem] border-2 border-ink p-4 shadow-pop sm:p-6" style={{ background: m.color, color: m.text }}>
                <span aria-hidden className="display text-6xl sm:text-8xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">{m.emoji}</span>
                <div>
                  <h3 className="display text-3xl sm:text-5xl">{m.label}</h3>
                  <p className="text-xs font-bold sm:text-sm">{m.line}</p>
                  <span className="mt-2 inline-block text-xs font-extrabold uppercase underline-offset-4 group-hover:underline">Shop →</span>
                </div>
              </Link>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function MenWomen() {
  const m = productService.getBySlugSync("street-code-oversized-tee")!;
  const w = productService.getBySlugSync("hot-girl-walk-tee")!;
  const block = (bg: string, fg: string, title: string, cta: string, href: string, p: typeof m, rot: number) => (
    <Link href={href} data-cursor="SHOP" className="group relative flex min-h-[420px] items-end overflow-hidden rounded-[2rem] border-2 border-ink p-6 shadow-pop sm:min-h-[520px] sm:p-10" style={{ background: bg, color: fg }}>
      <GrainOverlay className="opacity-40" />
      <div className="absolute right-[-8%] top-6 h-[75%] w-[62%] overflow-hidden rounded-[1.5rem] border-2 border-ink transition-transform duration-500 group-hover:scale-105" style={{ transform: `rotate(${rot}deg)` }}><ProductImage product={p} /></div>
      <div className="relative">
        <h3 className="display text-5xl sm:text-7xl">{title}</h3>
        <span className="btn btn-light mt-5 shadow-pop group-hover:bg-lime">{cta} →</span>
      </div>
    </Link>
  );
  return (
    <section className="container-x grid gap-4 pb-14 sm:gap-6 sm:pb-20 md:grid-cols-2">
      <Reveal>{block("#FF6B1A", "#0B0B0F", "YOUR EVERYDAY ARMOR.", "SHOP MEN", "/men", m, 5)}</Reveal>
      <Reveal delay={0.1}>{block("#FF2E93", "#0B0B0F", "LOOK GOOD. FEEL BETTER.", "SHOP WOMEN", "/women", w, -5)}</Reveal>
    </section>
  );
}
