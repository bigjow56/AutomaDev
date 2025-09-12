import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, TrendingUp, Headphones, Zap } from "lucide-react";
import { useIntersection } from "@/hooks/use-intersection";
import { useParallax } from "@/hooks/use-scroll";

export default function BenefitsSection() {
  const { ref, isIntersecting } = useIntersection({ threshold: 0.1 });
  const parallaxOffset = useParallax(-0.2);

  const benefits = [
    {
      id: "time-savings",
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: "Economia de Tempo Real",
      description: "Nossas automações podem reduzir em até 80% o tempo gasto em tarefas manuais repetitivas.",
      metric: "↗ Produtividade multiplicada por 5x"
    },
    {
      id: "proven-roi",
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      title: "ROI Comprovado",
      description: "Clientes típicos recuperam o investimento em 3-6 meses através da eficiência conquistada.",
      metric: "↗ Retorno garantido em 6 meses"
    },
    {
      id: "personalized-support",
      icon: <Headphones className="w-6 h-6 text-primary" />,
      title: "Suporte Personalizado",
      description: "Acompanhamento dedicado desde a implementação até a otimização contínua dos processos.",
      metric: "↗ Suporte 24/7 especializado"
    },
    {
      id: "modern-technology",
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: "Tecnologia Moderna",
      description: "Utilizamos as melhores ferramentas e práticas do mercado para garantir resultados duradouros.",
      metric: "↗ Stack tecnológico atualizado"
    }
  ];

  return (
    <section id="benefits" className="py-20 bg-gradient-to-br from-dark via-dark-secondary to-dark relative overflow-hidden" ref={ref}>
      {/* Parallax background decoration */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        style={{ y: parallaxOffset }}
      >
        <div className="w-full h-full bg-gradient-to-br from-emerald-600/20 via-transparent to-cyan-400/20"></div>
      </motion.div>

      {/* Floating elements for depth */}
      <motion.div
        className="absolute top-10 right-10 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.7, 0.3],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>
      
      <motion.div
        className="absolute bottom-10 left-10 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.5, 0.2],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" data-testid="benefits-title">
            Por que Escolher a AutomaDev?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Resultados comprovados que transformam a eficiência do seu negócio
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              initial={{ opacity: 0, y: 50, rotateX: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              viewport={{ once: true, margin: "-10%" }}
              whileHover={{ 
                scale: 1.03, 
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              <Card className="bg-dark/60 backdrop-blur-sm border border-dark-tertiary/30 rounded-2xl p-8 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20">
                <CardContent className="p-0">
                  <div className="flex items-start space-x-4">
                    <motion.div 
                      className="flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center" data-testid={`benefit-icon-${benefit.id}`}>
                        {benefit.icon}
                      </div>
                    </motion.div>
                    <div className="flex-1">
                      <motion.h3 
                        className="text-2xl font-bold text-white mb-4" 
                        data-testid={`benefit-title-${benefit.id}`}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                      >
                        {benefit.title}
                      </motion.h3>
                      <motion.p 
                        className="text-gray-300 leading-relaxed mb-4" 
                        data-testid={`benefit-description-${benefit.id}`}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                      >
                        {benefit.description}
                      </motion.p>
                      <motion.div 
                        className="text-primary font-semibold" 
                        data-testid={`benefit-metric-${benefit.id}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.2 + 0.6 }}
                      >
                        {benefit.metric}
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
