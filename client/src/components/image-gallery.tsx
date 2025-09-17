import { useState, useEffect } from "react";
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
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % parsedImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + parsedImages.length) % parsedImages.length);
  };

  // Handle keyboard navigation
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
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isModalOpen]);

  return (
    <>
      {/* Main gallery preview */}
      <div className={`relative group cursor-pointer ${className}`} onClick={() => openModal(0)}>
        <div className="w-full h-48 overflow-hidden rounded-lg bg-slate-800">
          <img
            src={parsedImages[0]?.url || ''}
            alt={parsedImages[0]?.title || projectTitle}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
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
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
          <div className="text-center text-white">
            <Images className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-medium">Ver Galeria</p>
            {parsedImages.length > 1 && (
              <p className="text-xs text-white/80">{parsedImages.length} imagens</p>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeModal}
            data-testid="modal-gallery"
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={closeModal}
              className="absolute top-4 right-4 z-60 text-white hover:text-purple-400 hover:bg-white/10"
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-60 text-white hover:text-purple-400 hover:bg-white/10 w-12 h-12"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-60 text-white hover:text-purple-400 hover:bg-white/10 w-12 h-12"
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
              className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main image */}
              <div className="relative max-h-[70vh] w-full flex items-center justify-center mb-6">
                <img
                  src={currentImage?.url || ''}
                  alt={currentImage?.title || `${projectTitle} - Imagem ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  data-testid={`image-${currentImageIndex}`}
                />
              </div>

              {/* Image info */}
              <div className="bg-slate-800/80 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6 max-w-md text-center">
                <div className="text-purple-400 font-medium text-sm mb-2">
                  {currentImageIndex + 1} de {parsedImages.length}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {currentImage?.title || projectTitle}
                </h3>
                {currentImage?.description && (
                  <p className="text-gray-300 text-sm">
                    {currentImage.description}
                  </p>
                )}
              </div>

              {/* Thumbnails */}
              {parsedImages.length > 1 && (
                <div className="flex gap-2 mt-6 max-w-full overflow-x-auto pb-2">
                  {parsedImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-purple-500 opacity-100'
                          : 'border-white/20 opacity-60 hover:opacity-80'
                      }`}
                      data-testid={`thumbnail-${index}`}
                    >
                      <img
                        src={image.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
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