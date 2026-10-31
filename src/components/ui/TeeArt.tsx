import type { Product } from "@/types";
import { readableOn } from "@/utils";

const BG = ["#FFE1F0", "#E6D9FF", "#E9FFB5", "#CFF8FF", "#FFE2CC", "#FFF1A8"];
const GFX = ["#FF2E93", "#C6FF3D", "#27E1F5", "#FFD81F", "#FF6B1A", "#6C2BFF"];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Branded SVG tee illustration used until real photography is uploaded.
 * `view` 0 = front, 1 = alt colourway / flat-lay (used for hover image).
 */
export function TeeArt({ product, color, view = 0, className }: { product: Pick<Product, "id" | "name" | "graphic" | "colors" | "mood" | "fit">; color?: string; view?: number; className?: string }) {
  const h = hash(product.id);
  const colors = product.colors;
  const picked = colors.find((c) => c.name === color) ?? colors[view % colors.length] ?? colors[0];
  const body = picked.hex;
  const ink = readableOn(body);
  const accent = GFX[(h + view) % GFX.length];
  const accent2 = GFX[(h + view + 2) % GFX.length];
  const bg = BG[(h + view * 2) % BG.length];
  const over = product.fit === "Oversized";
  const words = product.graphic.split(" ");
  const id = `t${product.id}${view}`;
  const sleeve = over ? 26 : 18;
  const w = over ? 250 : 224;
  const x0 = 200 - w / 2;
  const y0 = 105;
  const hem = 400;
  const path = `M ${x0 + 40} ${y0} L ${x0 - sleeve} ${y0 + 50} L ${x0 - sleeve + 30} ${y0 + 100} L ${x0 + 24} ${y0 + 78} L ${x0 + 24} ${hem} L ${200 + w / 2 - 24} ${hem} L ${200 + w / 2 - 24} ${y0 + 78} L ${200 + w / 2 + sleeve - 30} ${y0 + 100} L ${200 + w / 2 + sleeve} ${y0 + 50} L ${200 + w / 2 - 40} ${y0} Q 200 ${y0 + 42} ${x0 + 40} ${y0} Z`;

  return (
    <svg viewBox="0 0 400 500" role="img" aria-label={`${product.name} illustration`} className={className} preserveAspectRatio="xMidYMid slice">
      <defs>
        <clipPath id={`${id}c`}><path d={path} /></clipPath>
        <linearGradient id={`${id}s`} x1="0" x2="1"><stop offset="0" stopColor="#000" stopOpacity=".0" /><stop offset="1" stopColor="#000" stopOpacity=".18" /></linearGradient>
      </defs>
      <rect width="400" height="500" fill={bg} />
      <circle cx={view ? 320 : 90} cy={view ? 90 : 120} r="130" fill={accent} opacity=".35" />
      <path d="M-20 430 Q100 350 200 430 T420 400 V520 H-20Z" fill={accent2} opacity=".45" />
      <g opacity=".5" stroke="#0B0B0F" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d={view ? "M40 60l14 14M54 60L40 74" : "M330 50l14 14M344 50l-14 14"} />
        <circle cx={view ? 340 : 60} cy="450" r="9" />
      </g>
      <g transform={view ? "rotate(-4 200 300)" : ""}>
        <path d={path} fill="#0B0B0F" opacity=".12" transform="translate(7 8)" />
        <path d={path} fill={body} stroke="#0B0B0F" strokeWidth="3" strokeLinejoin="round" />
        <path d={path} fill={`url(#${id}s)`} />
        <g clipPath={`url(#${id}c)`}>
          <path d={`M ${x0 + 40} ${y0} Q 200 ${y0 + 42} ${200 + w / 2 - 40} ${y0}`} fill="none" stroke={ink} strokeOpacity=".7" strokeWidth="9" />
          {/* graphic */}
          <g transform={`translate(200 ${y0 + 150})`} textAnchor="middle">
            {product.mood === "happy" && <circle r="46" cy="-8" fill={accent} stroke="#0B0B0F" strokeWidth="3" />}
            {product.mood === "chaotic" && <path d="M0-62l12 34 36-4-26 24 14 34-36-18-30 22 4-38-32-14 38-8z" fill={accent} stroke="#0B0B0F" strokeWidth="3" />}
            {product.mood === "bold" && <rect x="-60" y="-52" width="120" height="86" rx="10" fill={accent} stroke="#0B0B0F" strokeWidth="3" transform="rotate(-6)" />}
            {product.mood === "main-character" && <path d="M0-60l14 38 40 2-32 25 11 39-33-23-33 23 11-39-32-25 40-2z" fill={accent} stroke="#0B0B0F" strokeWidth="3" />}
            {(product.mood === "chill" || product.mood === "lazy") && <path d="M-62 14q16-44 38-4t38-4 38 4" fill="none" stroke={accent} strokeWidth="10" strokeLinecap="round" />}
            {product.mood === "happy" && (
              <g stroke="#0B0B0F" strokeWidth="3" fill="none" strokeLinecap="round">
                <circle cx="-14" cy="-20" r="3" fill="#0B0B0F" /><circle cx="14" cy="-20" r="3" fill="#0B0B0F" />
                <path d="M-20 -2q20 20 40 0" />
              </g>
            )}
            {words.slice(0, 3).map((wd, i) => (
              <text
                key={i}
                y={words.length === 1 ? 82 : 66 + i * 26}
                fontFamily="var(--font-display), Impact, sans-serif"
                fontSize={wd.length > 7 ? 30 : words.length === 1 ? 46 : 34}
                fill={ink}
                letterSpacing="1"
              >
                {wd}
              </text>
            ))}
          </g>
        </g>
      </g>
    </svg>
  );
}
