import Image from 'next/image'
import { FC, useState } from 'react'
import { useImageHandler } from '@/app/hooks/useImageHandler'
import type { OptimizedImageProps } from '@/app/lib/types/components/common'

export const OptimizedImage: FC<OptimizedImageProps> = ({
  image,
  width,
  height,
  quality,
  className = '',
  priority = false,
  objectFit = 'cover',
  showDebug = false,
  onColorMapChange,
  onImageUrlGenerated
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Use imageHandler for consistent rendering
  const { 
    imageUrl, 
    isReady,
    alt,
    dimensions,
  } = useImageHandler({
    image,
    width,
    height,
    quality,
    objectFit,
    onColorMapChange,
    onImageUrlGenerated,
    isDebugMode: showDebug
  })

  if (!isReady || !image?.asset) {
    if (showDebug) {
      console.warn('OptimizedImage not ready:', { isReady, hasAsset: !!image?.asset })
    }
    return null
  }

  return (
    <div className={`relative ${showDebug ? 'outline outline-2 outline-red-500' : ''}`}>
      <Image
        src={imageUrl}
        width={dimensions.width}
        height={dimensions.height}
        className={`${className} object-${objectFit} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        loading={priority ? 'eager' : 'lazy'}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  )
}