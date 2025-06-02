import Image from 'next/image'
import { FC } from 'react'
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
  // Replace all the existing hooks and state management with useImageHandler
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

  // Return null when not ready
  if (!isReady || !image?.asset) {
    if (showDebug) {
      console.warn('OptimizedImage not ready:', { isReady, hasAsset: !!image?.asset })
    }
    return null
  }

  // Simplified rendering logic
  return (
    <div className={`relative ${showDebug ? 'outline outline-2 outline-red-500' : ''}`}>
      <Image
        src={imageUrl || ''}
        width={dimensions.width}
        height={dimensions.height}
        className={`${className} object-${objectFit}`}
        loading={priority ? 'eager' : 'lazy'}
        alt={alt}
      />
    </div>
  )
}