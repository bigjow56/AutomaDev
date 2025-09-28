import { motion } from "framer-motion";
import logoImg from "@assets/20250927_1949_Logotipo de Automação_remix_01k66ntahqft7a7a2gxwvwxh7b - Editado_1759078127899.png";

interface AnimatedLogoProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export default function AnimatedLogo({ size = "medium", className = "" }: AnimatedLogoProps) {
  const sizeClasses = {
    small: "w-12 h-12",
    medium: "w-16 h-16", 
    large: "w-24 h-24"
  };

  const logoSize = sizeClasses[size];

  return (
    <div className={`relative ${logoSize} ${className}`} data-testid="animated-logo">
      {/* Círculo principal */}
      <motion.div 
        className="absolute inset-0 border-2 border-yellow-400/30 rounded-full bg-gradient-radial from-yellow-400/10 to-transparent"
        animate={{
          borderColor: ["rgba(255, 215, 0, 0.3)", "rgba(255, 215, 0, 0.8)", "rgba(255, 215, 0, 0.3)"],
          boxShadow: [
            "0 0 15px rgba(255, 215, 0, 0.2)",
            "0 0 30px rgba(255, 215, 0, 0.4)",
            "0 0 15px rgba(255, 215, 0, 0.2)"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Anéis orbitais */}
      <motion.div 
        className="absolute inset-0 border-2 border-transparent border-t-cyan-400 border-r-cyan-300 rounded-full opacity-60"
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
      
      <motion.div 
        className="absolute inset-1 border-2 border-transparent border-t-orange-400 border-r-red-400 rounded-full opacity-40"
        animate={{ rotate: -360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      {/* Container da cobra */}
      <div className="absolute inset-2 flex items-center justify-center">
        <motion.div 
          className="relative w-full h-full"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Corpo principal da cobra */}
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/3 rounded-full"
            style={{
              background: "linear-gradient(90deg, #f1c40f 0%, #f39c12 20%, #e67e22 40%, #f39c12 60%, #d68910 80%, #b7950b 100%)",
              clipPath: "polygon(0% 50%, 10% 20%, 25% 60%, 35% 30%, 50% 70%, 65% 25%, 75% 65%, 90% 35%, 100% 50%, 90% 65%, 75% 35%, 65% 75%, 50% 30%, 35% 70%, 25% 40%, 10% 80%)",
              boxShadow: "inset 0 2px 6px rgba(255, 255, 255, 0.4), inset 0 -2px 6px rgba(0, 0, 0, 0.3), 0 0 15px rgba(241, 196, 15, 0.4)"
            }}
            animate={{
              scaleX: [1, 1.1, 1],
              rotateZ: [0, 2, 0, -2, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Cabeça da cobra */}
          <motion.div 
            className="absolute top-1/3 left-1/4 w-1/4 h-1/3 rounded-full border border-yellow-600"
            style={{
              background: "linear-gradient(135deg, #f1c40f 0%, #e67e22 100%)",
              borderRadius: "60% 40% 30% 70%",
              boxShadow: "inset 1px 1px 4px rgba(255, 255, 255, 0.4), inset -1px -1px 4px rgba(0, 0, 0, 0.3), 0 0 10px rgba(241, 196, 15, 0.5)"
            }}
            animate={{
              rotateZ: [0, 3, 0, -3, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Chapéu */}
          <motion.div 
            className="absolute top-1/6 left-1/4 w-1/5 h-1/6 border border-gray-700"
            style={{
              background: "linear-gradient(135deg, #2c3e50, #34495e)",
              borderRadius: "50% 50% 10% 10%",
              boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.5), 0 0 8px rgba(52, 73, 94, 0.3)"
            }}
            animate={{
              rotateZ: [0, 2, 0, -2, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />

          {/* Aba do chapéu */}
          <div 
            className="absolute top-1/3 left-1/6 w-2/5 h-1/12 border border-gray-700"
            style={{
              background: "linear-gradient(135deg, #34495e, #2c3e50)",
              borderRadius: "50%",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.4)"
            }}
          />

          {/* Fita do chapéu */}
          <div 
            className="absolute top-1/4 left-1/3 w-1/6 h-1/24 bg-red-500 rounded-sm"
            style={{
              boxShadow: "0 0 3px rgba(231, 76, 60, 0.5)"
            }}
          />

          {/* Olhos */}
          <motion.div className="absolute top-2/5 left-1/3 w-1/24 h-1/12 bg-black rounded-full"
            animate={{
              scaleY: [1, 0.1, 1]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div className="absolute top-2/5 left-2/5 w-1/24 h-1/12 bg-black rounded-full"
            animate={{
              scaleY: [1, 0.1, 1]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Língua */}
          <motion.div 
            className="absolute top-1/2 left-2/5 w-1/6 h-1/24 bg-red-500 rounded-sm"
            style={{ transformOrigin: "left center" }}
            animate={{
              scaleX: [1, 1.3, 1, 0.7, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Cauda */}
          <motion.div 
            className="absolute top-2/5 right-1/4 w-1/6 h-1/4 border border-yellow-700"
            style={{
              background: "linear-gradient(135deg, #d68910, #b7950b)",
              borderRadius: "50% 50% 90% 10%",
              boxShadow: "inset 1px 1px 2px rgba(255, 255, 255, 0.3), 0 0 5px rgba(214, 137, 16, 0.3)"
            }}
            animate={{
              rotateZ: [0, -5, 0, 5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Chocalho */}
          <motion.div 
            className="absolute top-2/5 right-1/6 w-1/12 h-1/12 bg-amber-800 rounded border border-amber-900"
            animate={{
              scale: [1, 1.1, 1],
              rotateZ: [0, 10, -10, 0]
            }}
            transition={{ duration: 0.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      {/* Logo AutomaDev */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <motion.img
          src={logoImg}
          alt="AutomaDev Logo"
          className="w-full h-full object-contain opacity-80"
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ filter: "drop-shadow(0 0 8px rgba(0, 212, 255, 0.4))" }}
        />
      </motion.div>

      {/* Partículas de código */}
      {size !== "small" && (
        <>
          <motion.div 
            className="absolute top-1/4 left-1/6 text-cyan-400 text-xs opacity-70 font-mono"
            animate={{
              y: [0, -10, 0],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            &lt;/&gt;
          </motion.div>
          <motion.div 
            className="absolute top-1/3 right-1/6 text-cyan-400 text-xs opacity-70 font-mono"
            animate={{
              y: [0, 10, 0],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 1 }}
          >
            { }
          </motion.div>
          <motion.div 
            className="absolute bottom-1/4 left-1/8 text-cyan-400 text-xs opacity-70 font-mono"
            animate={{
              y: [0, -10, 0],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 2 }}
          >
            AI
          </motion.div>
          <motion.div 
            className="absolute bottom-1/3 right-1/8 text-cyan-400 text-xs opacity-70 font-mono"
            animate={{
              y: [0, 10, 0],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 3 }}
          >
            ⚡
          </motion.div>
        </>
      )}
    </div>
  );
}