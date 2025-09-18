import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
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
}

export function ImageGallery({ images, projectTitle, className = "" }: ImageGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [originalBodyOverflow, setOriginalBodyOverflow] = useState('');
  const triggerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const focusableElementsRef = useRef<HTMLElement[]>([]);

  // Parse images if they come as JSON string
  const parsedImages = Array.isArray(images) ? images : [];
  
  // If no images, show placeholder
  if (!parsedImages || parsedImages.length === 0) {
    return (
      <div className={`w-full h-48 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center ${className}`}>
        <Images className="w-12 h-12 text-white/60" />
      </div>
    );
  }

  const currentImage = parsedImages[currentImageIndex];

  const openModal = (index: number = 0) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    setOriginalBodyOverflow(document.body.style.overflow || 'auto');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = originalBodyOverflow;
    // Restore focus to trigger element
    setTimeout(() => {
      if (triggerRef.current) {
        triggerRef.current.focus();
      }
    }, 100);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % parsedImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + parsedImages.length) % parsedImages.length);
  };

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
      
      // Focus the close button initially
      setTimeout(() => {
        const closeButton = focusableElementsRef.current.find(el => el.getAttribute('data-testid') === 'button-close-gallery');
        if (closeButton) {
          closeButton.focus();
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
        <div className="w-full h-48 overflow-hidden rounded-lg bg-slate-800">
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
            +{parsedImages.length}
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
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-title"
            aria-describedby="gallery-description"
            data-testid="modal-gallery"
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={closeModal}
              className="absolute top-4 right-4 z-50 text-white hover:text-purple-400 hover:bg-white/10"
              aria-label="Fechar galeria de imagens"
              data-testid="button-close-gallery"
            >
              <X className="w-6 h-6" />
            </Button>

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

            {/* Modal content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-6xl max-h-[95vh] w-full flex flex-col items-center px-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Project title header */}
              <div className="mb-4 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {projectTitle}
                </h2>
                <div className="text-purple-400 font-medium text-sm">
                  Galeria de Imagens • {currentImageIndex + 1} de {parsedImages.length}
                </div>
              </div>

              {/* Main image container with enhanced styling */}
              <div className="relative max-h-[60vh] w-full flex items-center justify-center mb-6 group/image">
                <div className="relative bg-slate-900/50 p-2 rounded-xl backdrop-blur border border-white/10">
                  <img
                    src={currentImage?.url || ''}
                    alt={currentImage?.title || `${projectTitle} - Imagem ${currentImageIndex + 1}`}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
                    loading="lazy"
                    data-testid={`image-${currentImageIndex}`}
                  />
                  
                  {/* Image loading skeleton */}
                  <div className="absolute inset-2 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg animate-pulse opacity-0 transition-opacity duration-300" />
                  
                  {/* Image zoom hint */}
                  <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                    Clique para ver em tamanho real
                  </div>
                </div>
              </div>

              {/* Enhanced image info */}
              <div className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-md border border-purple-500/30 rounded-xl p-6 max-w-2xl w-full text-center shadow-xl">
                <h3 id="gallery-title" className="text-white font-bold text-xl mb-3 bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                  {currentImage?.title || projectTitle}
                </h3>
                {currentImage?.description && (
                  <p id="gallery-description" className="text-gray-300 text-sm leading-relaxed">
                    {currentImage.description}
                  </p>
                )}
                
                {/* Progress indicator */}
                <div className="flex justify-center mt-4">
                  <div className="flex gap-1">
                    {parsedImages.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex
                            ? 'bg-purple-500 w-6'
                            : 'bg-white/30 hover:bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Enhanced thumbnails */}
              {parsedImages.length > 1 && (
                <div className="flex gap-3 mt-6 max-w-full overflow-x-auto pb-2 px-2">
                  {parsedImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${
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
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

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