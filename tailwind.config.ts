import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0F", cream: "#FFF6E6", paper: "#FFFCF5",
        purple: "#6C2BFF", pink: "#FF2E93", lime: "#C6FF3D",
        orange: "#FF6B1A", cobalt: "#1F4BFF", cyan: "#27E1F5", sun: "#FFD81F",
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        hand: ["var(--font-hand)", "cursive"],
      },
      boxShadow: {
        pop: "4px 4px 0 0 #0B0B0F", popl: "7px 7px 0 0 #0B0B0F", pops: "2px 2px 0 0 #0B0B0F",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        floaty: { "0%,100%": { transform: "translateY(0) rotate(var(--r,0deg))" }, "50%": { transform: "translateY(-12px) rotate(calc(var(--r,0deg) + 6deg))" } },
        spinslow: { to: { transform: "rotate(360deg)" } },
        shimmer: { to: { backgroundPosition: "-200% 0" } },
      },
      animation: {
        marquee: "marquee 28s linear infinite", floaty: "floaty 6s ease-in-out infinite",
        spinslow: "spinslow 18s linear infinite", shimmer: "shimmer 1.4s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
