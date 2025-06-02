import { FC } from 'react'
import Image from 'next/image' 
import { IMAGE_OPTIONS } from '@/app/constants'
import { useImageHandler } from '@/app/hooks/useImageHandler'
import type { HeroBackgroundProps } from '@/app/lib/types/components/hero'

export const HeroBackground: FC<HeroBackgroundProps> = ({
  image,
  dimensions,
  isDebugMode = false,
  onColorMapChange,
  setOptimizedImageUrl
}) => {


  const { 
    imageUrl, 
    isReady,
    alt
  } = useImageHandler({
    image,
    width: dimensions.width,
    height: dimensions.height,
    quality: IMAGE_OPTIONS.quality.medium,
    objectFit: 'cover',
    onColorMapChange,
    onImageUrlGenerated: (url) => {
      if (setOptimizedImageUrl && url) {
        setOptimizedImageUrl(url)
      }
    },
    isDebugMode
  })

  if (!image?.asset) return null

  if (!isReady) return null

  return (
    <div className="absolute inset-0 w-full h-full">
      <Image
        src={imageUrl || ''}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full object-cover"
        priority
        alt={alt}
      />
    </div>
  )
}