import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, ShoppingCart, BarChart3, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { useParallax } from "@/hooks/use-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

  // Fetch projects from API
  const { data: projectsData, isLoading } = useQuery<{ success: boolean; projects: Project[] }>({
    queryKey: ["/api/projects"],
  });

  const projects = projectsData?.projects || [];

  // Icon mapping
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Building":
        return <Building className="w-6 h-6 text-primary mr-2" />;
      case "ShoppingCart":
        return <ShoppingCart className="w-6 h-6 text-primary mr-2" />;
      case "BarChart3":
        return <BarChart3 className="w-6 h-6 text-primary mr-2" />;
      default:
        return <Building className="w-6 h-6 text-primary mr-2" />;
    }
  };

  // Parse tags from string
  const parseTags = (tagsString: string): string[] => {
    return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  };

  // Parse images from JSON string
  const parseImages = (imagesString: string): Array<{url: string, type: string, alt: string}> => {
    try {
      return JSON.parse(imagesString || "[]");
    } catch (error) {
      console.error("Error parsing images:", error);
      return [];
    }
  };

  // Get primary image (first image or fallback to icon)
  const getPrimaryImage = (project: Project) => {
    const images = parseImages(project.images || "[]");
    return images.length > 0 ? images[0].url : null;
  };

  return (
    <section id="portfolio" className="py-20 bg-dark-secondary relative overflow-hidden">
      {/* Parallax background elements */}
      <motion.div
        className="absolute top-10 right-10 w-28 h-28 bg-emerald-600/10 rounded-full blur-2xl"
        style={{ y: parallaxOffset }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>
      
      <motion.div
        className="absolute bottom-20 left-10 w-20 h-20 bg-cyan-400/10 rounded-full blur-xl"
        style={{ y: parallaxOffset * -1.2 }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, 25, 0],
        }}
        transition={{
          duration: 7,
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
          <div className="text-center mb-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" data-testid="portfolio-title">
              Cronograma visual dos módulos
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore nossos projetos de automação e desenvolvimento em um formato interativo
            </p>
          </div>
        </motion.div>

        {/* Projects Carousel */}
        <div className="w-full max-w-[calc(100vw-2rem)] mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <Card className="bg-dark border border-dark-tertiary/30 rounded-2xl p-8 h-64">
                    <CardContent className="p-0">
                      <div className="w-8 h-8 bg-gray-600 rounded mb-4"></div>
                      <div className="h-6 bg-gray-600 rounded mb-4"></div>
                      <div className="h-4 bg-gray-600 rounded mb-2"></div>
                      <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : projects.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {projects.map((project, index) => {
                    const tags = parseTags(project.tags);
                    const primaryImage = getPrimaryImage(project);

                    return (
                      <CarouselItem key={project.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                        <motion.div
                          initial={{ opacity: 0, y: 50, rotateX: 15 }}
                          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                          transition={{ 
                            duration: 0.8, 
                            delay: index * 0.1,
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
                          className="h-full"
                        >
                          <Card className="group bg-gradient-to-br from-dark via-dark-secondary to-dark border border-dark-tertiary/30 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 h-full hover:shadow-2xl hover:shadow-emerald-500/20 backdrop-blur-sm">
                            <CardContent className="p-0 h-full flex flex-col">
                              {/* Project Header with gradient background */}
                              <div className="relative h-32 bg-gradient-to-br from-emerald-600/20 via-cyan-500/10 to-emerald-400/5 flex items-center justify-center overflow-hidden">
                                {/* Floating background elements */}
                                <motion.div
                                  className="absolute top-2 right-2 w-8 h-8 bg-emerald-400/20 rounded-full blur-sm"
                                  animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.6, 0.3],
                                  }}
                                  transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                  }}
                                ></motion.div>
                                
                                <motion.div
                                  className="absolute bottom-2 left-2 w-6 h-6 bg-cyan-500/20 rounded-full blur-sm"
                                  animate={{
                                    scale: [1.2, 1, 1.2],
                                    opacity: [0.2, 0.5, 0.2],
                                  }}
                                  transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                  }}
                                ></motion.div>

                                {primaryImage ? (
                                  <img 
                                    src={primaryImage} 
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <motion.div 
                                    className="text-primary text-6xl" 
                                    data-testid={`project-icon-${project.id}`}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    {getIcon(project.icon)}
                                  </motion.div>
                                )}
                                
                                {/* Category Badge with modern styling */}
                                <motion.div 
                                  className={`absolute top-3 left-3 ${project.categoryColor} text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm`}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                                >
                                  {project.category}
                                </motion.div>
                              </div>

                              {/* Project Content */}
                              <div className="p-4 flex-1 flex flex-col">
                                <motion.h3 
                                  className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2" 
                                  data-testid={`project-title-${project.id}`}
                                  initial={{ opacity: 0, x: -20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
                                >
                                  {project.title}
                                </motion.h3>
                                
                                <motion.p 
                                  className="text-gray-300 leading-relaxed mb-3 text-sm line-clamp-3 flex-1" 
                                  data-testid={`project-description-${project.id}`}
                                  initial={{ opacity: 0, x: -20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.6, delay: index * 0.1 + 0.5 }}
                                >
                                  {project.description}
                                </motion.p>

                                {/* Tags */}
                                {tags.length > 0 && (
                                  <motion.div 
                                    className="flex flex-wrap gap-1 mb-3" 
                                    data-testid={`project-tags-${project.id}`}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 + 0.6 }}
                                  >
                                    {tags.slice(0, 2).map((tag, tagIndex) => (
                                      <span key={tagIndex} className="bg-dark-tertiary/50 text-gray-300 px-2 py-1 rounded text-xs">
                                        {tag}
                                      </span>
                                    ))}
                                  </motion.div>
                                )}

                                {/* Metric */}
                                {project.metric && (
                                  <motion.div 
                                    className="text-primary font-semibold text-sm" 
                                    data-testid={`project-metric-${project.id}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 + 0.7 }}
                                  >
                                    {project.metric}
                                  </motion.div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-12 bg-dark/80 border-primary/30 text-primary hover:bg-primary hover:text-white transition-all duration-300" />
                <CarouselNext className="hidden md:flex -right-12 bg-dark/80 border-primary/30 text-primary hover:bg-primary hover:text-white transition-all duration-300" />
              </Carousel>
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
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Nenhum projeto encontrado</h3>
                <p>Em breve teremos novos projetos para mostrar.</p>
              </div>
            </motion.div>
          )}
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
