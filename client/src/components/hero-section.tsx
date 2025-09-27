import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTypewriter } from "@/hooks/use-typewriter";
import HeroLogo from "@/components/hero-logo";

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

  // Typewriter effects with different speeds and delays
  const titleTypewriter = useTypewriter({
    text: "AutomaDev",
    speed: 120, // Slow for dramatic effect
    delay: 0,
    showCursor: true
  });

  const subtitleTypewriter = useTypewriter({
    text: "Automação Inteligente para o Futuro",
    speed: 40, // Faster
    delay: 2500, // Start after title is nearly done
    showCursor: false
  });

  const descriptionTypewriter = useTypewriter({
    text: "Transformamos ideias em soluções automatizadas. Desenvolvemos sistemas inteligentes que otimizam processos e impulsionam o crescimento do seu negócio.",
    speed: 30, // Fast
    delay: 4000, // Start after subtitle
    showCursor: false
  });

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-dark py-20">
      {/* Logo Central Animada */}
      <motion.div 
        className="relative z-10 mb-8"
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <HeroLogo />
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute w-full h-full pointer-events-none">
        {[...Array(15)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-20"
            style={{
              left: `${5 + index * 6}%`,
            }}
            animate={{
              y: ["100vh", "-100px"],
              rotate: [0, 360],
              opacity: [0, 0.2, 0.2, 0]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.8
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-20 text-center max-w-4xl mx-auto px-8 mt-8">
        <motion.p
          className="text-2xl text-slate-400 mb-8 font-light min-h-[40px] flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
        >
          {subtitleTypewriter.displayedText}
        </motion.p>

        <motion.p
          className="text-xl text-slate-300 leading-relaxed mb-12 min-h-[100px] flex items-center justify-center text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4, duration: 1 }}
        >
          {descriptionTypewriter.displayedText}
        </motion.p>

        <motion.div
          initial={{ 
            opacity: 0,
            y: -400,
            scale: 0.5,
            rotate: -10
          }}
          animate={{ 
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0
          }}
          transition={{ 
            duration: 1.2,
            delay: 8.5, // Falls from sky after all text is done
            type: "spring",
            damping: 15,
            stiffness: 300,
            mass: 0.8
          }}
        >
          <Button
            onClick={() => scrollToSection("contact")}
            className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-10 py-4 text-lg font-semibold rounded-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-yellow-500/25 uppercase tracking-wide"
            data-testid="button-start-project-hero"
          >
            Começar Agora
          </Button>
        </motion.div>
      </div>
    </section>
  );
}