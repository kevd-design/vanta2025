'use client'

import { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useOptimizedImage } from '@/app/hooks/useOptimizedImage'
import CTA from '@/app/components/common/Cta'
import type { FeaturedProjectProps } from '@/app/lib/types/components/common'
import type { ImageObject } from '@/app/lib/types/image'

// Define the proper types for FeaturedImage props
interface FeaturedImageProps {
  image: ImageObject;
  title: string;
  projectUrl: string;
  lqip?: string;
}

export const FeaturedProject: FC<FeaturedProjectProps> = ({
  title,
  slug,
  featuredImage,
  cta
}) => {
  // Get the LQIP (Low Quality Image Placeholder) from the image metadata
  const lqip = featuredImage?.asset?.metadata?.lqip || undefined

  // Handle missing required data
  if (!title || !slug || !featuredImage?.asset) {
    return null;
  }

  const projectUrl = `/projects/${slug}`

  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
          {/* Image section - order-1 makes it appear first on mobile */}
          <div className="w-full md:w-1/2 order-1 md:order-2">
            <FeaturedImage 
              image={featuredImage}
              title={title}
              projectUrl={projectUrl}
              lqip={lqip}
            />
          </div>
          
          {/* Content section - only 32px from image on mobile */}
          <div className="w-full md:w-1/2 flex flex-col justify-center order-2 md:order-1 mt-8 md:mt-0">
            <h2 className="font-display text-3xl md:text-4xl text-stone-800 mb-4 md:mb-6">
              {title}
            </h2>
            {cta && (
              <div className="w-full">
                <CTA 
                  {...cta} 
                  className="w-full flex justify-between items-center rounded-xl"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// Simpler image component that isn't tied to screen resizes
const FeaturedImage: FC<FeaturedImageProps> = ({ 
  image, 
  title, 
  projectUrl, 
  lqip
}) => {
  // Use fixed breakpoints based on component position in the layout
  // These are reasonable sizes for this type of featured image component
  const { url: imageUrl } = useOptimizedImage({
    asset: image?.asset || null,
    hotspot: image?.hotspot || undefined,
    crop: image?.crop || undefined,
    // Use standard sizes that match typical device breakpoints
    // md:w-1/2 means the image will be roughly half of container on medium screens
    width: 800, // A reasonable size that works well across devices
    height: 600, // Maintaining a 4:3 aspect ratio
    quality: 85,
  })

  if (!imageUrl) return null

  return (
    <Link href={projectUrl} className="block overflow-hidden rounded-2xl relative group">
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
    </Link>
  )
}