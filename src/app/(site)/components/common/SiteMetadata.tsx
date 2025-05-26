import { Metadata } from 'next'
import { sanityFetch } from "@/sanity/lib/live"
import { QUERY_METADATA, type MetadataQueryResult } from '../../queries/metaDataQuery'

// Define props interface
interface GenerateMetadataProps {
  title?: string
  description?: string
  image?: {
    url: string
    width: number
    height: number
    alt: string
  }
  path?: string
}

export async function generateSiteMetadata({
  title,
  description,
  image,
  path = ''
}: GenerateMetadataProps): Promise<Metadata> {
  // Fetch site-wide settings from Sanity
  const { data } = await sanityFetch({ 
    query: QUERY_METADATA 
  }) as { data: MetadataQueryResult };
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  const fullUrl = `${siteUrl}${path}`
  
  // Default values for required fields
  const defaultTitle = 'Vanta Construction'
  const defaultDescription = 'Beyond standard construction'
  
  return {
    title: title || data?.title || defaultTitle,
    description: description || data?.description || defaultDescription,
    metadataBase: new URL(siteUrl),
    openGraph: {
      title: title || data?.title || defaultTitle,
      description: description || data?.description || defaultDescription,
      url: fullUrl,
      siteName: data?.title || defaultTitle,
      images: [
        {
          url: image?.url || data?.siteImage?.asset?.url || '/fallback-og.png',
          width: image?.width || data?.siteImage?.asset?.metadata?.dimensions?.width || 1200,
          height: image?.height || data?.siteImage?.asset?.metadata?.dimensions?.height || 630,
          alt: image?.alt || data?.siteImage?.altText || 'Site preview'
        }
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title || data?.title || defaultTitle,
      description: description || data?.description || defaultDescription,
      images: [image?.url || data?.siteImage?.asset?.url || '/fallback-og.png'],
    },
    robots: {
      index: true,
      follow: true
    }
  }
}