"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/utils";

export function GrainOverlay({ className }: { className?: string }) {
  return <div aria-hidden className={cn("grain absolute inset-0 pointer-events-none", className)} />;
}

export function GridBackground({ variant = "dots", className }: { variant?: "dots" | "checker" | "retro"; className?: string }) {
  const v = variant === "dots" ? "dots-bg" : variant === "checker" ? "checker-bg" : "retro-grid";
  return <div aria-hidden className={cn("absolute inset-0 pointer-events-none", v, className)} />;
}

export function BlobBackground({ colors = ["#FF2E93", "#6C2BFF", "#FF6B1A"], className }: { colors?: string[]; className?: string }) {
  const pos = ["-top-24 -left-24 h-72 w-72", "top-1/3 -right-24 h-80 w-80", "-bottom-24 left-1/3 h-72 w-72"];
  return (
    <div aria-hidden className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {colors.slice(0, 3).map((c, i) => (
        <div key={i} className={cn("absolute blur-3xl opacity-60 rounded-[45%_55%_60%_40%/50%_40%_60%_50%]", pos[i])} style={{ background: c }} />
      ))}
    </div>
  );
}

export function FunkyGradientBackground({ from = "#6C2BFF", via = "#FF2E93", to = "#FF6B1A", className, children }: { from?: string; via?: string; to?: string; className?: string; children?: ReactNode }) {
  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)} aria-hidden style={{ background: `radial-gradient(circle at 15% 20%, ${via}, transparent 55%), radial-gradient(circle at 85% 80%, ${to}, transparent 55%), ${from}` }}>
      {children}
    </div>
  );
}

const doodles: Record<string, ReactNode> = {
  star: <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.7L6 22l1.5-7.2L2 10l7.1-1.1z" />,
  spark: <path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12z" />,
  bolt: <path d="M13 0L3 14h7l-2 10 11-15h-7z" />,
  heart: <path d="M12 21s-9-5.7-9-12a5 5 0 019-3 5 5 0 019 3c0 6.3-9 12-9 12z" />,
  x: <path d="M4 4l16 16M20 4L4 20" fill="none" strokeWidth="4" strokeLinecap="round" />,
  circle: <circle cx="12" cy="12" r="9" fill="none" strokeWidth="3.5" />,
  squiggle: <path d="M2 12c3-6 5-6 8 0s5 6 8 0 3-4 4-3" fill="none" strokeWidth="3.5" strokeLinecap="round" />,
  arrow: <path d="M3 18c6-1 12-5 15-13m0 0l-6 1m6-1l1 6" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />,
  smile: (
    <>
      <circle cx="12" cy="12" r="11" />
      <circle cx="8.5" cy="9.5" r="1.6" fill="#0B0B0F" stroke="none" />
      <circle cx="15.5" cy="9.5" r="1.6" fill="#0B0B0F" stroke="none" />
      <path d="M6.5 14c1.5 3.5 9.5 3.5 11 0" fill="none" stroke="#0B0B0F" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
};

export type DoodleName = keyof typeof doodles;

export function Doodle({ name, color = "#0B0B0F", size = 40, className, style }: { name: DoodleName; color?: string; size?: number; className?: string; style?: CSSProperties }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" width={size} height={size} fill={color} stroke={color} className={className} style={style}>
      {doodles[name]}
    </svg>
  );
}

/** Gently floating / rotating decorative shape. Sits absolutely; place inside a relative parent. */
export function FloatingShape({ name, color, size = 40, className, rotate = 0, delay = 0, spin = false }: { name: DoodleName; color?: string; size?: number; className?: string; rotate?: number; delay?: number; spin?: boolean }) {
  return (
    <div aria-hidden className={cn("absolute pointer-events-none", spin ? "animate-spinslow" : "animate-floaty", className)} style={{ ["--r" as string]: `${rotate}deg`, animationDelay: `${delay}s` }}>
      <Doodle name={name} color={color} size={size} />
    </div>
  );
}

export function DoodleBackground({ color = "#0B0B0F", className, density = "normal" }: { color?: string; className?: string; density?: "low" | "normal" }) {
  const items: { n: DoodleName; cls: string; s: number; r: number }[] = [
    { n: "star", cls: "top-[8%] left-[4%]", s: 34, r: -12 },
    { n: "spark", cls: "top-[18%] right-[6%]", s: 30, r: 10 },
    { n: "squiggle", cls: "bottom-[12%] left-[10%]", s: 56, r: -6 },
    { n: "x", cls: "bottom-[20%] right-[9%]", s: 26, r: 0 },
    { n: "circle", cls: "top-[45%] left-[1%]", s: 32, r: 0 },
    { n: "heart", cls: "top-[60%] right-[2%]", s: 28, r: 14 },
    { n: "bolt", cls: "top-[5%] left-[48%]", s: 26, r: 12 },
  ];
  return (
    <div aria-hidden className={cn("absolute inset-0 overflow-hidden pointer-events-none opacity-60 hidden sm:block", className)}>
      {(density === "low" ? items.slice(0, 4) : items).map((d, i) => (
        <FloatingShape key={i} name={d.n} color={color} size={d.s} rotate={d.r} delay={i * 0.6} className={d.cls} />
      ))}
    </div>
  );
}

/** Wrapper that fades children up on scroll. */
export function Reveal({ children, delay = 0, className, y = 28 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
