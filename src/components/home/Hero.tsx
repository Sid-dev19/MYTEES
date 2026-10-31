"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { BlobBackground, Doodle, FloatingShape, FunkyGradientBackground, GrainOverlay, GridBackground } from "@/components/bg";
import { Sticker } from "@/components/ui/Sticker";
import { ProductImage } from "@/components/ui/primitives";
import { productService } from "@/services/productService";

export function Hero() {
  const reduce = useReducedMotion();
  const [fine, setFine] = useState(false);
  useEffect(() => setFine(window.matchMedia("(hover:hover) and (pointer:fine)").matches), []);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 }), sy = useSpring(my, { stiffness: 60, damping: 18 });
  const on = fine && !reduce;
  const layer = (k: number) => ({ x: useTransform(sx, (v) => (on ? v * k : 0)), y: useTransform(sy, (v) => (on ? v * k : 0)) });
  const l1 = layer(-14), l2 = layer(22), l3 = layer(40), l4 = layer(-28);
  const hero = productService.getBySlugSync("chaos-club-oversized-tee")!;

  return (
    <section
      className="relative isolate overflow-hidden border-b-2 border-ink text-white"
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5); }}
    >
      <motion.div style={l1} className="absolute -inset-10"><FunkyGradientBackground /></motion.div>
      <motion.div style={l4} className="absolute -inset-10"><BlobBackground colors={["#27E1F5", "#FFD81F", "#FF2E93"]} className="opacity-50" /></motion.div>
      <GridBackground variant="retro" className="opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black_60%)]" />
      <GrainOverlay />

      <div className="container-x relative grid items-center gap-6 pb-16 pt-10 sm:pt-14 lg:min-h-[680px] lg:grid-cols-[1.15fr_1fr] lg:pb-20">
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Sticker bg="#C6FF3D" rotate={-4} size="md">NEW DROP ✦ JUST LANDED</Sticker>
          </motion.div>
          <h1 className="display mt-5 text-[clamp(4rem,15vw,11.5rem)] [text-shadow:5px_5px_0_#0B0B0F] sm:[text-shadow:7px_7px_0_#0B0B0F]">
            <motion.span className="block" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>WEAR</motion.span>
            <motion.span className="block" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>YOUR</motion.span>
            <motion.span className="block text-sun" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>MOOD<span className="text-lime">.</span></motion.span>
          </h1>
          <p className="mt-6 max-w-md text-lg font-bold sm:text-xl">Premium tees for people who don't do boring.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/new-arrivals" className="btn btn-pop btn-lime !px-8 !py-4 text-base">SHOP THE DROP →</Link>
            <Link href="/collections/main-character-energy" className="btn btn-pop btn-light !px-8 !py-4 text-base">EXPLORE COLLECTION</Link>
          </div>
        </div>

        <div className="relative mx-auto mt-6 w-full max-w-[460px] lg:max-w-none">
          <motion.div style={l2} className="relative mx-auto aspect-[4/5] w-[78%] max-w-[420px] rotate-3 overflow-hidden rounded-[2rem] border-[3px] border-ink bg-cream shadow-[10px_10px_0_0_#0B0B0F] lg:w-[84%]">
            <ProductImage product={hero} priority />
            <div className="absolute inset-0 grain opacity-60" />
          </motion.div>
          <motion.div style={l3} className="absolute -left-1 top-6 z-10 sm:left-2"><Sticker shape="starburst" size="lg" bg="#FFD81F" rotate={-12}>100% ATTITUDE</Sticker></motion.div>
          <motion.div style={l3} className="absolute -right-1 top-[38%] z-10 sm:right-0"><Sticker shape="wavy" bg="#FF2E93" rotate={8} size="md">MADE FOR YOU</Sticker></motion.div>
          <motion.div style={l4} className="absolute bottom-2 left-0 z-10"><Sticker shape="hand" bg="#27E1F5" rotate={-5} size="lg">no boring tees!</Sticker></motion.div>
          <motion.div style={l3} className="absolute -top-2 right-[18%] z-10"><Doodle name="spark" color="#C6FF3D" size={46} className="animate-spinslow" /></motion.div>
          <motion.div style={l4} className="absolute bottom-[14%] right-0 z-10"><Doodle name="smile" color="#FFD81F" size={54} className="drop-shadow-[3px_3px_0_#0B0B0F]" /></motion.div>
        </div>
      </div>

      <FloatingShape name="star" color="#FFD81F" size={40} className="left-[48%] top-10 hidden md:block" rotate={14} />
      <FloatingShape name="bolt" color="#C6FF3D" size={32} className="bottom-24 left-[4%] hidden md:block" rotate={-10} delay={1} />
      <FloatingShape name="arrow" color="#fff" size={64} className="bottom-6 left-[40%] hidden lg:block" delay={2} />
    </section>
  );
}
