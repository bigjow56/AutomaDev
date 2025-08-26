import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? "bg-dark/90 backdrop-blur-md border-b border-dark-tertiary/30" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span 
              className="text-2xl font-bold text-white cursor-pointer"
              onClick={() => scrollToSection("home")}
              data-testid="logo-automadev"
            >
              AutomaDev
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button
                onClick={() => scrollToSection("home")}
                className="text-gray-300 hover:text-primary transition-colors duration-300 font-medium"
                data-testid="nav-home"
              >
                Início
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-gray-300 hover:text-primary transition-colors duration-300 font-medium"
                data-testid="nav-services"
              >
                Serviços
              </button>
              <button
                onClick={() => scrollToSection("benefits")}
                className="text-gray-300 hover:text-primary transition-colors duration-300 font-medium"
                data-testid="nav-benefits"
              >
                Benefícios
              </button>
              <button
                onClick={() => scrollToSection("portfolio")}
                className="text-gray-300 hover:text-primary transition-colors duration-300 font-medium"
                data-testid="nav-portfolio"
              >
                Portfolio
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-300 hover:text-primary transition-colors duration-300 font-medium"
                data-testid="nav-contact"
              >
                Contato
              </button>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              onClick={() => scrollToSection("contact")}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 font-semibold transition-all duration-300 transform hover:scale-105"
              data-testid="button-start-project"
            >
              Começar Projeto
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-dark-secondary/95 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => scrollToSection("home")}
              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-primary"
              data-testid="mobile-nav-home"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-primary"
              data-testid="mobile-nav-services"
            >
              Serviços
            </button>
            <button
              onClick={() => scrollToSection("benefits")}
              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-primary"
              data-testid="mobile-nav-benefits"
            >
              Benefícios
            </button>
            <button
              onClick={() => scrollToSection("portfolio")}
              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-primary"
              data-testid="mobile-nav-portfolio"
            >
              Portfolio
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-primary"
              data-testid="mobile-nav-contact"
            >
              Contato
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
