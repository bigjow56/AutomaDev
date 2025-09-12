import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Monitor, Link } from "lucide-react";
import { useParallax } from "@/hooks/use-scroll";

export default function ServicesSection() {
  const parallaxOffset = useParallax(0.1);

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
    <section id="services" className="py-20 bg-dark-secondary relative overflow-hidden">
      {/* Parallax background elements */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"
        style={{ y: parallaxOffset }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>
      
      <motion.div
        className="absolute bottom-20 right-20 w-20 h-20 bg-cyan-400/10 rounded-full blur-xl"
        style={{ y: parallaxOffset * -1.5 }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.6, 0.3],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 12,
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
              initial={{ opacity: 0, y: 60, rotateY: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 80,
                damping: 12
              }}
              viewport={{ once: true, margin: "-10%" }}
              whileHover={{ 
                scale: 1.05, 
                y: -15,
                rotateX: 5,
                transition: { duration: 0.4, type: "spring", stiffness: 300 }
              }}
            >
              <Card className="group bg-dark border border-dark-tertiary/30 rounded-2xl p-8 hover:border-primary/50 transition-all duration-500 h-full hover:shadow-2xl hover:shadow-emerald-500/25 backdrop-blur-sm">
                <CardContent className="p-0">
                  <motion.div 
                    className="text-primary mb-6" 
                    data-testid={`service-icon-${service.id}`}
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: 10,
                      transition: { duration: 0.3 }
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  >
                    {service.icon}
                  </motion.div>
                  <motion.h3 
                    className="text-2xl font-bold text-white mb-4" 
                    data-testid={`service-title-${service.id}`}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                  >
                    {service.title}
                  </motion.h3>
                  <motion.p 
                    className="text-gray-300 leading-relaxed mb-6" 
                    data-testid={`service-description-${service.id}`}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                  >
                    {service.description}
                  </motion.p>
                  <motion.ul 
                    className="text-gray-400 space-y-2" 
                    data-testid={`service-features-${service.id}`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.6 }}
                  >
                    {service.features.map((feature, featureIndex) => (
                      <motion.li 
                        key={featureIndex} 
                        className="flex items-center"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ 
                          duration: 0.4, 
                          delay: index * 0.2 + 0.7 + featureIndex * 0.1 
                        }}
                      >
                        <span className="text-primary mr-2">✓</span>
                        {feature}
                      </motion.li>
                    ))}
                  </motion.ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
