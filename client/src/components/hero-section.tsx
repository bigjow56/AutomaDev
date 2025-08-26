import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export default function HeroSection() {
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
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient - n8n style */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-secondary to-dark-tertiary"></div>

      {/* Animated background elements with subtle purple gradient */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-purple-900/30 via-transparent to-purple-800/20"></div>
      </div>

      {/* Additional radial gradient for depth */}
      <div className="absolute inset-0 opacity-40">
        <div className="w-full h-full bg-radial-gradient from-purple-900/20 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="block text-white">Automação que</span>
            <span className="block bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              Transforma Negócios
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Criamos sites profissionais e automatizamos processos para empresas que querem crescer de forma inteligente e eficiente.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => scrollToSection("contact")}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              data-testid="button-start-project-hero"
            >
              Começar Projeto
            </Button>
            <Button
              onClick={() => scrollToSection("services")}
              variant="outline"
              className="border-2 border-gray-500 hover:border-secondary-blue text-white px-8 py-4 font-bold text-lg transition-all duration-300 hover:bg-secondary-blue/10"
              style={{ borderColor: '#0969da' }}
              data-testid="button-know-services"
            >
              Conhecer Serviços
            </Button>
          </div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="text-center" data-testid="stat-time-reduction">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">80%</div>
              <div className="text-gray-400">Redução de tempo em tarefas manuais</div>
            </div>
            <div className="text-center" data-testid="stat-roi-months">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">3-6</div>
              <div className="text-gray-400">Meses para retorno do investimento</div>
            </div>
            <div className="text-center" data-testid="stat-processes-automated">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-gray-400">Processos automatizados</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <ArrowDown className="w-6 h-6 text-primary" data-testid="scroll-indicator" />
      </motion.div>
    </section>
  );
}
