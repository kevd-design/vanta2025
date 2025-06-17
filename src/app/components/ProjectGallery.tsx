'use client'

import { FC, useState } from 'react'
import Image from 'next/image'
import { useOptimizedImage } from '@/app/hooks/useOptimizedImage'
import type { ImageObject } from '@/app/lib/types/image'
import { ProjectGalleryLightbox } from './ProjectGalleryLightbox'

interface ProjectGalleryProps {
  images: ImageObject[]
  title: string
}

export const ProjectGallery: FC<ProjectGalleryProps> = ({ images, title }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  if (!images || images.length === 0) return null

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index)
    setLightboxOpen(true)
  }

  return (
    <div className="bg-cream-100 pb-12 md:pb-16">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl text-stone-800 mb-8">Gallery</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {images.map((image, i) => (
            <GalleryImage 
              key={`gallery-${i}`} 
              image={image} 
              alt={image.alt || `${title} gallery image ${i + 1}`}
              onClick={() => openLightbox(i)}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <ProjectGalleryLightbox 
          images={images}
          initialIndex={selectedImageIndex}
          onClose={() => setLightboxOpen(false)}
          title={title}
        />
      )}
    </div>
  )
}

interface GalleryImageProps {
  image: ImageObject
  alt: string
  onClick: () => void
}

const GalleryImage: FC<GalleryImageProps> = ({ image, alt, onClick }) => {
  const { url: imageUrl } = useOptimizedImage({
    asset: image?.asset || null,
    hotspot: image?.hotspot || undefined,
    crop: image?.crop || undefined,
    width: 600,
    height: 450, // 4:3 aspect ratio
    quality: 85,
  })

  if (!imageUrl) return null
  
  // Fix: Convert lqip from "string | null | undefined" to "string | undefined"
  const lqip = image?.asset?.metadata?.lqip || undefined

  return (
    <div 
      className="overflow-hidden rounded-2xl cursor-pointer" 
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover hover:scale-105 transition-transform duration-700"
          placeholder={lqip ? "blur" : undefined}
          blurDataURL={lqip}  // Now lqip is string | undefined, not null
        />
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="opacity-0 hover:opacity-100 transition-opacity">
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 21H3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 3L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 21L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}