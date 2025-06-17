'use client'

import { FC, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { ImageObject } from '@/app/lib/types/image'
import { useLightboxImages } from '@/app/hooks/useLightboxImages'

interface ProjectGalleryLightboxProps {
  images: ImageObject[]
  initialIndex: number
  onClose: () => void
  title: string
}

export const ProjectGalleryLightbox: FC<ProjectGalleryLightboxProps> = ({
  images,
  initialIndex,
  onClose,
  title
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const { optimizedUrls, isLoading } = useLightboxImages(images)
  
  // Get current image and URL
  const currentImage = images[currentIndex]
  const currentOptimizedUrl = optimizedUrls[currentIndex]
  
  // Wrap navigation functions with useCallback to prevent recreating them on every render
  const goToNext = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }, [images.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }, [images.length])

  // Set up keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNext()
      } else if (e.key === 'ArrowLeft') {
        goToPrev()
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [onClose, goToNext, goToPrev])

  // Loading state or no URL
  if (isLoading || !currentOptimizedUrl) {
    return (
      <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
      {/* Header with counter and close button */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center text-white z-10">
        <h2 className="font-display text-xl">
          Image {currentIndex + 1} / {images.length}
        </h2>
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          aria-label="Close gallery"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Main image container */}
      <div className="w-full h-full flex items-center justify-center p-4 sm:p-10">
        <div className="relative w-full h-full">
          <Image 
            key={`lightbox-image-${currentIndex}`}
            src={currentOptimizedUrl}
            alt={currentImage.alt || `${title} gallery image ${currentIndex + 1}`}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Navigation arrows - Desktop (sides) */}
      <div className="hidden md:block">
        <button 
          onClick={goToPrev}
          className="absolute left-2 md:left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-emerald-800 rounded-full flex items-center justify-center transition-colors"
          aria-label="Previous image"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button 
          onClick={goToNext}
          className="absolute right-2 md:right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-emerald-800 rounded-full flex items-center justify-center transition-colors"
          aria-label="Next image"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Navigation arrows - Mobile (bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 flex justify-between px-6 pb-8 pt-4">
        <button 
          onClick={goToPrev}
          className="w-16 h-16 bg-emerald-800 rounded-full flex items-center justify-center shadow-lg"
          aria-label="Previous image"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button 
          onClick={goToNext}
          className="w-16 h-16 bg-emerald-800 rounded-full flex items-center justify-center shadow-lg"
          aria-label="Next image"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}