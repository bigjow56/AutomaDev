import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Eye, FileText, Image as ImageIcon, Maximize2, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { useParallax } from "@/hooks/use-scroll";
import { ImageGallery, ImageGalleryRef, parseProjectImages } from "@/components/image-gallery";
import { useState, useRef } from "react";

export default function ProjectsSection() {
  const parallaxOffset = useParallax(-0.15);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  // Fetch projects data
  const { data: projectsData } = useQuery<{ success: boolean; projects: Project[] }>({
    queryKey: ["/api/projects"],
  });

  const projects = projectsData?.projects || [];
  
  // Create refs for all projects to avoid hooks inside map
  const galleryRefs = useRef<{ [key: string]: ImageGalleryRef | null }>({});

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

  const getIconEmoji = (iconName: string): string => {
    const iconMap: { [key: string]: string } = {
      'BarChart': '📊',
      'Globe': '🌐', 
      'Bot': '🤖',
      'ShoppingCart': '🛒',
      'Building': '🏢',
      'Code': '💻',
      'Database': '🗄️',
      'Mobile': '📱',
      'Zap': '⚡',
      'Shield': '🛡️'
    };
    return iconMap[iconName] || '💻';
  };

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section
      id="projects"
      className="py-20 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"></div>
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
        {/* Header da seção */}
        <motion.div
          className="text-center mb-16 relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-500 via-purple-400 to-purple-300 rounded-full mb-6"></div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 pt-8 bg-gradient-to-r from-purple-400 via-purple-300 to-purple-200 bg-clip-text text-transparent">
            Meus Projetos
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Conheça alguns dos projetos que desenvolvi, combinando tecnologia e criatividade para resolver problemas reais
          </p>
        </motion.div>

        {/* Grid de projetos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {projects.map((project, index) => {
            const tags = parseJsonArray(project.tags);
            const images = parseProjectImages(project.images || '[]');
            const isExpanded = expandedProject === project.id;
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                layout
                className={`${isExpanded ? 'lg:col-span-2' : ''}`}
              >
                <Card className={`bg-slate-800/40 border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300 ${!isExpanded ? 'hover:-translate-y-2' : ''} hover:shadow-xl hover:shadow-purple-500/20 relative ${isExpanded ? 'overflow-visible' : 'overflow-hidden'} group ${isExpanded ? 'h-auto' : 'h-full'}`}>
                  
                  
                  {/* Hover effect overlay - only when not expanded */}
                  {!isExpanded && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                  )}
                  
                  <CardContent className="p-8 relative z-10 flex flex-col">
                    <div className={`${isExpanded ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' : ''}`}>
                      
                      {/* Left Column - Images */}
                      <div className={`${isExpanded ? 'order-1' : ''}`}>
                        {/* Project gallery */}
                        <div className={`mb-6 ${isExpanded ? '' : 'h-48'} overflow-hidden rounded-lg`}>
                          <ImageGallery 
                            key={`${project.id}-${isExpanded ? 'expanded' : 'compact'}`}
                            ref={(ref) => {
                              galleryRefs.current[project.id] = ref;
                            }}
                            images={images} 
                            projectTitle={project.title}
                            className={isExpanded ? "rounded-lg" : "h-full"}
                            previewClassName={isExpanded ? "h-[420px] md:h-[560px]" : "h-48"}
                          />
                        </div>

                        {/* Gallery preview for expanded view */}
                        {isExpanded && images.length > 1 && (
                          <div className="mt-6">
                            <h4 className="text-lg font-semibold text-white mb-4">Galeria de Imagens</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                              {images.slice(1).map((image, imgIndex) => (
                                <motion.div
                                  key={imgIndex}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.3, delay: imgIndex * 0.1 }}
                                  className="relative aspect-square rounded-lg overflow-hidden bg-slate-700 cursor-pointer group/thumb"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Open gallery at the clicked image (imgIndex + 1 because we skipped first image)
                                    galleryRefs.current[project.id]?.open(imgIndex + 1);
                                  }}
                                  data-testid={`thumb-image-${project.id}-${imgIndex+1}`}
                                >
                                  <img
                                    src={image.url}
                                    alt={image.title || `${project.title} - Imagem ${imgIndex + 2}`}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-110"
                                    loading="lazy"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <Maximize2 className="w-6 h-6 text-white" />
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Column - Content */}
                      <div className={`${isExpanded ? 'order-2' : ''} ${isExpanded ? '' : 'flex flex-col justify-between'}`}>
                        {/* Project title */}
                        <h3 className={`${isExpanded ? 'text-2xl' : 'text-xl'} font-bold text-white mb-4 group-hover:text-purple-300 transition-colors`}>
                          {project.title}
                        </h3>

                        {/* Project description */}
                        <p className={`text-gray-300 mb-6 leading-relaxed ${isExpanded ? '' : 'flex-grow text-sm'}`}>
                          {project.description}
                        </p>

                        {/* Tech tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {(isExpanded ? tags : tags.slice(0, 4)).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className={`px-3 py-1 bg-purple-600/20 text-purple-300 ${isExpanded ? 'text-sm' : 'text-xs'} rounded-full border border-purple-600/30 font-medium hover:bg-purple-600/30 transition-colors`}
                            >
                              {tag}
                            </span>
                          ))}
                          {!isExpanded && tags.length > 4 && (
                            <span className="px-2 py-1 bg-slate-600/50 text-gray-400 text-xs rounded-full border border-slate-500/30">
                              +{tags.length - 4}
                            </span>
                          )}
                        </div>

                        {/* Project actions */}
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mt-auto">
                          {/* Metric display */}
                          <div className="inline-flex items-center px-4 py-2 bg-purple-600/10 border border-purple-500/20 rounded-full text-purple-300 text-sm">
                            <Eye className="w-4 h-4 mr-2" />
                            {project.metric}
                          </div>

                          {/* Expand/Collapse button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedProject(isExpanded ? null : project.id);
                            }}
                            className="border-purple-500/30 text-purple-300 hover:bg-purple-600/20 hover:border-purple-500/50 transition-all"
                            data-testid={`button-${isExpanded ? 'collapse' : 'expand'}-project`}
                          >
                            {isExpanded ? (
                              <>
                                <X className="w-4 h-4 mr-2" />
                                Fechar
                              </>
                            ) : (
                              <>
                                <ImageIcon className="w-4 h-4 mr-2" />
                                Ver Galeria
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          className="bg-slate-800/30 border border-purple-500/20 rounded-3xl p-16 text-center backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
            Gostou do que viu?
          </h3>
          <p className="text-xl text-gray-300 mb-8">
            Vamos conversar sobre como posso ajudar você a transformar suas ideias em realidade
          </p>
          <Button
            onClick={() => {
              const element = document.getElementById("contact");
              if (element) {
                const offsetTop = element.offsetTop - 80;
                window.scrollTo({
                  top: offsetTop,
                  behavior: "smooth",
                });
              }
            }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-xl"
            data-testid="button-contact-from-projects"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Entre em Contato
          </Button>
        </motion.div>
      </div>
    </section>
  );
}