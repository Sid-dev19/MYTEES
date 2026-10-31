import type { Metadata } from "next";
import Link from "next/link";
import { BlobBackground, Doodle, DoodleBackground, FloatingShape, FunkyGradientBackground, GrainOverlay, GridBackground, Reveal } from "@/components/bg";
import { Marquee } from "@/components/ui/primitives";
import { Sticker } from "@/components/ui/Sticker";

export const metadata: Metadata = { title: "About — We Don't Make Boring Tees", description: "MYTEES is a young Indian streetwear brand built on self-expression, comfort and creativity.", alternates: { canonical: "/about" } };

const values = [
  { t: "SELF EXPRESSION", d: "Clothes are the loudest thing you say before you speak. We make sure it's worth hearing.", bg: "#FF8AC4", fg: "#0B0B0F" },
  { t: "COMFORT FIRST", d: "Heavy, soft, breathable cotton. If it doesn't feel like your favourite tee, it doesn't ship.", bg: "#27E1F5", fg: "#0B0B0F" },
  { t: "REAL QUALITY", d: "Prints that survive the wash. Seams that survive your weekend. No shortcuts.", bg: "#C6FF3D", fg: "#0B0B0F" },
  { t: "STREET CULTURE", d: "Born in group chats, chai stalls and late-night rooftops. Made for the way we actually live.", bg: "#6C2BFF", fg: "#fff" },
];

export default function Page() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b-2 border-ink text-white">
        <FunkyGradientBackground from="#FF2E93" via="#6C2BFF" to="#FF6B1A" />
        <GrainOverlay />
        <DoodleBackground color="#fff" />
        <div className="container-x relative py-16 sm:py-28">
          <Sticker bg="#C6FF3D" rotate={-4}>OUR MANIFESTO</Sticker>
          <h1 className="display mt-5 text-[clamp(3.5rem,13vw,10rem)] [text-shadow:6px_6px_0_#0B0B0F]">WE DON'T MAKE <span className="text-sun">BORING</span> TEES.</h1>
          <p className="mt-6 max-w-2xl text-lg font-bold sm:text-2xl">MYTEES started with a simple problem: every tee in the shop looked the same. So we made ones that don't.</p>
        </div>
      </section>

      <div className="border-b-2 border-ink bg-ink py-3 font-display text-3xl uppercase text-lime sm:text-5xl"><Marquee items={["SELF EXPRESSION", "✦", "COMFORT", "✦", "QUALITY", "✦", "STREETWEAR", "✦", "INDIAN YOUTH", "✦", "CREATIVITY", "✦"]} /></div>

      <section className="container-x grid gap-10 py-16 sm:py-24 lg:grid-cols-2">
        <Reveal><h2 className="display text-5xl sm:text-7xl">BUILT FOR <span className="text-pink">INDIAN YOUTH.</span></h2></Reveal>
        <Reveal delay={0.1}>
          <div className="space-y-4 text-base font-medium leading-relaxed sm:text-lg">
            <p>We're a generation that grew up on the internet and street corners at the same time. We code-switch between memes and mithai, hoodies and haldi. Our wardrobe should too.</p>
            <p>So we design tees that carry a mood, a joke, a thought — then cut them in premium cotton with fits that actually work for Indian bodies and Indian summers.</p>
            <p>Every drop is small, deliberate and loud. If a tee doesn't make us smile, it doesn't make the cut.</p>
          </div>
        </Reveal>
      </section>

      <section className="relative border-y-2 border-ink bg-cream py-16 sm:py-24">
        <GridBackground variant="dots" />
        <div className="container-x relative grid gap-4 sm:grid-cols-2 sm:gap-6">
          {values.map((v, i) => (
            <Reveal key={v.t} delay={i * 0.06}>
              <div className="relative h-full overflow-hidden rounded-[1.6rem] border-2 border-ink p-6 shadow-pop sm:p-8" style={{ background: v.bg, color: v.fg }}>
                <FloatingShape name={(["star", "heart", "bolt", "smile"] as const)[i]} color={v.fg} size={48} className="right-4 top-4 opacity-40" />
                <h3 className="display text-4xl sm:text-5xl">{v.t}</h3>
                <p className="mt-3 max-w-md font-semibold">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-sun py-16 text-center sm:py-24">
        <BlobBackground colors={["#FF8AC4", "#27E1F5", "#C6FF3D"]} className="opacity-50" />
        <Doodle name="smile" size={70} color="#fff" className="mx-auto animate-floaty drop-shadow-[3px_3px_0_#0B0B0F]" />
        <h2 className="display relative mt-4 text-5xl sm:text-8xl">READY TO WEAR YOUR MOOD?</h2>
        <Link href="/t-shirts" className="btn btn-pop btn-dark relative mt-8 !px-10 !py-4 text-base !text-lime">SHOP THE TEES →</Link>
      </section>
    </>
  );
}
