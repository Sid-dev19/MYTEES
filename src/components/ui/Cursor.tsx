"use client";
import { useEffect, useRef, useState } from "react";

/** Subtle desktop-only cursor follower. Elements opt in with data-cursor="VIEW" or data-cursor-grow. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [grow, setGrow] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const ok = window.matchMedia("(hover:hover) and (pointer:fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(ok);
    if (!ok) return;
    let raf = 0, x = 0, y = 0, cx = 0, cy = 0;
    const move = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      const t = e.target as HTMLElement | null;
      const tagged = t?.closest?.("[data-cursor]") as HTMLElement | null;
      setLabel(tagged?.dataset.cursor ?? "");
      setGrow(!!t?.closest?.("a,button,[data-cursor-grow]"));
    };
    const loop = () => {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
      if (ref.current) ref.current.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  if (!enabled) return null;
  const big = !!label;
  return (
    <div ref={ref} aria-hidden className="cursor-fx pointer-events-none fixed left-0 top-0 z-[200]">
      <div
        className="grid place-items-center rounded-full border-2 border-ink bg-lime font-display text-[11px] uppercase text-ink transition-all duration-200"
        style={{ width: big ? 72 : grow ? 40 : 14, height: big ? 72 : grow ? 40 : 14, opacity: big || grow ? 0.95 : 0.8, mixBlendMode: big ? "normal" : "multiply" }}
      >
        {label}
      </div>
    </div>
  );
}
