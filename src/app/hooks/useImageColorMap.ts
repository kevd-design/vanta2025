import { useState, useEffect, useCallback, useMemo } from 'react';
import { useBestDpr } from '@/app/hooks/useBestDpr'
import type { ColorMap, ColorMapCell } from '@/app/lib/types/colorMap';
import type { ImageMetadata } from '@/app/lib/types/image';
import type { ImageRenderInfo } from '@/app/lib/types/image'

export const useImageColorMap = (
  imageUrl: string | null, 
  renderInfo: ImageRenderInfo,
  sourceMetadata?: ImageMetadata,
  baseGridSize = 100  // Base size for calculating grid dimensions
) => {
  const [colorMap, setColorMap] = useState<ColorMap>([]);

  // Get DPR - but ensure it's consistent with the image
  const baseDpr = useBestDpr();
  
  // Memoize render info with all required properties
  const memoizedRenderInfo = useMemo(() => ({
    containerWidth: Math.round(renderInfo.containerWidth),
    containerHeight: Math.round(renderInfo.containerHeight),
    objectFit: renderInfo.objectFit,
    objectPosition: renderInfo.objectPosition,
    hotspot: renderInfo.hotspot,
    dpr: baseDpr // Use the consistent DPR value
  }), [renderInfo, baseDpr]);

  // Process image with enhanced metadata awareness
  const processImage = useCallback((img: HTMLImageElement) => {
    // CRITICAL FIX: Calculate the effective scale factor between loaded image and container
    // This helps normalize across different DPRs and Next.js image sizing behavior
    const effectiveScaleFactor = Math.max(
      img.naturalWidth / memoizedRenderInfo.containerWidth,
      img.naturalHeight / memoizedRenderInfo.containerHeight
    );
    
    console.debug('Image scale analysis:', {
      naturalSize: { width: img.naturalWidth, height: img.naturalHeight },
      containerSize: { 
        width: memoizedRenderInfo.containerWidth, 
        height: memoizedRenderInfo.containerHeight 
      },
      effectiveScaleFactor,
      dpr: memoizedRenderInfo.dpr,
      metadataAvailable: !!sourceMetadata
    });

    // If we have source metadata, prefer that for consistency
    const effectiveImageWidth = sourceMetadata?.sourceWidth || img.naturalWidth;
    const effectiveImageHeight = sourceMetadata?.sourceHeight || img.naturalHeight;

    // Detect if we're using a scaled image due to DPR
    const isScaledImage = sourceMetadata && 
                        img.naturalWidth !== sourceMetadata.sourceWidth &&
                        Math.abs(img.naturalWidth / sourceMetadata.sourceWidth - memoizedRenderInfo.dpr) < 0.2;

    console.debug('Image color mapping:', {
      effectiveSize: { width: effectiveImageWidth, height: effectiveImageHeight },
      loadedSize: { width: img.naturalWidth, height: img.naturalHeight },
      sourceMetadata: sourceMetadata ? {
        size: `${sourceMetadata.sourceWidth}×${sourceMetadata.sourceHeight}`,
        aspectRatio: sourceMetadata.sourceWidth / sourceMetadata.sourceHeight,
        url: `${sourceMetadata.sourceUrl.substring(0, 50)}...`
      } : 'missing',
      isScaledDueToHighDPR: isScaledImage,
      dpr: memoizedRenderInfo.dpr
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    if (!ctx) {
      console.debug('ColorMap: Failed to get canvas context');
      return null;
    }

    // IMPORTANT CHANGE: Use rendered dimensions for canvas
    // Rather than calculating dimensions from the container width,
    // we'll use the container dimensions directly
    const dimensions = {
      width: memoizedRenderInfo.containerWidth,
      height: memoizedRenderInfo.containerHeight,
      aspectRatio: memoizedRenderInfo.containerWidth / memoizedRenderInfo.containerHeight
    };

    // Calculate grid dimensions that maintain appropriate density
    const containerAspectRatio = dimensions.width / dimensions.height;
    
    let gridWidth, gridHeight;

    if (containerAspectRatio > 1) {
      // Landscape: maintain base size for height
      gridHeight = baseGridSize;
      gridWidth = Math.round(baseGridSize * containerAspectRatio);
    } else {
      // Portrait: maintain base size for width
      gridWidth = baseGridSize;
      gridHeight = Math.round(baseGridSize / containerAspectRatio);
    }

    console.debug('Grid calculations:', {
      container: {
        width: dimensions.width,
        height: dimensions.height,
        aspectRatio: containerAspectRatio,
      },
      grid: {
        width: gridWidth,
        height: gridHeight,
        aspectRatio: gridWidth / gridHeight
      },
      dimensions: dimensions
    });

    // Use canvas dimensions based on the rendered size, not intrinsic image size
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // CRITICAL FIX: Draw the image at the rendered size
    // This ensures the image pixels in the canvas match what the user sees
    ctx.drawImage(
      img,
      0, 0,               // Source X, Y (start at the beginning of the image)
      img.naturalWidth,   // Source width (use full image width)
      img.naturalHeight,  // Source height (use full image height)
      0, 0,               // Destination X, Y
      dimensions.width,   // Destination width (match canvas/container width)
      dimensions.height   // Destination height (match canvas/container height)
    );

    console.debug('Canvas dimensions:', {
      canvas: { width: canvas.width, height: canvas.height },
      image: { width: img.naturalWidth, height: img.naturalHeight },
      container: { width: dimensions.width, height: dimensions.height }
    });

    // Calculate sample sizes based on rendered dimensions
    const cellWidth = dimensions.width / gridWidth;
    const cellHeight = dimensions.height / gridHeight;

    console.debug('Color sampling grid:', {
      gridWidth,
      gridHeight,
      cellWidth,
      cellHeight,
      renderedWidth: dimensions.width,
      renderedHeight: dimensions.height
    });

    const newColorMap: ColorMap = [];

    // Sample colors from the rendered image
    for (let y = 0; y < gridHeight; y++) {
      const row: ColorMapCell[] = [];
      for (let x = 0; x < gridWidth; x++) {
        // Calculate pixel positions in the rendered image
        const sampleX = Math.floor(x * cellWidth);
        const sampleY = Math.floor(y * cellHeight);
        
        // Use small sample area - we're now sampling from rendered size
        const sampleWidth = Math.max(1, Math.ceil(cellWidth));
        const sampleHeight = Math.max(1, Math.ceil(cellHeight));
        
        // Get average color for this cell
        const data = ctx.getImageData(
          sampleX, sampleY, 
          sampleWidth, sampleHeight
        );
        
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

        // Use WCAG-compliant perceptual luminance formula
        const linearR = r / 255 <= 0.03928 ? r / 255 / 12.92 : Math.pow((r / 255 + 0.055) / 1.055, 2.4);
        const linearG = g / 255 <= 0.03928 ? g / 255 / 12.92 : Math.pow((g / 255 + 0.055) / 1.055, 2.4);
        const linearB = b / 255 <= 0.03928 ? b / 255 / 12.92 : Math.pow((b / 255 + 0.055) / 1.055, 2.4);
        
        const luminance = 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB;
        
        // Calculate contrast ratios
        const contrastWithBlack = (luminance + 0.05) / 0.05;
        const contrastWithWhite = 1.05 / (luminance + 0.05);

        row.push({
          position: [x, y],
          color: `rgb(${r},${g},${b})`,
          rawColor: [r, g, b],
          luminance,
          contrastWithBlack,
          contrastWithWhite,
          wcagAACompliant: {
            withBlackText: contrastWithBlack >= 4.5,
            withWhiteText: contrastWithWhite >= 4.5
          }
        });
      }
      newColorMap.push(row);
    }

    // Debug info to confirm coverage
    console.debug('ColorMap analysis:', {
      gridSize: `${gridWidth}×${gridHeight}`,
      mapSize: `${newColorMap[0]?.length || 0}×${newColorMap.length || 0}`,
      coverage: newColorMap.length === gridHeight && newColorMap[0]?.length === gridWidth 
        ? '100%' : `${(newColorMap.length / gridHeight * 100).toFixed(1)}%`,
      canvasSize: `${canvas.width}×${canvas.height}`,
      imageSize: `${img.naturalWidth}×${img.naturalHeight}`,
      firstCell: newColorMap[0]?.[0]?.color || 'missing',
      lastCell: newColorMap[gridHeight-1]?.[gridWidth-1]?.color || 'missing',
      cornerCells: {
        topLeft: newColorMap[0]?.[0]?.color || 'missing',
        topRight: newColorMap[0]?.[gridWidth-1]?.color || 'missing',
        bottomLeft: newColorMap[gridHeight-1]?.[0]?.color || 'missing',
        bottomRight: newColorMap[gridHeight-1]?.[gridWidth-1]?.color || 'missing'
      }
    });

    return newColorMap;
  }, [memoizedRenderInfo, sourceMetadata, baseGridSize]);

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
        height: memoizedRenderInfo.containerHeight,
        dpr: memoizedRenderInfo.dpr
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
          imageSize: { width: img!.naturalWidth, height: img!.naturalHeight },
          renderedSize: { 
            width: memoizedRenderInfo.containerWidth, 
            height: memoizedRenderInfo.containerHeight 
          },
          dpr: memoizedRenderInfo.dpr
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