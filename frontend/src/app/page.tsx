"use client";

import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import HowToUseSection from "../components/HowToUseSection";
import CommunitySection from "../components/CommunitySection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import AnimatedBackground from "@/components/Background";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Hero section background - Custom background, NO animated background */}
      <div className="fixed inset-0 pointer-events-none z-0 h-screen">
        <div
          className="absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-green-900/5 to-transparent animate-pulse"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute top-0 right-0 w-1/3 h-1/3 bg-green-400/10 rounded-full blur-3xl animate-float"
          style={{ animationDuration: "15s" }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-green-600/10 rounded-full blur-3xl animate-float"
          style={{ animationDuration: "12s", animationDelay: "2s" }}
        ></div>
      </div>

      <Navbar />

      <div className="flex flex-col">
        {/* Hero section - no animated background */}
        <div className="h-screen">
          <HeroSection />
        </div>

        {/* Content below hero section WITH animated background */}
        <div className="relative">
          {/* Updated background container - lighter and more greenish */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-green-800/10 via-emerald-900/30 to-teal-800/20">
            <AnimatedBackground includeIcons={true} />
          </div>

          {/* Content sections */}
          <AboutSection />
          <HowToUseSection />
          <CommunitySection />
          <ContactSection />
          <Footer />
        </div>
      </div>
    </main>
  );
}
