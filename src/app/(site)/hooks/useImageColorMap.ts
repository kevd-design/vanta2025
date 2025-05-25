import { useState, useEffect, useCallback, useMemo } from 'react';
import { ColorMap, ColorMapCell } from '../../types/colorMap';
import { calculateCropRect, calculateDimensions } from '../utils/imageDimensions'
import type { ImageRenderInfo } from '../../types'
import { BREAKPOINTS } from '../constants'

export const useImageColorMap = (
  imageUrl: string | null, 
  renderInfo: ImageRenderInfo,
  baseGridSize = 100  // Base size for calculating grid dimensions
) => {
  const [colorMap, setColorMap] = useState<ColorMap>([]);

  // Memoize render info with all required properties
  const memoizedRenderInfo = useMemo(() => ({
    containerWidth: Math.round(renderInfo.containerWidth),
    containerHeight: Math.round(renderInfo.containerHeight),
    objectFit: renderInfo.objectFit,
    objectPosition: renderInfo.objectPosition,
    hotspot: renderInfo.hotspot
  }), [
    renderInfo.containerWidth,
    renderInfo.containerHeight,
    renderInfo.objectFit,
    renderInfo.objectPosition,
    renderInfo.hotspot
  ]);

  // Process image with minimal dependencies
  const processImage = useCallback((img: HTMLImageElement) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) {
      console.debug('ColorMap: Failed to get canvas context')
      return null
    }

    // First calculate the source aspect ratio
    const sourceAspectRatio = img.width / img.height

    // Match the OptimizedImage dimension calculation
    const dimensions = calculateDimensions(
      memoizedRenderInfo.containerWidth,
      memoizedRenderInfo.containerWidth / sourceAspectRatio, // Force height from width
      sourceAspectRatio,
      BREAKPOINTS
    )

    // Calculate effective dimensions and aspect ratio
    const containerAspectRatio = memoizedRenderInfo.containerWidth / memoizedRenderInfo.containerHeight

    // Calculate grid dimensions based on container
    let gridWidth: number
    let gridHeight: number

    if (containerAspectRatio > 1) {
      // Landscape: maintain base size for height
      gridHeight = baseGridSize
      gridWidth = Math.round(baseGridSize * containerAspectRatio)
    } else {
      // Portrait: maintain base size for width
      gridWidth = baseGridSize
      gridHeight = Math.round(baseGridSize / containerAspectRatio)
    }

    // Remove window.innerWidth/Height from debug
    console.debug('Grid calculations:', {
      container: {
        width: memoizedRenderInfo.containerWidth,
        height: memoizedRenderInfo.containerHeight,
        aspectRatio: containerAspectRatio
      },
      grid: {
        width: gridWidth,
        height: gridHeight,
        aspectRatio: gridWidth / gridHeight
      },
      matches: Math.abs((gridWidth / gridHeight) - containerAspectRatio) < 0.01
    })

    console.debug('ColorMap processing:', {
      source: { width: img.width, height: img.height },
      container: memoizedRenderInfo,
      calculated: dimensions,
      grid: { width: gridWidth, height: gridHeight },
      imageUrl
    })

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    const cropRect = calculateCropRect(
      img.width,
      img.height,
      dimensions.width,
      dimensions.height,
      memoizedRenderInfo.hotspot?.x ?? 0.5,
      memoizedRenderInfo.hotspot?.y ?? 0.5
    )

      ctx.drawImage(
        img,
        Math.round(cropRect.x),      // Source X
        Math.round(cropRect.y),      // Source Y
        Math.round(cropRect.width),  // Source Width
        Math.round(cropRect.height), // Source Height
        0,                          // Destination X
        0,                          // Destination Y
        dimensions.width,           // Destination Width
        dimensions.height           // Destination Height
      )

    const cellWidth = dimensions.width / gridWidth
    const cellHeight = dimensions.height / gridHeight
    const newColorMap: ColorMap = [];

    // Sample colors
    for (let y = 0; y < gridHeight; y++) {
      const row: ColorMapCell[] = []
      for (let x = 0; x < gridWidth; x++) {
        const startX = Math.floor(x * cellWidth);
        const startY = Math.floor(y * cellHeight);
        const width = Math.ceil(cellWidth);
        const height = Math.ceil(cellHeight);

        const data = ctx.getImageData(startX, startY, width, height);
        
        let r = 0, g = 0, b = 0;
        for (let i = 0; i < data.data.length; i += 4) {
          r += data.data[i];
          g += data.data[i + 1];
          b += data.data[i + 2];
        }
        const pixels = data.data.length / 4;
        r = Math.round(r / pixels);
        g = Math.round(g / pixels);
        b = Math.round(b / pixels);

        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        row.push({
          position: [x, y],  // Add position
          color: `rgb(${r},${g},${b})`,
          luminance
        });
      }
      newColorMap.push(row)
    }

    return newColorMap
  }, [memoizedRenderInfo, baseGridSize, imageUrl]);

  // Load and process image
  useEffect(() => {
    let mounted = true;
    let img: HTMLImageElement | null = null;

    const cleanup = () => {
      if (img) {
        img.onload = null;
        img.onerror = null;
      }
      mounted = false;
    };

    if (!imageUrl || !memoizedRenderInfo.containerWidth || !memoizedRenderInfo.containerHeight) {
      console.debug('ColorMap skipped:', { 
        imageUrl, 
        width: memoizedRenderInfo.containerWidth, 
        height: memoizedRenderInfo.containerHeight 
      });
      setColorMap([]);
      return cleanup;
    }

    img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      if (!mounted) return;
      const newMap = processImage(img!);
      if (newMap) {
        console.debug('ColorMap generated:', { 
          mapSize: newMap.length,
          imageSize: { width: img!.width, height: img!.height }
        });
        setColorMap(newMap);
      }
    };

    img.onerror = (error) => {
      console.error('ColorMap image load error:', error);
      setColorMap([]);
    };

    console.debug('ColorMap loading image:', imageUrl);
    img.src = imageUrl;

    return cleanup;
  }, [imageUrl, memoizedRenderInfo, processImage]);

  return colorMap;
};