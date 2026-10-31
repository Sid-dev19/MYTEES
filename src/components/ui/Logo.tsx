import Link from "next/link";
import { cn } from "@/utils";

export function Logo({ className, light = false, stacked = false }: { className?: string; light?: boolean; stacked?: boolean }) {
  const c = light ? "text-white" : "text-ink";
  return (
    <Link href="/" aria-label="MYTEES — home" className={cn("inline-flex items-center gap-0.5 leading-none select-none group", className)}>
      {stacked ? (
        <span className={cn("display flex flex-col text-4xl", c)}>
          <span>MY</span>
          <span className="-mt-1 text-pink">TEES</span>
        </span>
      ) : (
        <span className={cn("display text-[28px] sm:text-[34px] tracking-[0.02em] flex items-end", c)}>
          MY<span className="relative text-pink inline-block group-hover:-rotate-6 transition-transform">TEES
            <svg aria-hidden viewBox="0 0 24 24" className="absolute -top-2 -right-3 h-3.5 w-3.5 fill-lime stroke-ink" strokeWidth="2"><path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12z" /></svg>
          </span>
        </span>
      )}
    </Link>
  );
}
