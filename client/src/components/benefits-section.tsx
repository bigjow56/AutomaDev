import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, TrendingUp, Headphones, Zap } from "lucide-react";

export default function BenefitsSection() {
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
    <section id="benefits" className="py-20 bg-gradient-to-br from-dark via-dark-secondary to-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-orange-400/20"></div>
      </div>

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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-dark/60 backdrop-blur-sm border border-dark-tertiary/30 rounded-2xl p-8 hover:border-primary/30 transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center" data-testid={`benefit-icon-${benefit.id}`}>
                        {benefit.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-4" data-testid={`benefit-title-${benefit.id}`}>
                        {benefit.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed mb-4" data-testid={`benefit-description-${benefit.id}`}>
                        {benefit.description}
                      </p>
                      <div className="text-primary font-semibold" data-testid={`benefit-metric-${benefit.id}`}>
                        {benefit.metric}
                      </div>
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
