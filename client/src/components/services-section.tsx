import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Monitor, Link } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      id: "automation",
      icon: <Settings className="w-12 h-12" />,
      title: "Automação de Processos",
      description: "Eliminamos tarefas repetitivas do seu negócio através de automações inteligentes que economizam tempo e reduzem erros humanos.",
      features: [
        "Integração de sistemas",
        "Workflows personalizados",
        "Redução de erros manuais"
      ]
    },
    {
      id: "websites",
      icon: <Monitor className="w-12 h-12" />,
      title: "Criação de Sites",
      description: "Desenvolvemos sites profissionais, responsivos e otimizados que convertem visitantes em clientes e fortalecem sua presença online.",
      features: [
        "Design responsivo",
        "SEO otimizado",
        "Performance elevada"
      ]
    },
    {
      id: "integration",
      icon: <Link className="w-12 h-12" />,
      title: "Integração de Sistemas",
      description: "Conectamos suas ferramentas e plataformas para que trabalhem em harmonia, criando um fluxo de dados seamless em seu negócio.",
      features: [
        "APIs personalizadas",
        "Sincronização de dados",
        "Fluxos automatizados"
      ]
    }
  ];

  return (
    <section id="services" className="py-20 bg-dark-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" data-testid="services-title">
            Nossos Serviços
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Soluções completas para transformar seu negócio através da tecnologia e automação inteligente.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="group bg-dark border border-dark-tertiary/30 rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 h-full">
                <CardContent className="p-0">
                  <div className="text-primary mb-6" data-testid={`service-icon-${service.id}`}>
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4" data-testid={`service-title-${service.id}`}>
                    {service.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-6" data-testid={`service-description-${service.id}`}>
                    {service.description}
                  </p>
                  <ul className="text-gray-400 space-y-2" data-testid={`service-features-${service.id}`}>
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <span className="text-primary mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
