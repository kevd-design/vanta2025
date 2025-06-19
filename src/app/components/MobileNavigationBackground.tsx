import { FC, useRef } from 'react'
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
  // Use refs to store stable values that won't trigger re-renders
  const stableUrlRef = useRef<string | null>(null);
  const hasCalledSetterRef = useRef<boolean>(false);
  
  // Fixed dimensions for the image - make them large enough
  const fixedWidth = Math.max(dimensions.width, window.innerWidth);
  const fixedHeight = Math.max(dimensions.height, 800);

  // Only generate image URL once
  const { imageUrl, isReady, alt } = useImageHandler({
    image: !stableUrlRef.current ? backgroundImage : null, // Only process if we don't have a URL yet
    width: fixedWidth,
    height: fixedHeight,
    quality: IMAGE_OPTIONS.quality.medium,
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

  return (
    <div className="absolute inset-0 w-full h-full">
      <Image
        src={finalUrl || ''}
        width={fixedWidth}
        height={fixedHeight}
        className="w-full h-full object-cover"
        priority
        alt={alt || ''}
        sizes="100vw"
        placeholder={lqip ? "blur" : undefined}
        blurDataURL={lqip}
        unoptimized={true} // Disable Next.js image optimization to prevent URL changes
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 w-full h-full rounded-b-[32px] bg-gradient-to-r from-emerald-800/90 via-emerald-800/80 to-transparent" />
    </div>
  );
};