import { motion } from "framer-motion";
import { useScrollProgress } from "@/hooks/use-scroll";

export default function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-cyan-500 to-emerald-400 z-50 origin-left"
      style={{ 
        scaleX: progress / 100,
        opacity: progress > 5 ? 1 : 0
      }}
      initial={{ scaleX: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
    />
  );
}