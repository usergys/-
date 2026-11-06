import Hero from "@/sections/Hero";
import Intro from "@/sections/Intro";
import Stats from "@/sections/Stats";
import CulturalSystems from "@/sections/CulturalSystems";
import FeaturedPatterns from "@/sections/FeaturedPatterns";
import HowItWorks from "@/sections/HowItWorks";
import TechArchitecture from "@/sections/TechArchitecture";
import ProductPreview from "@/sections/ProductPreview";
import CTA from "@/sections/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Stats />
      <CulturalSystems />
      <FeaturedPatterns />
      <HowItWorks />
      <TechArchitecture />
      <ProductPreview />
      <CTA />
    </>
  );
}
