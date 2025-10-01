import "../hero-section.css";
import newLogoImg from "@assets/AutomaDev_1759165797760.png";

export default function AutomaDevSlide() {
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
    <section id="home" className="hero">
      <div className="hero-container">
        {/* Conteúdo textual */}
        <div className="hero-content">
          <div className="hero-badge">✨ Soluções em Automação</div>

          <h1 className="hero-title">
            AUTOMA<br />
            <span className="hero-title-dev">DEV</span>
          </h1>

          <p className="hero-subtitle">
            Transformamos ideias em soluções automatizadas. Desenvolvemos
            sistemas inteligentes que otimizam processos e impulsionam o
            crescimento do seu negócio.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-primary"
              onClick={() => scrollToSection("contact")}
              data-testid="button-start-project-hero"
            >
              Começar Projeto
            </button>
            <button
              className="btn-secondary"
              onClick={() => scrollToSection("services")}
              data-testid="button-view-services"
            >
              Ver Serviços
            </button>
          </div>
        </div>

        {/* Área visual com a animação 3D */}
        <div className="hero-visual">
          <div className="floating-platform-container">
            <div className="platform-rotator">
              <div className="platform-floater">
                {/* Plataforma principal elíptica com imagem */}
                <div className="main-ellipse">
                  <img
                    src={newLogoImg}
                    alt="AutomaDev Logo"
                    className="platform-image"
                  />
                </div>

                {/* Anéis orbitais */}
                <div className="orbital-ring ring-1"></div>
                <div className="orbital-ring ring-2"></div>

                {/* Ícones das plataformas */}
                <div
                  className="platform-icon instagram"
                  data-testid="icon-instagram"
                ></div>
                <div
                  className="platform-icon whatsapp"
                  data-testid="icon-whatsapp"
                ></div>
                <div
                  className="platform-icon globe"
                  data-testid="icon-globe"
                ></div>
                <div
                  className="platform-icon dollar"
                  data-testid="icon-dollar"
                ></div>
              </div>
            </div>
          </div>

          {/* Partículas */}
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
          <div className="particle particle-6"></div>
        </div>
      </div>
    </section>
  );
}
