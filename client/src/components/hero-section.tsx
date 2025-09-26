import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTypewriter } from "@/hooks/use-typewriter";

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
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark">
      {/* Logo Neural Network Background */}
      <div className="absolute w-96 h-96 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-15 z-10">
        <div className="w-full h-full relative">
          {/* Neural Network Nodes */}
          <motion.div
            className="absolute w-4 h-4 bg-purple-600 rounded-full shadow-purple shadow-lg top-12 left-12"
            animate={{
              scale: [1, 1.4, 1],
              boxShadow: [
                "0 0 10px #9333ea",
                "0 0 30px #9333ea",
                "0 0 10px #9333ea"
              ],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0
            }}
          />
          
          <motion.div
            className="absolute w-4 h-4 bg-purple-600 rounded-full shadow-purple shadow-lg top-12 right-12"
            animate={{
              scale: [1, 1.4, 1],
              boxShadow: [
                "0 0 10px #9333ea",
                "0 0 30px #9333ea",
                "0 0 10px #9333ea"
              ],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4
            }}
          />
          
          <motion.div
            className="absolute w-4 h-4 bg-purple-600 rounded-full shadow-purple shadow-lg top-1/2 left-1/4 transform -translate-y-1/2"
            animate={{
              scale: [1, 1.4, 1],
              boxShadow: [
                "0 0 10px #9333ea",
                "0 0 30px #9333ea",
                "0 0 10px #9333ea"
              ],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8
            }}
          />
          
          <motion.div
            className="absolute w-4 h-4 bg-purple-600 rounded-full shadow-purple shadow-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            animate={{
              scale: [1, 1.4, 1],
              boxShadow: [
                "0 0 10px #9333ea",
                "0 0 30px #9333ea",
                "0 0 10px #9333ea"
              ],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2
            }}
          />
          
          <motion.div
            className="absolute w-4 h-4 bg-purple-600 rounded-full shadow-purple shadow-lg top-1/2 right-1/4 transform -translate-y-1/2"
            animate={{
              scale: [1, 1.4, 1],
              boxShadow: [
                "0 0 10px #9333ea",
                "0 0 30px #9333ea",
                "0 0 10px #9333ea"
              ],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.6
            }}
          />
          
          <motion.div
            className="absolute w-4 h-4 bg-purple-600 rounded-full shadow-purple shadow-lg bottom-12 left-12"
            animate={{
              scale: [1, 1.4, 1],
              boxShadow: [
                "0 0 10px #9333ea",
                "0 0 30px #9333ea",
                "0 0 10px #9333ea"
              ],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          
          <motion.div
            className="absolute w-4 h-4 bg-purple-600 rounded-full shadow-purple shadow-lg bottom-12 right-12"
            animate={{
              scale: [1, 1.4, 1],
              boxShadow: [
                "0 0 10px #9333ea",
                "0 0 30px #9333ea",
                "0 0 10px #9333ea"
              ],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.4
            }}
          />
          
          <motion.div
            className="absolute w-4 h-4 bg-purple-600 rounded-full shadow-purple shadow-lg top-32 left-1/2 transform -translate-x-1/2"
            animate={{
              scale: [1, 1.4, 1],
              boxShadow: [
                "0 0 10px #9333ea",
                "0 0 30px #9333ea",
                "0 0 10px #9333ea"
              ],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6
            }}
          />
          
          <motion.div
            className="absolute w-4 h-4 bg-purple-600 rounded-full shadow-purple shadow-lg bottom-32 left-1/2 transform -translate-x-1/2"
            animate={{
              scale: [1, 1.4, 1],
              boxShadow: [
                "0 0 10px #9333ea",
                "0 0 30px #9333ea",
                "0 0 10px #9333ea"
              ],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.8
            }}
          />

          {/* Neural Network Connections */}
          <motion.div
            className="absolute top-14 left-16 w-64 h-0.5 bg-gradient-to-r from-transparent via-purple-600 to-transparent opacity-40"
            animate={{
              opacity: [0, 0.6, 0],
              scaleX: [0, 1, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              delay: 0
            }}
          />
          
          <motion.div
            className="absolute top-32 left-36 w-44 h-0.5 bg-gradient-to-r from-transparent via-purple-600 to-transparent opacity-40 transform rotate-45"
            animate={{
              opacity: [0, 0.6, 0],
              scaleX: [0, 1, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              delay: 0.5
            }}
          />
          
          <motion.div
            className="absolute top-48 left-24 w-48 h-0.5 bg-gradient-to-r from-transparent via-purple-600 to-transparent opacity-40 transform -rotate-12"
            animate={{
              opacity: [0, 0.6, 0],
              scaleX: [0, 1, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              delay: 1
            }}
          />
          
          <motion.div
            className="absolute top-64 left-36 w-44 h-0.5 bg-gradient-to-r from-transparent via-purple-600 to-transparent opacity-40 transform -rotate-45"
            animate={{
              opacity: [0, 0.6, 0],
              scaleX: [0, 1, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              delay: 1.5
            }}
          />
          
          <motion.div
            className="absolute bottom-14 left-16 w-64 h-0.5 bg-gradient-to-r from-transparent via-purple-600 to-transparent opacity-40"
            animate={{
              opacity: [0, 0.6, 0],
              scaleX: [0, 1, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              delay: 2
            }}
          />
          
          <motion.div
            className="absolute top-1/2 left-16 w-32 h-0.5 bg-gradient-to-r from-transparent via-purple-600 to-transparent opacity-40 transform rotate-90"
            animate={{
              opacity: [0, 0.6, 0],
              scaleX: [0, 1, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              delay: 2.5
            }}
          />
          
          <motion.div
            className="absolute top-1/2 right-16 w-32 h-0.5 bg-gradient-to-r from-transparent via-purple-600 to-transparent opacity-40 transform rotate-90"
            animate={{
              opacity: [0, 0.6, 0],
              scaleX: [0, 1, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              delay: 3
            }}
          />
          
          <motion.div
            className="absolute top-40 left-48 w-24 h-0.5 bg-gradient-to-r from-transparent via-purple-600 to-transparent opacity-40 transform rotate-45"
            animate={{
              opacity: [0, 0.6, 0],
              scaleX: [0, 1, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              delay: 0.8
            }}
          />
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute w-full h-full pointer-events-none">
        {[...Array(9)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-1 h-1 bg-purple-600 rounded-full opacity-30"
            style={{
              left: `${10 + index * 10}%`,
            }}
            animate={{
              y: ["100vh", "-100px"],
              rotate: [0, 360],
              opacity: [0, 0.3, 0.3, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
              delay: index * 1
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-20 text-center max-w-4xl mx-auto px-8">
        <motion.h1
          className="text-6xl md:text-8xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-purple-600 to-purple-400 bg-clip-text text-transparent min-h-[120px] flex items-center justify-center"
          style={{
            backgroundSize: "300% 300%",
          }}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          initial={{ opacity: 1 }}
        >
          {titleTypewriter.displayedText}
        </motion.h1>

        <motion.p
          className="text-2xl text-slate-400 mb-8 font-light min-h-[40px] flex items-center justify-center"
          initial={{ opacity: 1 }}
        >
          {subtitleTypewriter.displayedText}
        </motion.p>

        <motion.p
          className="text-xl text-slate-300 leading-relaxed mb-12 min-h-[100px] flex items-center justify-center text-center"
          initial={{ opacity: 1 }}
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
            className="purple-gradient-button hover:from-purple-700 hover:to-purple-800 text-white px-10 py-4 text-lg font-semibold rounded-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-lg uppercase tracking-wide"
            data-testid="button-start-project-hero"
          >
            Começar Agora
          </Button>
        </motion.div>
      </div>
    </section>
  );
}