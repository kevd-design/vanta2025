import { BREAKPOINTS } from '../constants/breakpoints'
import type { Dimensions } from '../../types'

export const roundToBoundary = (value: number, boundaries: readonly number[]) => {
  return boundaries.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  )
}

export const calculateDimensions = (
  width: number, 
  height: number | null, 
  aspectRatio: number,
  boundaries: readonly number[] = BREAKPOINTS
): Dimensions => {
  const roundedWidth = Math.round(roundToBoundary(width, boundaries))
  const actualHeight = height ?? Math.round(width / aspectRatio)
  
  // Calculate height based on target dimensions
  const targetAspectRatio = width / actualHeight
  let preservedHeight: number

  if (targetAspectRatio > aspectRatio) {
    // Width is the constraint
    preservedHeight = Math.round(roundedWidth / aspectRatio)
  } else {
    // Height is the constraint - use actualHeight instead of nullable height
    preservedHeight = actualHeight
    const adjustedWidth = Math.round(actualHeight * aspectRatio)
    if (adjustedWidth < roundedWidth) {
      preservedHeight = Math.round(roundedWidth / aspectRatio)
    }
  }
  
  return { 
    width: roundedWidth, 
    height: preservedHeight,
    aspectRatio: roundedWidth / preservedHeight
  }
}

export const calculateCropRect = (
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  hotspotX: number = 0.5,
  hotspotY: number = 0.5
) => {
  // Scale factors for both dimensions
  const scaleWidth = targetWidth / sourceWidth
  const scaleHeight = targetHeight / sourceHeight
  
  // Use the larger scale to ensure the image covers the target area
  const scale = Math.max(scaleWidth, scaleHeight)
  
  // Calculate dimensions that maintain aspect ratio
  const scaledWidth = sourceWidth * scale
  const scaledHeight = sourceHeight * scale
  
  // Calculate the crop offset while respecting hotspot
  const x = Math.max(0, Math.min(
    scaledWidth - targetWidth,
    (scaledWidth - targetWidth) * hotspotX
  ))
  const y = Math.max(0, Math.min(
    scaledHeight - targetHeight,
    (scaledHeight - targetHeight) * hotspotY
  ))

  return { 
    x, 
    y, 
    width: targetWidth, 
    height: targetHeight 
  }
}