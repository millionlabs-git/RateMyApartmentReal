import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Photo {
  id: string;
  imageUrl: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  }, [photos.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  }, [photos.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, goToPrevious, goToNext]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  if (photos.length === 0) return null;

  return (
    <>
      {/* Thumbnail Row */}
      <div className="flex gap-2 mt-4 overflow-x-auto">
        {photos.slice(0, 5).map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => openLightbox(index)}
            className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#ebba48] focus:ring-offset-2 hover:opacity-90 transition-opacity"
          >
            <img
              src={photo.imageUrl}
              alt={`Review photo ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
        {photos.length > 5 && (
          <button
            onClick={() => openLightbox(5)}
            className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            +{photos.length - 5}
          </button>
        )}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black/95 border-none">
          <VisuallyHidden>
            <DialogTitle>Photo viewer</DialogTitle>
          </VisuallyHidden>
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image container */}
          <div className="relative flex items-center justify-center min-h-[60vh] p-8">
            <img
              src={photos[currentIndex]?.imageUrl}
              alt={`Review photo ${currentIndex + 1}`}
              className="max-w-full max-h-[70vh] object-contain"
            />

            {/* Navigation arrows */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Photo counter */}
          <div className="text-center pb-4 text-white/70 text-sm">
            {currentIndex + 1} / {photos.length}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
