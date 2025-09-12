import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, ShoppingCart, BarChart3, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
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
        className="absolute top-10 right-10 w-28 h-28 bg-purple-600/10 rounded-full blur-2xl"
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
        className="absolute bottom-20 left-10 w-20 h-20 bg-purple-400/10 rounded-full blur-xl"
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
          {isLoading ? (
            // Loading skeletons
            [...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <Card className="bg-dark border border-dark-tertiary/30 rounded-2xl overflow-hidden h-full">
                  <div className="aspect-video bg-gray-300 dark:bg-gray-700" />
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-3" />
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4" />
                    <div className="space-y-2 mb-4">
                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded" />
                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                    </div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
                      <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
                    </div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                  </CardContent>
                </Card>
              </div>
            ))
          ) : projects.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Nenhum projeto disponível
              </h3>
              <p className="text-gray-400">
                Os projetos serão exibidos aqui quando estiverem disponíveis.
              </p>
            </div>
          ) : (
            projects.map((project, index) => (
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
                  {getPrimaryImage(project) ? (
                    <img
                      src={getPrimaryImage(project)!}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-6xl text-primary/40">
                      {getIcon(project.icon || "Building")}
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className={`${project.categoryColor || "bg-primary"} px-3 py-1 rounded-full text-sm font-semibold text-white`}>
                      {project.category}
                    </span>
                  </div>
                  {/* Show image count if multiple images */}
                  {parseImages(project.images || "[]").length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      +{parseImages(project.images || "[]").length - 1}
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    {getIcon(project.icon || "Building")}
                    <h3 className="text-xl font-bold text-white" data-testid={`project-title-${project.id}`}>
                      {project.title}
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-4 leading-relaxed" data-testid={`project-description-${project.id}`}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4" data-testid={`project-tags-${project.id}`}>
                    {parseTags(project.tags).map((tag, tagIndex) => (
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
            ))
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
