import { FC } from 'react'
import Image from 'next/image' 
import { IMAGE_OPTIONS } from '@/app/constants'
import { useImageHandler } from '@/app/hooks/useImageHandler'
import type { ImageObject } from '@/app/lib/types/image'

interface ContactPageBackgroundProps {
  backgroundImage: ImageObject | null;
  dimensions: {
    width: number;
    height: number;
  };
  lqip?: string;
  setOptimizedImageUrl?: (url: string) => void;
  isDesktop?: boolean;
}

export const ContactPageBackground: FC<ContactPageBackgroundProps> = ({
  backgroundImage,
  dimensions,
  lqip,
  setOptimizedImageUrl,
  isDesktop = false
}) => {
  // Set a fixed height that doesn't change with URL bar
  const imageHeight = Math.max(window.innerHeight * 1.2, 800) + 100; // Add buffer
  
  const { 
    imageUrl, 
    isReady,
    alt
  } = useImageHandler({
    image: backgroundImage,
    width: dimensions.width * 2,
    height: imageHeight, // Use fixed height
    quality: IMAGE_OPTIONS.quality.medium,
    objectFit: 'cover',
    onImageUrlGenerated: (url) => {
      if (setOptimizedImageUrl && url) {
        setOptimizedImageUrl(url)
      }
    }
  })

  if (!backgroundImage?.asset || !isReady) return null

  // Gradient mask values - different for desktop vs mobile
  const gradientMaskDesktop = 'linear-gradient(to right, transparent, rgba(255,255,255,0.4) 15%, white 30%)';
  const gradientMaskMobile = 'linear-gradient(to right, transparent, rgba(255,255,255,0.5) 25%, white 50%)';

  return (
    <div className="absolute inset-0 w-full h-full overflow-visible">
      {/* Use fixed positioning to prevent container resizing with URL bar */}
      <div 
        className={`fixed inset-x-0 top-0 ${isDesktop ? 'w-full' : 'w-[150%]'}`} 
        style={{
          left: !isDesktop ? '10%' : 'auto',
          right: isDesktop ? '0' : 'auto',
          height: `${imageHeight}px`, // Use fixed height in pixels
          bottom: '-4rem'
        }}
      >
        <div className={`w-full h-full relative ${isDesktop ? 'flex justify-end' : ''}`}>
          <div 
            className={`h-full ${isDesktop ? 'w-auto' : 'w-full'}`}
            style={{
              WebkitMaskImage: isDesktop ? gradientMaskDesktop : gradientMaskMobile,
              maskImage: isDesktop ? gradientMaskDesktop : gradientMaskMobile
            }}
          >
            <Image
              src={imageUrl || ''}
              width={dimensions.width * 2}
              height={imageHeight}
              className={`h-full filter ${isDesktop ? 'w-auto max-w-none' : 'w-full'}`}
              style={{
                objectFit: isDesktop ? 'contain' : 'cover',
                objectPosition: isDesktop ? 'right center' : 'left center'
              }}
              priority
              alt={alt || ''}
              sizes="100vw"
              placeholder={lqip ? "blur" : undefined}
              blurDataURL={lqip}
            />
          </div>
        </div>
      </div>
      
      {/* Fixed positioned gradient overlay */}
      <div 
        className={`fixed inset-x-0 top-0 ${
          isDesktop 
            ? 'bg-gradient-to-r from-white/60 to-transparent'
            : 'bg-gradient-to-r from-white/80 to-transparent'
        }`}
        style={{ 
          height: `${imageHeight}px`,
          pointerEvents: 'none'
        }}
      />
    </div>
  )
}