import { FC } from 'react'
import { IMAGE_OPTIONS } from '@/app/constants'
import { OptimizedImage } from '@/app/components/common/OptimizedImage'
import type { HeroBackgroundProps } from '@/app/lib/types/components/hero'

export const HeroBackground: FC<HeroBackgroundProps> = ({
  image,
  dimensions,
  isDebugMode = false,
  onColorMapChange,
  setOptimizedImageUrl
}) => {
  if (!image?.asset) return null

  const handleImageUrlGenerated = (url: string | null) => {
    if (setOptimizedImageUrl && url) {
      setOptimizedImageUrl(url)
    }
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      <OptimizedImage
        image={{
          _type: 'imageWithMetadata',
          asset: image.asset,
          hotspot: image.hotspot ?? undefined,
          crop: image.crop ?? undefined
        }}
        width={dimensions.width}
        height={dimensions.height}
        priority
        quality={IMAGE_OPTIONS.quality.medium}
        className="w-full h-full"
        showDebug={isDebugMode}
        onColorMapChange={onColorMapChange}
        onImageUrlGenerated={handleImageUrlGenerated}
      />
    </div>
  )
}