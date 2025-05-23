import { FC, useEffect } from 'react'
import Image from 'next/image'
import { useOptimizedImage } from '../../hooks/useOptimizedImage'
import { ImageDebugOverlay } from '../overlays'
import { useDebug } from '../../context/DebugContext'
import type { OptimizedImageProps, ImageRenderInfo } from '../../../types'
import { IMAGE_OPTIONS } from '../../constants'

export const OptimizedImage: FC<OptimizedImageProps> = ({
  image,
  width,
  height,
  quality = IMAGE_OPTIONS.quality.medium,
  priority = false,
  className = '',
  objectFit = 'cover',
  showDebug = false
}) => {
  const { isDebugMode } = useDebug()

  const { url: imageUrl, generateUrl, setUrl } = useOptimizedImage({
    asset: image.asset ?? null,
    hotspot: image.hotspot ?? null,
    crop: image.crop ?? null,
    width,
    height,
    quality
  })

const renderInfo: ImageRenderInfo = {
  containerWidth: width,
  containerHeight: height,
  objectFit,
  objectPosition: image.hotspot 
    ? { x: image.hotspot.x, y: image.hotspot.y }
    : { x: 0.5, y: 0.5 },
  hotspot: image.hotspot ?? null
}

  useEffect(() => {
    const url = generateUrl()
    if (url) setUrl(url)
  }, [width, height, generateUrl, setUrl])

  if (!imageUrl || !image.asset) return null

  return (
    <>
      <Image
        src={imageUrl}
        alt={image.asset.altText || ''}
        priority={priority}
        className={`${objectFit === 'cover' ? 'object-cover' : 'object-contain'} ${className}`}
        sizes="100vw"
        placeholder={image.asset.metadata?.lqip ? "blur" : undefined}
        blurDataURL={image.asset.metadata?.lqip ?? undefined}
        fill
      />
      
      {isDebugMode && showDebug && (
        <ImageDebugOverlay
          show={true}
          imageUrl={imageUrl}
          renderInfo={renderInfo}
          screenDimensions={{ width, height }}
        />
      )}
    </>
  )
}