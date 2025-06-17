import { useState, useEffect } from 'react'
import type { ImageObject } from '@/app/lib/types/image'

export const useLightboxImages = (images: ImageObject[]) => {
  // Tracking optimized image URLs
  const [optimizedUrls, setOptimizedUrls] = useState<(string | null)[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Process each image separately
  useEffect(() => {
    const processImages = async () => {
      setIsLoading(true)
      const urls = await Promise.all(
        images.map(async (image) => {
          // For simplicity and reliability, use the original URL
          return image?.asset?.url || null
        })
      )
      setOptimizedUrls(urls)
      setIsLoading(false)
    }

    processImages()
  }, [images])

  return {
    optimizedUrls,
    isLoading
  }
}