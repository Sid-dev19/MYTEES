import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/utils";

type Shape = "rounded" | "circle" | "starburst" | "hand" | "wavy";

const STAR_CLIP =
  "polygon(50% 0%,61% 12%,76% 6%,80% 21%,95% 25%,89% 40%,100% 50%,89% 60%,95% 75%,80% 79%,76% 94%,61% 88%,50% 100%,39% 88%,24% 94%,20% 79%,5% 75%,11% 60%,0% 50%,11% 40%,5% 25%,20% 21%,24% 6%,39% 12%)";

export function Sticker({
  children, shape = "rounded", bg = "#C6FF3D", color = "#0B0B0F", rotate = -6, className, size = "md", style,
}: {
  children: ReactNode; shape?: Shape; bg?: string; color?: string; rotate?: number; className?: string; size?: "xs" | "sm" | "md" | "lg"; style?: CSSProperties;
}) {
  const sizes = {
    xs: "text-[9px] px-2 py-0.5",
    sm: "text-[10px] px-2.5 py-1",
    md: "text-xs sm:text-sm px-3.5 py-1.5",
    lg: "text-base sm:text-lg px-5 py-2.5",
  }[size];
  const round = shape === "circle" || shape === "starburst";
  const squareSize = { xs: "h-14 w-14", sm: "h-16 w-16", md: "h-20 w-20 sm:h-24 sm:w-24", lg: "h-28 w-28 sm:h-32 sm:w-32" }[size];

  if (shape === "starburst") {
    return (
      <span
        className={cn("inline-grid place-items-center font-display uppercase text-center leading-[0.95] select-none", squareSize, className)}
        style={{ transform: `rotate(${rotate}deg)`, filter: "drop-shadow(3px 3px 0 #0B0B0F)", ...style }}
      >
        <span className="absolute" />
        <span className="grid place-items-center h-full w-full p-2 text-[10px] sm:text-xs" style={{ background: bg, color, clipPath: STAR_CLIP }}>
          <span className="max-w-[80%]">{children}</span>
        </span>
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-display uppercase tracking-wide border-2 border-ink shadow-pops select-none leading-none text-center",
        shape === "circle" && cn("rounded-full", squareSize, "p-2 text-[10px] sm:text-xs"),
        shape === "rounded" && cn("rounded-lg", sizes),
        shape === "hand" && cn("font-hand normal-case tracking-normal rounded-[18px_6px_20px_8px]", sizes),
        shape === "wavy" && cn("rounded-[50%_50%_45%_55%/60%_40%_60%_40%]", sizes, "px-5"),
        round && "leading-[1]",
        className,
      )}
      style={{ background: bg, color, transform: `rotate(${rotate}deg)`, ...style }}
    >
      {children}
    </span>
  );
}
