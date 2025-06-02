export interface GenerateMetadataProps {
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