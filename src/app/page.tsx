// src/app/page.tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import ServicesPreview from "@/components/home/ServicesPreview";
import HowItWorks from "@/components/home/HowItWorks";
import TeamSection from "@/components/home/TeamSection";
import Testimonials from "@/components/home/Testimonials";
import GalleryStrip from "@/components/home/GalleryStrip";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesPreview />
        <HowItWorks />
        <TeamSection />
        <Testimonials />
        <GalleryStrip />
      </main>
      <Footer />
    </>
  );
}