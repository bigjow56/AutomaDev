import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import AnimatedLogo from "@/components/animated-logo";
import { useSectionDetection } from "@/hooks/use-section-detection";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentSection, isInPortfolioOrProjects } = useSectionDetection();

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
    <motion.nav 
      className="fixed top-0 w-full z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Borda animada */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
        animate={{
          opacity: isInPortfolioOrProjects ? 1 : 0,
          scaleX: isInPortfolioOrProjects ? 1 : 0.5,
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      
      <motion.div
        className={`relative transition-all duration-500 ${
          isScrolled ? "bg-dark/90 backdrop-blur-md border-b border-dark-tertiary/30" : "bg-transparent"
        }`}
        animate={{
          height: isInPortfolioOrProjects ? "56px" : "64px",
          borderColor: isInPortfolioOrProjects ? "rgba(0, 212, 170, 0.5)" : "rgba(255, 255, 255, 0.1)",
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex justify-between items-center"
            animate={{
              height: isInPortfolioOrProjects ? "56px" : "64px",
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Logo Animada */}
            <motion.div 
              className="flex-shrink-0 flex items-center cursor-pointer"
              onClick={() => scrollToSection("home")}
              data-testid="logo-automadev"
              animate={{
                scale: isInPortfolioOrProjects ? 0.8 : 1,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              whileHover={{ scale: isInPortfolioOrProjects ? 0.9 : 1.1 }}
              whileTap={{ scale: isInPortfolioOrProjects ? 0.75 : 0.95 }}
            >
              <AnimatedLogo 
                size={isInPortfolioOrProjects ? "small" : "medium"} 
                className="mr-3" 
              />
              <motion.span 
                className="text-white font-bold"
                animate={{
                  fontSize: isInPortfolioOrProjects ? "1.25rem" : "1.5rem",
                  opacity: isInPortfolioOrProjects ? 0.9 : 1,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                AutomaDev
              </motion.span>
            </motion.div>

          {/* Desktop Navigation */}
          <motion.div 
            className="hidden md:block"
            animate={{
              scale: isInPortfolioOrProjects ? 0.9 : 1,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="ml-10 flex items-baseline space-x-8">
              {[
                { id: "home", label: "Início" },
                { id: "services", label: "Serviços" },
                { id: "benefits", label: "Benefícios" },
                { id: "portfolio", label: "Portfolio" },
                { id: "contact", label: "Contato" }
              ].map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative font-medium transition-colors duration-300 ${
                    currentSection === item.id 
                      ? "text-primary" 
                      : "text-gray-300 hover:text-primary"
                  }`}
                  data-testid={`nav-${item.id}`}
                  animate={{
                    fontSize: isInPortfolioOrProjects ? "0.875rem" : "1rem",
                    textShadow: currentSection === item.id 
                      ? "0 0 10px rgba(0, 212, 170, 0.5)" 
                      : "none",
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  whileHover={{ 
                    scale: 1.05,
                    textShadow: "0 0 8px rgba(0, 212, 170, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                  {currentSection === item.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      layoutId="activeIndicator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div 
            className="hidden md:block"
            animate={{
              scale: isInPortfolioOrProjects ? 0.85 : 1,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => scrollToSection("contact")}
                className="bg-primary hover:bg-primary-dark text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-primary/25"
                data-testid="button-start-project"
                style={{
                  padding: isInPortfolioOrProjects ? "0.5rem 1rem" : "0.625rem 1.5rem",
                  fontSize: isInPortfolioOrProjects ? "0.875rem" : "1rem",
                }}
              >
                Começar Projeto
              </Button>
            </motion.div>
          </motion.div>

          {/* Mobile menu button */}
          <motion.div 
            className="md:hidden"
            animate={{
              scale: isInPortfolioOrProjects ? 0.9 : 1,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <motion.div
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
                data-testid="button-mobile-menu"
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-dark-secondary/95 backdrop-blur-md border-t border-primary/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div className="px-2 pt-2 pb-3 space-y-1">
              {[
                { id: "home", label: "Início" },
                { id: "services", label: "Serviços" },
                { id: "benefits", label: "Benefícios" },
                { id: "portfolio", label: "Portfolio" },
                { id: "contact", label: "Contato" }
              ].map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    currentSection === item.id 
                      ? "text-primary bg-primary/10" 
                      : "text-gray-300 hover:text-primary"
                  }`}
                  data-testid={`mobile-nav-${item.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
