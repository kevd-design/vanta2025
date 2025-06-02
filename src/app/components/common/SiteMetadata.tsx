import { Metadata } from 'next'
import { sanityFetch } from "@/sanity/lib/live"
import { QUERY_METADATA, type MetadataQueryResult } from '@/app/queries/metaDataQuery'
import type { GenerateMetadataProps } from '@/app/lib/types/components/metadata'

export async function generateSiteMetadata({
  title,
  description,
  image,
  path = ''
}: GenerateMetadataProps): Promise<Metadata> {
  // Fetch site-wide settings from Sanity
  const response = await sanityFetch({ 
    query: QUERY_METADATA 
  });
  
  
  const data = response?.data as MetadataQueryResult;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  const fullUrl = `${siteUrl}${path}`
  
  // Default values for required fields
  const defaultTitle = 'Vanta Construction'
  const defaultDescription = 'Beyond standard construction'
  
  return {
    title: data?.Sitetitle || defaultTitle,
    description: description || data?.description || defaultDescription,
    metadataBase: new URL(siteUrl),
    openGraph: {
      title: title || data?.Sitetitle || defaultTitle,
      description: description || data?.description || defaultDescription,
      url: fullUrl,
      siteName: data?.Sitetitle || defaultTitle,
      images: [
        {
          url: image?.url || data?.heroImage?.asset?.url || '/fallback-og.png',
          width: image?.width || data?.heroImage?.asset?.metadata?.dimensions?.width || 1200,
          height: image?.height || data?.heroImage?.asset?.metadata?.dimensions?.height || 630,
          alt: image?.alt || data?.heroImage?.altText || 'Site preview'
        }
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title || data?.Sitetitle || defaultTitle,
      description: description || data?.description || defaultDescription,
      images: [image?.url || data?.heroImage?.asset?.url || '/fallback-og.png'],
    },
    robots: {
      index: true,
      follow: true
    }
  }
}