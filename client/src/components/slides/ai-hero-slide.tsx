import { useMemo } from "react";
import "./ai-hero-slide.css";

export default function AIHeroSlide() {
  // Generate particles data once
  const particles = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => {
      const size = Math.random() * 5 + 2;
      return {
        id: i,
        size,
        left: Math.random() * 100,
        delay: Math.random() * 20,
        duration: Math.random() * 10 + 15,
      };
    });
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="ai-hero-section">
      <div className="ai-particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="ai-particle"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>
      
      <div className="ai-content-wrapper">
        <div className="ai-text-content">
          <div className="ai-badge">
            ✨ Powered by AI
          </div>
          <h1 className="ai-glow-text">
            Automatize seu negócio com Inteligência Artificial
          </h1>
          <p className="ai-subtitle-large">
            Soluções inteligentes que aprendem, evoluem e otimizam seus processos em tempo real.
          </p>

          <div className="ai-stats-grid">
            <div className="ai-stat-card" data-testid="stat-speed">
              <div className="ai-stat-icon">⚡</div>
              <div className="ai-stat-number">10x</div>
              <div className="ai-stat-label">Mais Rápido</div>
            </div>
            <div className="ai-stat-card" data-testid="stat-precision">
              <div className="ai-stat-icon">🎯</div>
              <div className="ai-stat-number">95%</div>
              <div className="ai-stat-label">Precisão</div>
            </div>
            <div className="ai-stat-card" data-testid="stat-availability">
              <div className="ai-stat-icon">⏱️</div>
              <div className="ai-stat-number">24/7</div>
              <div className="ai-stat-label">Disponível</div>
            </div>
          </div>

          <div className="ai-cta-group">
            <button 
              className="ai-btn-modern ai-btn-primary"
              onClick={() => scrollToSection("contact")}
              data-testid="button-ai-start"
            >
              <span>⚡</span> Começar Agora
            </button>
            <button 
              className="ai-btn-modern ai-btn-secondary"
              onClick={() => scrollToSection("services")}
              data-testid="button-ai-explore"
            >
              <span>▶️</span> Explorar Demo
            </button>
          </div>
        </div>

        <div className="ai-image-showcase">
          <div className="ai-orbiting-elements">
            <div className="ai-orbit-item">🌍 Alcance Global</div>
            <div className="ai-orbit-item">⚡ IA em Tempo Real</div>
          </div>
          <div className="ai-floating-image">
            <img src="/uploads/ai-automation-hero.png" alt="IA Global" />
          </div>
        </div>
      </div>
    </section>
  );
}
