import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, ShoppingCart, BarChart3, ArrowRight } from "lucide-react";

export default function PortfolioSection() {
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

  const projects = [
    {
      id: "business-management",
      icon: <Building className="w-6 h-6 text-primary mr-2" />,
      category: "Sistema",
      categoryColor: "bg-primary",
      title: "Sistema de Gestão Empresarial",
      description: "Automação completa de processos administrativos, reduzindo 70% do tempo em tarefas burocráticas.",
      tags: ["Automação", "Dashboard", "Relatórios"],
      metric: "↗ 70% redução no tempo administrativo"
    },
    {
      id: "smart-ecommerce",
      icon: <ShoppingCart className="w-6 h-6 text-primary mr-2" />,
      category: "E-commerce",
      categoryColor: "bg-green-500",
      title: "E-commerce Inteligente",
      description: "Loja online com automação de estoque, vendas e atendimento ao cliente via chatbot.",
      tags: ["E-commerce", "Chatbot", "Integração"],
      metric: "↗ 300% aumento nas conversões"
    },
    {
      id: "analytics-dashboard",
      icon: <BarChart3 className="w-6 h-6 text-primary mr-2" />,
      category: "Analytics",
      categoryColor: "bg-blue-500",
      title: "Dashboard Analítico",
      description: "Painel de controle que integra múltiplas fontes de dados para tomada de decisão estratégica.",
      tags: ["BI", "Integração", "Real-time"],
      metric: "↗ 50% melhoria na tomada de decisão"
    }
  ];

  return (
    <section id="portfolio" className="py-20 bg-dark-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center mb-6">
            <BarChart3 className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-4xl md:text-5xl font-bold text-white" data-testid="portfolio-title">
              Projetos Realizados
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Casos de sucesso que demonstram nossa expertise em automação e desenvolvimento web
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-dark border border-dark-tertiary/30 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 group h-full">
                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-primary/20 to-orange-400/20 flex items-center justify-center">
                  <div className="text-6xl text-primary/40">
                    {project.icon}
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className={`${project.categoryColor} px-3 py-1 rounded-full text-sm font-semibold text-white`}>
                      {project.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    {project.icon}
                    <h3 className="text-xl font-bold text-white" data-testid={`project-title-${project.id}`}>
                      {project.title}
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-4 leading-relaxed" data-testid={`project-description-${project.id}`}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4" data-testid={`project-tags-${project.id}`}>
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs bg-dark-tertiary/50 text-gray-300 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-primary font-semibold" data-testid={`project-metric-${project.id}`}>
                    {project.metric}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Button
            onClick={() => scrollToSection("contact")}
            className="inline-flex items-center bg-primary hover:bg-primary-dark text-white px-8 py-4 font-bold text-lg transition-all duration-300 transform hover:scale-105"
            data-testid="button-see-more-projects"
          >
            Ver Mais Projetos
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
