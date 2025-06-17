'use client'

import { FC } from 'react'
import Image from 'next/image'
import { useOptimizedImage } from '@/app/hooks/useOptimizedImage'
import type { ProjectImageProps } from '@/app/lib/types/components/project'

export const ProjectImage: FC<ProjectImageProps> = ({ 
  image, 
  title,
  lqip
}) => {
  // Use fixed breakpoints based on component position in the layout
  const { url: imageUrl } = useOptimizedImage({
    asset: image?.asset || null,
    hotspot: image?.hotspot || undefined,
    crop: image?.crop || undefined,
    width: 800,
    height: 600,
    quality: 85,
  })

  if (!imageUrl) return null

  return (
    <div className="block overflow-hidden rounded-2xl relative">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
        <Image
          src={imageUrl}
          alt={image.alt || title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          placeholder={lqip ? "blur" : undefined}
          blurDataURL={lqip}
        />
      </div>
    </div>
  )
}