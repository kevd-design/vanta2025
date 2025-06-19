import { FC, ReactNode } from 'react'
import { ImageContainer } from '@/app/components/common/ImageContainer'
import { useWindowSize } from '@/app/hooks/useWindowSize'
import { DIMENSIONS } from '@/app/constants' // Import breakpoints
import type { ImageObject } from '@/app/lib/types/image'

interface PageBackgroundProps {
  backgroundImage: ImageObject | null | undefined;
  backgroundComponent: FC<{
    backgroundImage: ImageObject | null;
    dimensions: {
      width: number;
      height: number;
    };
    lqip?: string;
    setOptimizedImageUrl?: (url: string) => void;
    isDesktop?: boolean;
  }>;
  children: ReactNode;
  lqip?: string;
}

export const PageBackground: FC<PageBackgroundProps> = ({
  backgroundImage,
  backgroundComponent: BackgroundComponent,
  children,
  lqip
}) => {
  // Use the existing useWindowSize hook
  const windowSize = useWindowSize();
  
  // Use mobile breakpoint from constants, assuming BREAKPOINTS.md exists in your constants
  // If not, you can hardcode the value (e.g., 768)
  const isDesktop = windowSize.width >= (DIMENSIONS?.breakpoint.mobile || 768);
  
  // Convert undefined to null for consistent handling
  const safeBackgroundImage = backgroundImage || null;
  
  return (
    <div className="relative flex-grow"> 
      {/* Background layer - position fixed to span entire viewport and beyond */}
      <div className="fixed inset-0 z-0 h-[calc(100%+4rem)]">
        {safeBackgroundImage && (
          <ImageContainer className="w-full h-full">
            {({ dimensions, setOptimizedImageUrl }) => (
              <BackgroundComponent
                backgroundImage={safeBackgroundImage}
                dimensions={dimensions}
                lqip={lqip}
                setOptimizedImageUrl={setOptimizedImageUrl}
                isDesktop={isDesktop}
              />
            )}
          </ImageContainer>
        )}
      </div>
      
      {/* Content area - z-index ensures it's above the background */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};