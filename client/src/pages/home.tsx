import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ServicesSection from "@/components/services-section";
import BenefitsSection from "@/components/benefits-section";
import PortfolioSection from "@/components/portfolio-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import ChatWidget from "@/components/chat-widget";

export default function Home() {
  return (
    <div className="bg-dark text-white font-sans antialiased">
      <Navigation />
      <HeroSection />
      <ServicesSection />
      <BenefitsSection />
      <PortfolioSection />
      <ContactSection />
      <Footer />
      <ChatWidget />
    </div>
  );
}
