import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { FleetPreview } from "@/components/sections/FleetPreview";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { LocationsStrip } from "@/components/sections/LocationsStrip";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FleetPreview />
        <HowItWorksSection />
        <LocationsStrip />
      </main>
      <Footer />
    </>
  );
}
