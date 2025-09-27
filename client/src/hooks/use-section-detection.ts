import { useState, useEffect } from "react";

interface SectionDetectionResult {
  currentSection: string;
  isInPortfolioOrProjects: boolean;
}

export function useSectionDetection(): SectionDetectionResult {
  const [currentSection, setCurrentSection] = useState("home");
  
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "home", element: document.getElementById("home") },
        { id: "portfolio", element: document.getElementById("portfolio") },
        { id: "projects", element: document.getElementById("projects") },
        { id: "services", element: document.getElementById("services") },
        { id: "benefits", element: document.getElementById("benefits") },
        { id: "events", element: document.getElementById("events") },
        { id: "contact", element: document.getElementById("contact") }
      ];

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollPosition = scrollY + windowHeight / 2; // Meio da viewport

      let activeSection = "home";

      for (const section of sections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          const elementTop = rect.top + scrollY;
          const elementBottom = elementTop + rect.height;

          // Se o meio da viewport está dentro desta seção
          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            activeSection = section.id;
            break;
          }
        }
      }

      setCurrentSection(activeSection);
    };

    // Executar na primeira carga
    handleScroll();

    // Adicionar throttling para performance
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener);
    return () => window.removeEventListener("scroll", scrollListener);
  }, []);

  const isInPortfolioOrProjects = currentSection === "portfolio" || currentSection === "projects";

  return {
    currentSection,
    isInPortfolioOrProjects
  };
}