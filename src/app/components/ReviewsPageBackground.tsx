import { FC } from 'react'
import Image from 'next/image' 
import { IMAGE_OPTIONS } from '@/app/constants'
import { useImageHandler } from '@/app/hooks/useImageHandler'
import type { ImageObject } from '@/app/lib/types/image'

interface ReviewsPageBackgroundProps {
  backgroundImage: ImageObject | null;
  dimensions: {
    width: number;
    height: number;
  };
  lqip?: string;
  setOptimizedImageUrl?: (url: string) => void;
}

export const ReviewsPageBackground: FC<ReviewsPageBackgroundProps> = ({
  backgroundImage,
  dimensions,
  lqip,
  setOptimizedImageUrl
}) => {
  const { 
    imageUrl, 
    isReady,
    alt
  } = useImageHandler({
    image: backgroundImage,
    width: dimensions.width * 2, // Double the width to allow for offset
    height: dimensions.height,
    quality: IMAGE_OPTIONS.quality.medium,
    objectFit: 'cover',
    onImageUrlGenerated: (url) => {
      if (setOptimizedImageUrl && url) {
        setOptimizedImageUrl(url)
      }
    }
  })

  if (!backgroundImage?.asset || !isReady) return null

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Container with offset - positioned to right quarter */}
      <div className="absolute inset-0 w-[150%] right-0 h-full" style={{
        left: '10%' // This creates the offset, pushing the image to the right
      }}>
        <Image
          src={imageUrl || ''}
          width={dimensions.width * 2} // Double the width
          height={dimensions.height}
          className="w-full h-full object-cover object-left" // Changed to object-left since we're offsetting
          priority
          alt={alt || ''}
          sizes="100vw"
          placeholder={lqip ? "blur" : undefined}
          blurDataURL={lqip}
        />
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/20">
        {/* This gradient now goes from solid white on left to transparent on right */}
      </div>
    </div>
  )
}