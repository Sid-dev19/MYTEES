import type { SVGProps } from "react";

const base = (p: SVGProps<SVGSVGElement>) => ({ viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, width: 22, height: 22, "aria-hidden": true, ...p });

export const SearchIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>;
export const UserIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></svg>;
export const HeartIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M12 21s-9-5.7-9-12a5 5 0 019-3 5 5 0 019 3c0 6.3-9 12-9 12z" /></svg>;
export const BagIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M5 8h14l-1 13H6L5 8z" /><path d="M9 8V6a3 3 0 016 0v2" /></svg>;
export const MenuIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M3 6h18M3 12h18M3 18h12" /></svg>;
export const CloseIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M5 5l14 14M19 5L5 19" /></svg>;
export const TrashIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>;
export const FilterIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M3 5h18M6 12h12M10 19h4" /></svg>;
export const ChevronIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M6 9l6 6 6-6" /></svg>;
export const InstagramIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></svg>;
export const FacebookIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M14 8h3V4h-3a4 4 0 00-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" /></svg>;
export const YoutubeIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><rect x="2" y="5" width="20" height="14" rx="4" /><path d="M10 9l5 3-5 3z" fill="currentColor" /></svg>;
export const TruckIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M2 6h11v10H2zM13 10h4l4 3v3h-8" /><circle cx="6.5" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></svg>;
export const LeafIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15M5 19l8-8" /></svg>;
export const ReturnIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M4 12a8 8 0 108-8H7M7 1L4 4l3 3" /></svg>;
export const CashIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></svg>;
export const ShirtIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M8 3L2 7l3 4 3-1v11h8V10l3 1 3-4-6-4c-1 2-7 2-8 0z" transform="translate(-1 0)" /></svg>;
