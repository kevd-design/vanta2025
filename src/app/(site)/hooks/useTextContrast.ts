import { useState, useEffect } from 'react';
import type { ColorMap, ColorMapCell } from '../../types/colorMap';

type TextContrastResult = {
  textColor: 'text-black' | 'text-white';
  averageLuminance: number;
  debugInfo: {
    centerLuminance: number;
    sampleSize: number;
    sampledCells: number;
  };
};

export const useTextContrast = (
  colorMap: ColorMap,
  options = {
    sampleArea: 0.6, // Sample 60% of center area
    threshold: 0.5   // WCAG contrast threshold
  }
): TextContrastResult => {
  const [result, setResult] = useState<TextContrastResult>({
    textColor: 'text-white',
    averageLuminance: 0,
    debugInfo: {
      centerLuminance: 0,
      sampleSize: 0,
      sampledCells: 0
    }
  });

  useEffect(() => {
    if (!colorMap.length) return;

    // Get center area cells
    const centerCells = getCenterAreaCells(colorMap, options.sampleArea);
    const avgLuminance = calculateAverageLuminance(centerCells);

    setResult({
      textColor: avgLuminance > options.threshold ? 'text-black' : 'text-white',
      averageLuminance: avgLuminance,
      debugInfo: {
        centerLuminance: avgLuminance,
        sampleSize: options.sampleArea,
        sampledCells: centerCells.length
      }
    });
  }, [colorMap, options.sampleArea, options.threshold]);

  return result;
};

// Helper functions
function getCenterAreaCells(colorMap: ColorMap, percentage: number): ColorMapCell[] {
  if (!colorMap.length || !colorMap[0].length) return [];

  const startRow = Math.floor(colorMap.length * ((1 - percentage) / 2));
  const endRow = Math.floor(colorMap.length * ((1 + percentage) / 2));
  const startCol = Math.floor(colorMap[0].length * ((1 - percentage) / 2));
  const endCol = Math.floor(colorMap[0].length * ((1 + percentage) / 2));

  const centerCells: ColorMapCell[] = [];
  
  for (let i = startRow; i < endRow; i++) {
    for (let j = startCol; j < endCol; j++) {
      if (colorMap[i] && colorMap[i][j]) {
        centerCells.push(colorMap[i][j]);
      }
    }
  }

  return centerCells;
}

function calculateAverageLuminance(cells: ColorMapCell[]): number {
  if (cells.length === 0) return 0;
  const totalLuminance = cells.reduce((sum, cell) => sum + cell.luminance, 0);
  return totalLuminance / cells.length;
}