'use client'

import { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useOptimizedImage } from '@/app/hooks/useOptimizedImage'
import CTA from '@/app/components/common/Cta'
import type { ProjectProps } from '@/app/lib/types/components/common'
import type { CTAType } from '@/app/lib/types/content'
import type { ImageObject } from '@/app/lib/types/image'

// Define the proper types for ProjectImage props
interface ProjectImageProps {
  image: ImageObject;
  title: string;
  lqip?: string;
}

export const Project: FC<ProjectProps> = ({
  title,
  slug,
  image,
  cta,
  isAlternate = false
}) => {
  // Get the LQIP (Low Quality Image Placeholder) from the image metadata
  const lqip = image?.asset?.metadata?.lqip || undefined

  // Handle missing required data
  if (!title || !slug || !image?.asset) {
    return null;
  }

  const projectUrl = `/projects/${slug}`

  // Generate a default CTA if none is provided
  const defaultCta: CTAType = {
    linkLabel: "View Project",
    linkType: "toProject",
    toProject: slug
  }

  const projectCta = cta || defaultCta

  return (
    <section className="bg-cream-100 py-16">
      <div className="container mx-auto px-4">
        {/* Add custom styles to override CTA behavior specifically in Project component */}
        <style jsx global>{`
          /* Override the CTA animated underline in project context */
          .project-cta-group .group-hover\:w-full {
            width: 0 !important; /* Disable the animated underline */
            transition: none !important;
          }
          
          /* Add simple text underline on hover instead */
          .project-cta-group:hover .project-cta-text {
            text-decoration: underline;
          }
          
          /* Disable arrow animation in project context */
          .project-cta-group:hover .transform {
            transform: none !important;
          }
        `}</style>
        
        {/* Add group class to the container to enable group hover effects */}
        <div className={`flex flex-col ${isAlternate ? 'md:flex-row-reverse' : 'md:flex-row'} items-center justify-between gap-8 md:gap-16 group`}>
          {/* Image section with Link */}
          <div className="w-full md:w-1/2 order-1 md:order-none">
            <Link href={projectUrl} className="block">
              <ProjectImage 
                image={image}
                title={title}
                lqip={lqip}
              />
            </Link>
          </div>
          
          {/* Content section */}
          <div className="w-full md:w-1/2 flex flex-col justify-center order-2 md:order-none md:mt-0">
            <h2 className="font-display text-3xl md:text-4xl text-stone-800 mb-4 text-left">
              <Link href={projectUrl} className="group-hover:underline">
                {title}
              </Link>
            </h2>
            
            <div className="w-full md:w-auto project-cta-group">
              {/* Add special classes for targeting in CSS */}
              <CTA 
                {...projectCta}
                toProjectSlug={slug}
                className="w-full md:w-auto flex justify-between items-center rounded-xl transition-colors project-cta-container"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ProjectImage component with group-hover scale effect
const ProjectImage: FC<ProjectImageProps> = ({ 
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