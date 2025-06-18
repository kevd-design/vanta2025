'use client'

import { FC } from 'react'
import Link from 'next/link'
import { OttawaSmall } from '@/app/elements/OttawaSmall'
import { HeroBase } from '@/app/components/common/HeroBase'
import type { ProjectHeroProps } from '@/app/lib/types/components/hero'

export const ProjectHero: FC<ProjectHeroProps> = ({
  image,
  headline,
  neighbourhoodName
}) => {
  // Provide a fallback if no image is available
  if (!image?.asset) {
    // Return a simplified header with no image
    return (
      <div className="relative w-full h-[300px] md:h-[400px] rounded-b-[32px] overflow-hidden bg-emerald-800">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent z-10"></div>
        
        {/* Back to projects link */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-30">
          <Link 
            href="/projects" 
            className="text-white bg-black/30 hover:bg-black/50 px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-colors duration-300 mt-20"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Projects</span>
          </Link>
        </div>
        
        {/* Project Title with semi-transparent background */}
        <div className="absolute bottom-24 left-0 w-full z-20">
          <div className="bg-white/80 py-4 md:py-6">
            <div className="container mx-auto px-4">
              <h1 className="font-display text-3xl md:text-5xl text-stone-800">
                {headline}
              </h1>
            </div>
          </div>
        </div>
        
        {/* Neighborhood label */}
        {neighbourhoodName && (
          <div className="absolute bottom-8 left-4 md:left-8 z-20">
            <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-md">
              <span className="text-emerald-800">
                <OttawaSmall />
              </span>
              <span className="font-medium">{neighbourhoodName}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <HeroBase
      image={image}
      height="h-[70vh] sm:h-[600px] md:h-[800px] lg:h-[1000px]"
      preserveAspectRatio={true} // Enable aspect ratio preservation for project images
    >
      {() => (
        <>
          {/* Black gradient overlay for top navigation */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent z-10"></div>
          
          {/* Back to projects link */}
          <div className="absolute top-4 left-4 md:top-8 md:left-8 z-30">
            <Link 
              href="/projects" 
              className="text-white bg-black/30 hover:bg-black/50 px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-colors duration-300 mt-20"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Projects</span>
            </Link>
          </div>
          
          {/* Project Title with semi-transparent background */}
          <div className="absolute bottom-24 left-0 w-full z-20">
            <div className="bg-white/80 py-4 md:py-6">
              <div className="container mx-auto px-4">
                <h1 className="font-display text-3xl md:text-5xl text-stone-800">
                  {headline}
                </h1>
              </div>
            </div>
          </div>
          
          {/* Neighborhood label */}
          {neighbourhoodName && (
            <div className="absolute bottom-8 left-4 md:left-8 z-20">
              <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-md">
                <span className="text-emerald-800">
                  <OttawaSmall />
                </span>
                <span className="font-medium">{neighbourhoodName}</span>
              </div>
            </div>
          )}
        </>
      )}
    </HeroBase>
  )
}