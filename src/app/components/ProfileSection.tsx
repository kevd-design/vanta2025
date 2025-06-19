'use client'
import { FC } from 'react'
import Image from 'next/image'
import { useOptimizedImage } from '@/app/hooks/useOptimizedImage'
import type { ImageObject } from '@/app/lib/types/image'

interface ProfileSectionProps {
  image: ImageObject | null
  description: string | null
  title: string
  isReversed?: boolean
}

export const ProfileSection: FC<ProfileSectionProps> = ({
  image,
  description,
  title,
  isReversed = false
}) => {
  const { url: imageUrl } = useOptimizedImage({
    asset: image?.asset || null,
    hotspot: image?.hotspot || undefined,
    crop: image?.crop || undefined,
    width: 480,
    height: 480,
    quality: 85,
    fit: 'crop'
  })

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-12`}>
          {/* Image */}
          <div className="w-full md:w-1/2">
            <div className="rounded-full overflow-hidden aspect-square max-w-[400px] mx-auto">
              {imageUrl && image ? (
                <Image
                  src={imageUrl}
                  alt={image.alt || title}
                  width={480}
                  height={480}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200"></div>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-display mb-4 text-emerald-800">
              {title}
            </h2>
            
            {description && (
              <div className="prose max-w-none">
                <p>{description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}