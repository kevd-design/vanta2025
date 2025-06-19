import { FC, useRef } from 'react'
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
  // Use refs to store stable values that won't trigger re-renders
  const stableUrlRef = useRef<string | null>(null);
  const hasCalledSetterRef = useRef<boolean>(false);
  
  // Fixed dimensions for the image - make them large enough for any screen
  const fixedWidth = Math.max(dimensions.width * 2, window.innerWidth * 2);
  const fixedHeight = Math.max(dimensions.height + 200, window.innerHeight * 1.5);

  // Only generate image URL once
  const { imageUrl, isReady, alt } = useImageHandler({
    image: !stableUrlRef.current ? backgroundImage : null, // Only process if we don't have a URL yet
    width: fixedWidth,
    height: fixedHeight,
    quality: IMAGE_OPTIONS.quality.high,
    objectFit: 'cover',
    onImageUrlGenerated: (url) => {
      // Store the URL and only call the setter once
      if (url && !stableUrlRef.current) {
        stableUrlRef.current = url;
        
        if (setOptimizedImageUrl && !hasCalledSetterRef.current) {
          setOptimizedImageUrl(url);
          hasCalledSetterRef.current = true;
        }
      }
    }
  });

  // Use the stable URL from the ref if available, otherwise use the generated URL
  const finalUrl = stableUrlRef.current || imageUrl;

  if (!backgroundImage?.asset || (!finalUrl && !isReady)) return null;

  // Gradient mask values - different for desktop vs mobile
  const gradientMaskDesktop = 'linear-gradient(to right, transparent, rgba(255,255,255,0.4) 15%, white 30%)';
  const gradientMaskMobile = 'linear-gradient(to right, transparent, rgba(255,255,255,0.5) 25%, white 50%)';

  return (
    <div className="fixed inset-0 w-full h-full overflow-visible">
      {/* Container with positioning */}
      <div 
        className={`fixed inset-0 ${isDesktop ? 'w-full' : 'w-[150%]'}`} 
        style={{
          left: !isDesktop ? '10%' : 'auto',
          right: isDesktop ? '0' : 'auto',
          height: '100vh',
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
              src={finalUrl || ''}
              width={fixedWidth}
              height={fixedHeight}
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
              unoptimized={true} // Disable Next.js image optimization to prevent URL changes
            />
          </div>
        </div>
      </div>
      
      <div 
        className={`fixed inset-0 ${
          isDesktop 
            ? 'bg-gradient-to-r from-white/60 to-transparent'
            : 'bg-gradient-to-r from-white/80 to-transparent'
        }`}
        style={{ 
          height: '100vh',
          pointerEvents: 'none' 
        }}
      />
    </div>
  );
};