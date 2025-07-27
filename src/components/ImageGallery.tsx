import { useState } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ImageGalleryProps {
  images: Array<{
    image_url: string;
    is_primary?: boolean;
  }>;
  title: string;
}

export const ImageGallery = ({ images, title }: ImageGalleryProps) => {
  const { isRTL } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 lg:h-[600px] bg-gradient-ocean flex items-center justify-center rounded-xl">
        <span className="text-primary-foreground text-xl font-semibold">
          لا توجد صورة متاحة
        </span>
      </div>
    );
  }

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Image */}
        <div className="lg:col-span-3">
          <div className="relative group">
            <img
              src={images[selectedImageIndex]?.image_url}
              alt={title}
              className="w-full h-96 lg:h-[600px] object-cover rounded-xl shadow-ocean cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
              onClick={() => openModal(selectedImageIndex)}
            />
            {images.length > 1 && (
              <>
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-white text-sm font-medium">
                    {selectedImageIndex + 1} / {images.length}
                  </span>
                </div>
                
                {/* Navigation arrows */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="lg:col-span-1">
            <div className="grid grid-cols-4 lg:grid-cols-1 gap-3">
              {images.slice(0, 8).map((image, index) => (
                <img
                  key={index}
                  src={image.image_url}
                  alt={`${title} ${index + 1}`}
                  className={`w-full h-20 lg:h-24 object-cover rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedImageIndex === index 
                      ? 'ring-3 ring-primary shadow-lg scale-105' 
                      : 'hover:opacity-80 hover:scale-102'
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
              {images.length > 8 && (
                <div className="w-full h-20 lg:h-24 bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                  <span className="text-muted-foreground text-sm font-medium">
                    +{images.length - 8}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal for full-screen view */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            <img
              src={images[selectedImageIndex]?.image_url}
              alt={title}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            
            {/* Navigation in modal */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="text-white font-medium">
                    {selectedImageIndex + 1} / {images.length}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};