import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageData {
  url: string;
  title?: string;
  description?: string;
}

interface ImageGalleryProps {
  images: ImageData[];
  projectTitle: string;
  className?: string;
  previewClassName?: string;
}

export interface ImageGalleryRef {
  open: (index?: number) => void;
}

export const ImageGallery = forwardRef<ImageGalleryRef, ImageGalleryProps>(
  ({ images, projectTitle, className = "", previewClassName = "h-48" }, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const focusableElementsRef = useRef<HTMLElement[]>([]);

    // Parse images if they come as JSON string
    const parsedImages = Array.isArray(images) ? images : [];
  
  // If no images, show placeholder
  if (!parsedImages || parsedImages.length === 0) {
    return (
      <div className={`w-full ${previewClassName} bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center ${className}`}>
        <Images className="w-12 h-12 text-white/60" />
      </div>
    );
  }

  const currentImage = parsedImages[currentImageIndex];

  const openModal = (index: number = 0) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  // Expose the open method through ref
  useImperativeHandle(ref, () => ({
    open: (index = 0) => openModal(index)
  }));

  const closeModal = () => {
    setIsModalOpen(false);
    
    // Restore focus to trigger element
    setTimeout(() => {
      if (triggerRef.current) {
        triggerRef.current.focus();
      }
    }, 100);
  };

  const nextImage = () => {
    setImageLoading(true);
    setImageError(false);
    setCurrentImageIndex((prev) => (prev + 1) % parsedImages.length);
  };

  const prevImage = () => {
    setImageLoading(true);
    setImageError(false);
    setCurrentImageIndex((prev) => (prev - 1 + parsedImages.length) % parsedImages.length);
  };

  // Reset loading state when modal opens or image index changes
  useEffect(() => {
    if (isModalOpen) {
      setImageLoading(true);
      setImageError(false);
    }
  }, [isModalOpen, currentImageIndex]);


  // Handle keyboard navigation and focus management
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'Tab':
          // Trap focus within modal
          const focusableElements = focusableElementsRef.current;
          if (focusableElements.length === 0) return;
          
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isModalOpen]);

  // Focus management when modal opens
  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      // Get all focusable elements within modal
      const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusableElements = Array.from(modalRef.current.querySelectorAll(focusableSelectors)) as HTMLElement[];
      focusableElementsRef.current = focusableElements.filter(el => !el.hasAttribute('disabled'));
      
      // Focus the first navigation button or thumbnail
      setTimeout(() => {
        const firstButton = focusableElementsRef.current[0];
        if (firstButton) {
          firstButton.focus();
        }
      }, 100);
    }
  }, [isModalOpen, currentImageIndex]);

  const handleTriggerKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(0);
    }
  };

  return (
    <>
      {/* Main gallery preview */}
      <div 
        ref={triggerRef}
        className={`relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg ${className}`} 
        onClick={() => openModal(0)}
        onKeyDown={handleTriggerKeyPress}
        role="button"
        tabIndex={0}
        aria-label={`Abrir galeria de imagens do projeto ${projectTitle}. ${parsedImages.length > 1 ? `${parsedImages.length} imagens disponíveis` : '1 imagem disponível'}`}
        data-testid="trigger-gallery"
      >
        <div className={`w-full ${previewClassName} overflow-hidden rounded-lg bg-slate-800`}>
          <img
            src={parsedImages[0]?.url || ''}
            alt={parsedImages[0]?.title || projectTitle}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '';
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="hidden w-full h-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <Images className="w-12 h-12 text-white/60" />
          </div>
        </div>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg flex items-center justify-center backdrop-blur-sm">
          <div className="text-center text-white transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <div className="bg-white/20 rounded-full p-3 mb-3 mx-auto w-fit">
              <Images className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium mb-1">Ver Galeria Completa</p>
            {parsedImages.length > 1 && (
              <div className="inline-flex items-center gap-1 bg-purple-500/80 px-3 py-1 rounded-full text-xs">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                {parsedImages.length} fotos
              </div>
            )}
          </div>
        </div>

        {/* Image counter badge */}
        {parsedImages.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {parsedImages.length} fotos
          </div>
        )}
      </div>

      {/* Modal/Lightbox */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-title"
            aria-describedby={currentImage?.description ? "gallery-description" : undefined}
            data-testid="modal-gallery"
          >
            {/* Fixed Header - Always Visible */}
            <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-b from-black/90 via-black/70 to-transparent p-4">
              <div className="text-center">
                <h2 id="gallery-title" className="text-xl font-bold text-white">
                  {projectTitle}
                </h2>
                <div className="text-purple-400 font-medium text-sm">
                  {currentImageIndex + 1} de {parsedImages.length}
                </div>
              </div>
            </div>

            {/* Escape hint */}
            <div className="fixed top-20 left-4 text-white/60 text-xs bg-black/30 px-2 py-1 rounded">
              ESC para fechar
            </div>

            {/* Navigation arrows */}
            {parsedImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:text-purple-400 hover:bg-white/10 w-12 h-12"
                  aria-label={`Imagem anterior (${currentImageIndex} de ${parsedImages.length})`}
                  data-testid="button-prev-image"
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:text-purple-400 hover:bg-white/10 w-12 h-12"
                  aria-label={`Próxima imagem (${currentImageIndex + 2} de ${parsedImages.length})`}
                  data-testid="button-next-image"
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}

            {/* Main Content Area - Scrollable with padding for fixed header */}
            <div className="h-full w-full overflow-y-auto overflow-x-hidden pt-20 pb-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center px-4 py-8"
                onClick={(e) => e.stopPropagation()}
              >

              {/* Main image container with enhanced styling */}
              <div className="relative w-full flex items-center justify-center mb-6 group/image">
                <div className="relative bg-slate-900/50 p-2 rounded-xl backdrop-blur border border-white/10">
                  {/* Loading skeleton - visible while image loads */}
                  {imageLoading && !imageError && (
                    <div className="absolute inset-2 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg animate-pulse z-10 flex items-center justify-center min-h-[300px]">
                      <div className="text-purple-400 text-sm">Carregando imagem...</div>
                    </div>
                  )}
                  
                  {/* Error state */}
                  {imageError && (
                    <div className="absolute inset-2 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg z-10 flex items-center justify-center min-h-[300px]">
                      <div className="text-red-400 text-sm text-center">
                        <div className="mb-2">Erro ao carregar imagem</div>
                        <button 
                          onClick={() => {
                            setImageError(false);
                            setImageLoading(true);
                          }}
                          className="text-purple-400 hover:text-purple-300 underline"
                        >
                          Tentar novamente
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <img
                    src={currentImage?.url || ''}
                    alt={currentImage?.title || `${projectTitle} - Imagem ${currentImageIndex + 1}`}
                    className={`max-w-[85vw] max-h-[70vh] object-contain rounded-lg shadow-2xl transition-all duration-300 hover:scale-[1.02] ${
                      imageLoading || imageError ? 'opacity-0' : 'opacity-100'
                    }`}
                    style={{ maxWidth: 'min(85vw, 1200px)', maxHeight: 'min(70vh, 800px)' }}
                    loading="eager"
                    onLoad={() => {
                      setImageLoading(false);
                      setImageError(false);
                    }}
                    onError={() => {
                      setImageLoading(false);
                      setImageError(true);
                    }}
                    data-testid={`image-${currentImageIndex}`}
                  />
                  
                  {/* Image zoom hint */}
                  {!imageLoading && !imageError && (
                    <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                      Clique para ver em tamanho real
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced image info */}
              <div className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-md border border-purple-500/30 rounded-xl p-6 max-w-2xl w-full text-center shadow-xl">
                {currentImage?.title && currentImage.title !== projectTitle && (
                  <h3 id="gallery-title" className="text-white font-bold text-xl mb-3 bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                    {currentImage.title}
                  </h3>
                )}
                {currentImage?.description && (
                  <p id="gallery-description" className="text-gray-300 text-sm leading-relaxed">
                    {currentImage.description}
                  </p>
                )}
                
                {/* Progress indicator */}
                {parsedImages.length > 1 && (
                  <div className="flex justify-center mt-4">
                    <div className="flex gap-1">
                      {parsedImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(index);
                          }}
                          className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 ${
                            index === currentImageIndex
                              ? 'bg-purple-500 w-6'
                              : 'bg-white/30 hover:bg-white/50'
                          }`}
                          aria-label={`Ir para imagem ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced thumbnails */}
              {parsedImages.length > 1 && (
                <div className="w-full mt-6">
                  <div className="flex gap-3 max-w-full overflow-x-auto pb-4 px-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
                    {parsedImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(index);
                        }}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${
                          index === currentImageIndex
                            ? 'border-purple-500 shadow-lg shadow-purple-500/30 scale-105'
                            : 'border-white/20 opacity-70 hover:opacity-90 hover:border-white/40'
                        }`}
                        data-testid={`thumbnail-${index}`}
                      >
                        <img
                          src={image.url}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300"
                          loading="lazy"
                        />
                        {index === currentImageIndex && (
                          <div className="absolute inset-0 bg-purple-500/20 rounded-xl" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

// Helper function to parse images from JSON string
export function parseProjectImages(images: string): ImageData[] {
  try {
    if (!images || images === '[]') return [];
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}