'use client'

import { FC } from 'react'
import Link from 'next/link'
import CTA from '@/app/components/common/Cta'
import type { ProjectProps } from '@/app/lib/types/components/common'
import type { CTAType } from '@/app/lib/types/content'
import { ProjectImage } from '@/app/components/common/ProjectImage'

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

