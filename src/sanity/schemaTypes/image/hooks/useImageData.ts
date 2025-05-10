import { useState, useEffect } from 'react'
import { Subscription } from 'rxjs'
import { MetadataImage, UseImageDataProps } from '../types'
import { sleep } from '../utils/sleep'

/**
 * Hook for managing image metadata state and Sanity client subscriptions.
 * Fetches image data and maintains original metadata for restoration.
 * 
 * @param props Object containing:
 *   - imageId: Sanity image asset reference ID
 *   - client: Sanity client instance for API operations
 * 
 * @returns Object containing:
 *   - sanityImage: Current image metadata state
 *   - setSanityImage: Function to update image metadata
 *   - originalMetadata: Initial metadata state for restoration
 *   - setOriginalMetadata: Function to update original metadata
 * 
 * @example
 * const { sanityImage, setSanityImage, originalMetadata } = useImageData({ 
 *   imageId: 'image-123', 
 *   client: sanityClient 
 * })
 */

export const useImageData = ({ imageId, client }: UseImageDataProps) => {
  const [sanityImage, setSanityImage] = useState<MetadataImage | null>(null)
  const [originalMetadata, setOriginalMetadata] = useState<MetadataImage | null>(null)

  useEffect(() => {
    let subscription: Subscription

    const query = `*[_type == "sanity.imageAsset" && _id == $imageId ][0]{
      _id,
      altText,
      title, 
      description,
      originalFilename,
      extension
    }`
    const params = { imageId }

    const fetchReference = async (listening = false) => {
      if (listening) await sleep(1500)

      try {
        const res = await client.fetch(query, params)
        setSanityImage(res)
        if (!originalMetadata) {
          setOriginalMetadata(res)
        }
      } catch (err: unknown) {
        // Type guard to check if err is an Error object
        if (err instanceof Error) {
          console.error(err.message)
        } else {
          console.error('An unknown error occurred:', err)
        }
      
      }
    }

    const listen = () => {
      subscription = client
        .listen(query, params, { visibility: 'query' })
        .subscribe(() => fetchReference(true))
    }

    if (imageId) {
      fetchReference().then(listen)
    } else {
      setSanityImage(null)
    }

    return () => subscription?.unsubscribe()
  }, [imageId, client, originalMetadata])

  return {
    sanityImage,
    setSanityImage,
    originalMetadata,
    setOriginalMetadata
  }
}