'use client'

import { FC, ReactNode, useState } from 'react'
import { ImageContainer } from '@/app/components/common/ImageContainer'
import { HeroBackground } from '@/app/components/HeroBackground'
import type { ImageObject } from '@/app/lib/types/image'

interface HeroBaseProps {
  image: ImageObject | null
  height: string
  children: (props: {
    dimensions: {
      width: number
      height: number
    }
    aspectRatio?: number
    adjustedDimensions?: {
      width: number
      height: number
    }
  }) => ReactNode
  preserveAspectRatio?: boolean
  className?: string
}

export const HeroBase: FC<HeroBaseProps> = ({
  image,
  height,
  children,
  preserveAspectRatio = false,
  className = ''
}) => {
  const [, setOptimizedImageUrl] = useState<string | null>(null)

  // Calculate aspect ratio if needed for preservation
  const originalWidth = image?.asset?.metadata?.dimensions?.width || 1600
  const originalHeight = image?.asset?.metadata?.dimensions?.height || 900
  const aspectRatio = originalWidth / originalHeight

  return (
    <div className={`${className}`}>
      <ImageContainer 
        className={`relative w-full ${height} rounded-b-[32px] overflow-hidden`}
        setOptimizedImageUrl={setOptimizedImageUrl}
      >
        {({ dimensions, setOptimizedImageUrl: containerSetOptimizedImageUrl }) => {
          // If preserveAspectRatio is true, calculate adjusted dimensions
          const containerAspectRatio = dimensions.width / dimensions.height
          
          const adjustedDimensions = preserveAspectRatio ? {
            width: containerAspectRatio > aspectRatio 
              ? Math.round(dimensions.height * aspectRatio) 
              : dimensions.width,
            height: containerAspectRatio > aspectRatio 
              ? dimensions.height 
              : Math.round(dimensions.width / aspectRatio)
          } : dimensions;
          
          return (
            <>
              {/* Only render background if image exists */}
              {image?.asset && (
                <HeroBackground 
                  image={image}
                  dimensions={adjustedDimensions}
                  setOptimizedImageUrl={containerSetOptimizedImageUrl}
                />
              )}
              
              {/* Render children with dimensions context */}
              {children({
                dimensions,
                aspectRatio,
                adjustedDimensions
              })}
            </>
          );
        }}
      </ImageContainer>
    </div>
  )
}