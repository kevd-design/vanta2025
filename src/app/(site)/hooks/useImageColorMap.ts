import { useState, useEffect, useCallback, useMemo } from 'react';
import { ColorMap, ColorMapCell } from '../../types/colorMap';
import type { CropDimensions, CropRect, ImageRenderInfo } from '../../types'

export const useImageColorMap = (
    imageUrl: string | null, 
    renderInfo: ImageRenderInfo,
    gridSize = 100
) => {
  const [colorMap, setColorMap] = useState<ColorMap>([]);

  const memoizedRenderInfo = useMemo(() => ({
    containerWidth: Math.floor(renderInfo.containerWidth),
    containerHeight: Math.floor(renderInfo.containerHeight),
    objectFit: renderInfo.objectFit,
    objectPosition: renderInfo.objectPosition,
  }), [
    renderInfo.objectPosition,
    renderInfo.containerWidth,
    renderInfo.containerHeight,
    renderInfo.objectFit,
  ]);

  const processImage = useCallback((img: HTMLImageElement) => {
  const { 
    containerWidth, 
    containerHeight, 
    hotspot 
  } = memoizedRenderInfo as ImageRenderInfo;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Ensure integer dimensions
    const exactWidth = Math.floor(containerWidth);
    const exactHeight = Math.floor(containerHeight);

    canvas.width = exactWidth;
    canvas.height = exactHeight;
    
    // Calculate crop rect using hotspot
    const cropRect = calculateCropRect({
      sourceWidth: img.width,
      sourceHeight: img.height,
      targetWidth: exactWidth,
      targetHeight: exactHeight,
      hotspot: hotspot ?? { x: 0.5, y: 0.5, height: 1, width: 1 }
    });

    // Clear and draw
      ctx.drawImage(
    img,
    cropRect.x,
    cropRect.y,
    cropRect.width,
    cropRect.height,
    0,
    0,
    exactWidth,
    exactHeight
  );


    // Calculate precise grid cell dimensions
    const cellWidth = exactWidth / gridSize;
    const cellHeight = exactHeight / gridSize;

    const newColorMap: ColorMap = [];

    // Sample colors with precise boundaries
    for (let y = 0; y < gridSize; y++) {
      const row: ColorMapCell[] = [];
      for (let x = 0; x < gridSize; x++) {
        const startX = Math.floor(x * cellWidth);
        const startY = Math.floor(y * cellHeight);
        const width = Math.ceil(cellWidth);
        const height = Math.ceil(cellHeight);

        const data = ctx.getImageData(startX, startY, width, height);
        
        // Calculate average color for this cell
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

        // Calculate luminance using WCAG formula
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        row.push({
          color: `rgb(${r},${g},${b})`,
          luminance
        });
      }
      newColorMap.push(row);
    }

    return newColorMap;
  }, [memoizedRenderInfo, gridSize]);

  const calculateCropRect = ({
  sourceWidth,
  sourceHeight,
  targetWidth,
  targetHeight,
  hotspot
}: CropDimensions): CropRect => {
  const aspect = targetWidth / targetHeight;
  const sourceAspect = sourceWidth / sourceHeight;

  let width, height, x, y;

  if (aspect > sourceAspect) {
    width = sourceWidth;
    height = sourceWidth / aspect;
    x = 0;
    y = (sourceHeight - height) * (hotspot?.y ?? 0.5);
  } else {
    height = sourceHeight;
    width = sourceHeight * aspect;
    x = (sourceWidth - width) * (hotspot?.x ?? 0.5);
    y = 0;
  }

  return { x, y, width, height };
};

  useEffect(() => {
    let mounted = true;

    if (!imageUrl) {
      setColorMap([]);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      if (!mounted) return;
      const newMap = processImage(img);
      if (newMap) {
        setColorMap(newMap);
      }
    };

    img.onerror = () => {
      console.error('Failed to load image:', imageUrl);
      if (mounted) {
        setColorMap([]);
      }
    };

    img.src = imageUrl;

    return () => {
      mounted = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl, processImage]);

  return colorMap;
};