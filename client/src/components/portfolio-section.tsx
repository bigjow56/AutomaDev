import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Portfolio } from "@shared/schema";
import { useParallax } from "@/hooks/use-scroll";

export default function PortfolioSection() {
  const parallaxOffset = useParallax(-0.15);

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

  // Fetch portfolio data
  const { data: portfolioData } = useQuery<{ success: boolean; portfolio: Portfolio | null }>({
    queryKey: ["/api/portfolio"],
  });

  const portfolio = portfolioData?.portfolio;

  const parseJsonArray = (jsonString: string | undefined): string[] => {
    if (!jsonString) return [];
    try {
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // Fallback: try splitting by comma for comma-separated strings
      return jsonString.split(',').map(item => item.trim()).filter(item => item.length > 0);
    }
  };

  const skills = parseJsonArray(portfolio?.skills);
  const experience = parseJsonArray(portfolio?.experience);
  const education = parseJsonArray(portfolio?.education);
  const certifications = parseJsonArray(portfolio?.certifications);

  return (
    <section
      id="portfolio"
      className="min-h-screen flex items-center justify-center py-20 relative overflow-hidden bg-dark"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${parallaxOffset * 0.5}px)`,
          }}
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgaWQ9ImdyaWQiPgo8cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIIC3N0cm9rZT0iIzM3MzY0MyIgc3Ryb2tlLXdpZHRoPSIxIi8+CjwvZz4KPHN2Zz4=')] opacity-20"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
            Meu Portfolio
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Conheça minha trajetória profissional, habilidades e experiências que me definem como desenvolvedor
          </p>
        </motion.div>

        {portfolio ? (
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-3 gap-8">
              {/* Profile Card */}
              <Card className="md:col-span-1 bg-slate-800/40 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    {portfolio.photo ? (
                      <img
                        src={portfolio.photo}
                        alt={portfolio.name}
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-purple-500/20"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                        <User className="w-16 h-16 text-white" />
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-white mb-2">{portfolio.name}</h3>
                    <p className="text-purple-300 font-medium">{portfolio.title}</p>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    {portfolio.email && (
                      <div className="flex items-center text-gray-300">
                        <Mail className="w-4 h-4 mr-3 text-purple-400" />
                        <span className="text-sm">{portfolio.email}</span>
                      </div>
                    )}
                    {portfolio.phone && (
                      <div className="flex items-center text-gray-300">
                        <Phone className="w-4 h-4 mr-3 text-purple-400" />
                        <span className="text-sm">{portfolio.phone}</span>
                      </div>
                    )}
                    {portfolio.location && (
                      <div className="flex items-center text-gray-300">
                        <MapPin className="w-4 h-4 mr-3 text-purple-400" />
                        <span className="text-sm">{portfolio.location}</span>
                      </div>
                    )}
                    {portfolio.website && (
                      <div className="flex items-center text-gray-300">
                        <Globe className="w-4 h-4 mr-3 text-purple-400" />
                        <a
                          href={portfolio.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:text-purple-400 transition-colors"
                        >
                          {portfolio.website}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center space-x-4 mt-6 pt-6 border-t border-slate-700">
                    {portfolio.linkedin && (
                      <a
                        href={portfolio.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-700 rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        <Linkedin className="w-5 h-5 text-white" />
                      </a>
                    )}
                    {portfolio.github && (
                      <a
                        href={portfolio.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-700 rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        <Github className="w-5 h-5 text-white" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Details Card */}
              <Card className="md:col-span-2 bg-slate-800/40 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold text-white mb-4">Sobre Mim</h4>
                  <p className="text-gray-300 mb-6 leading-relaxed">{portfolio.bio}</p>

                  {/* Skills */}
                  {skills.length > 0 && (
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-white mb-3">Habilidades</h5>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-600/20 text-purple-300 text-sm rounded-full border border-purple-600/30"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {experience.length > 0 && (
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-white mb-3">Experiência</h5>
                      <div className="space-y-2">
                        {experience.map((exp, index) => (
                          <p key={index} className="text-gray-300 text-sm">• {exp}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {education.length > 0 && (
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-white mb-3">Educação</h5>
                      <div className="space-y-2">
                        {education.map((edu, index) => (
                          <p key={index} className="text-gray-300 text-sm">• {edu}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {certifications.length > 0 && (
                    <div>
                      <h5 className="text-lg font-semibold text-white mb-3">Certificações</h5>
                      <div className="space-y-2">
                        {certifications.map((cert, index) => (
                          <p key={index} className="text-gray-300 text-sm">• {cert}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-gray-400 mb-6">
              <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Portfolio não configurado</h3>
              <p>Configure suas informações pessoais no painel administrativo.</p>
            </div>
          </motion.div>
        )}

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
            className="inline-flex items-center bg-gradient-to-r from-primary to-secondary-purple hover:from-primary-dark hover:to-accent-purple text-white px-8 py-4 font-bold text-lg transition-all duration-300 transform hover:scale-105"
            data-testid="button-contact-from-portfolio"
          >
            Vamos Conversar?
          </Button>
        </motion.div>
      </div>
    </section>
  );
}