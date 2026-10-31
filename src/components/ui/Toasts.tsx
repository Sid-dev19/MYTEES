"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/store";

export function Toasts() {
  const toasts = useStore((s) => s.toasts);
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-28 left-1/2 lg:bottom-4 z-[150] flex w-[min(92vw,380px)] -translate-x-1/2 flex-col gap-2 sm:left-auto sm:right-6 sm:translate-x-0">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id} layout initial={{ opacity: 0, y: 30, scale: 0.9, rotate: -2 }} animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }} exit={{ opacity: 0, x: 60 }}
            className="pointer-events-auto rounded-xl border-2 border-ink bg-lime px-4 py-3 text-sm font-bold shadow-pop"
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
