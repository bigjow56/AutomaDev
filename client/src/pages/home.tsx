import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ServicesSection from "@/components/services-section";
import BenefitsSection from "@/components/benefits-section";
import PortfolioSection from "@/components/portfolio-section";
import ProjectsSection from "@/components/projects-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import ScrollProgress from "@/components/scroll-progress";

export default function Home() {
  return (
    <div className="purple-gradient text-white font-sans antialiased">
      <ScrollProgress />
      <Navigation />
      <HeroSection />
      <ServicesSection />
      <BenefitsSection />
      <ProjectsSection />
      <PortfolioSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
