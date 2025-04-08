import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import HowToUseSection from "../components/HowToUseSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-900/5 to-transparent animate-pulse"
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
      <HeroSection />
      <AboutSection />
      <HowToUseSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
