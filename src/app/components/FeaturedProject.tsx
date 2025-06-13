'use client'

import { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useOptimizedImage } from '@/app/hooks/useOptimizedImage'
import CTA from '@/app/components/common/Cta'
import type { FeaturedProjectProps } from '@/app/lib/types/components/common'

export const FeaturedProject: FC<FeaturedProjectProps> = ({
  title,
  slug,
  featuredImage,
  cta
}) => {
  // Always call hooks at the top level, even if we use the result conditionally later
  const { url: imageUrl } = useOptimizedImage({
    // Use the correct properties from featuredImage, handling undefined cases
    asset: featuredImage?.asset || null, // Convert undefined to null
    hotspot: featuredImage?.hotspot || undefined,
    crop: featuredImage?.crop || undefined,
    width: 640, 
    height: 480,
    quality: 85,
  })
  
  // Get the LQIP (Low Quality Image Placeholder) from the image metadata
  const lqip = featuredImage?.asset?.metadata?.lqip || undefined

  // Handle missing required data
  if (!title || !slug || !featuredImage?.asset || !imageUrl) {
    return null;
  }

  const projectUrl = `/projects/${slug}`

  return (
    <section className="bg-cream my-40 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:gap-24 items-center justify-between">
          {/* Image section - order-1 makes it appear first on mobile */}
          <div className="w-full md:w-1/2 order-1 md:order-2">
            <Link href={projectUrl} className="block overflow-hidden rounded-2xl relative group">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={featuredImage.alt || title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  placeholder={lqip ? "blur" : undefined}
                  blurDataURL={lqip}
                />
              </div>
            </Link>
          </div>
          
          {/* Content section - only 32px from image on mobile */}
          <div className="w-full md:w-1/2 flex flex-col justify-center order-2 md:order-1 mt-8 md:mt-0">
            <h2 className="font-display text-3xl md:text-4xl text-stone-800 mb-4 md:mb-6">
              {title}
            </h2>
            {cta && (
              <div className="w-full">
                {/* Extend the CTA by adding w-full to its parent */}
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