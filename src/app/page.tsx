import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Banners, Bestsellers, BigMarquee, Categories, Editorial, MenWomen, NewArrivals, Perks, ShopByMood, StoryRail, Trending } from "@/components/home/Sections";

export const metadata: Metadata = {
  title: { absolute: "MYTEES — Wear Your Mood. Premium Gen-Z Tees" },
  description: "Premium tees for people who don't do boring. Shop oversized, graphic & streetwear T-shirts. Free shipping above ₹999.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <StoryRail />
      <Perks />
      <Trending />
      <Categories />
      <Editorial />
      <NewArrivals />
      <Banners />
      <BigMarquee />
      <Bestsellers />
      <ShopByMood />
      <MenWomen />
    </>
  );
}
