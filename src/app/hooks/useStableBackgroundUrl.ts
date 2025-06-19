'use client'

import { useState, useEffect, useRef } from 'react'
import type { ImageObject } from '@/app/lib/types/image'
import { useImageHandler } from '@/app/hooks/useImageHandler'
import { IMAGE_OPTIONS } from '@/app/constants'

/**
 * Hook that creates a stable URL for background images that won't change
 * even if the component re-renders with different dimensions.
 */
export const useStableBackgroundUrl = (
  image: ImageObject | null,
  initialWidth: number = 1920, 
  initialHeight: number = 1080
) => {
  // Store the generated URL in state and ref
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const hasGeneratedUrl = useRef(false)
  
  // Calculate dimensions outside of the effect
  const width = typeof window !== 'undefined' ? Math.max(initialWidth, window.innerWidth * 2) : initialWidth;
  const height = typeof window !== 'undefined' ? Math.max(initialHeight, window.innerHeight * 1.5) : initialHeight;

  // Use the image handler at the top level - this is the correct way to use hooks
  const { regenerateImageUrl } = useImageHandler({
    image,
    width,
    height,
    quality: IMAGE_OPTIONS.quality.high,
    objectFit: 'cover'
  });

  // Generate the URL once on mount
  useEffect(() => {
    // Skip if we've already generated a URL or if there's no image
    if (hasGeneratedUrl.current || !image?.asset) return;

    // Generate URL right away using the function from useImageHandler
    const url = regenerateImageUrl();
    if (url) {
      setImageUrl(url);
      hasGeneratedUrl.current = true;
    }
  }, [image, regenerateImageUrl]);

  return imageUrl;
}