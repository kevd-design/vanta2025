import { FC, useMemo } from 'react'
import Image from 'next/image' 
import { IMAGE_OPTIONS } from '@/app/constants'
import { useImageHandler } from '@/app/hooks/useImageHandler'
import type { MobileNavigationBackgroundProps } from '@/app/lib/types/components/navigation'

export const MobileNavigationBackground: FC<MobileNavigationBackgroundProps> = ({
  backgroundImage,
  dimensions,
  lqip,
  setOptimizedImageUrl
}) => {
  // Use a fixed height that won't change with URL bar
  const fixedHeight = useMemo(() => Math.max(600, dimensions.width * 0.8), [dimensions.width]);
  
  const { 
    imageUrl, 
    isReady,
    alt
  } = useImageHandler({
    image: backgroundImage,
    width: dimensions.width,
    height: fixedHeight, // Use calculated fixed height
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
    <div className="absolute inset-0 w-full h-full">
      <Image
        src={imageUrl || ''}
        width={dimensions.width}
        height={fixedHeight}
        className="w-full h-full object-cover"
        priority
        alt={alt || ''}
        sizes="100vw"
        placeholder={lqip ? "blur" : undefined}
        blurDataURL={lqip}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 w-full h-full rounded-b-[32px] bg-gradient-to-r from-emerald-800/90 via-emerald-800/80 to-transparent" />
    </div>
  )
}