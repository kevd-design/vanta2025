import { useState, useEffect } from 'react';
import type { ColorMap } from '../../types/colorMap';
import type { ElementMap } from '../../types/elementMap';

type AccessibilityResult = {
  elementColors: {
    [key: string]: {
      color: 'text-black' | 'text-white' | 'background';
      debugInfo: {
        totalCells: number;
        blackVotes: number;
        whiteVotes: number;
        consensusPercentage: number;
      };
    };
  };
};

export const useAccessibilityMap = (
  colorMap: ColorMap,
  elementMap: ElementMap,
  options = {
    consensusThreshold: 0.95, // 95% agreement needed
    contrastThreshold: 0.5    // WCAG luminance threshold
  }
): AccessibilityResult => {
  const [result, setResult] = useState<AccessibilityResult>({
    elementColors: {}
  });

  useEffect(() => {
    if (!colorMap.length || !elementMap.length) return;

    const elementVotes: { [key: string]: { black: number; white: number; total: number } } = {};

    // Analyze each cell in the element map
    elementMap.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell.isElement && cell.elementLabel) {
          // Initialize element tracking if needed
          if (!elementVotes[cell.elementLabel]) {
            elementVotes[cell.elementLabel] = { black: 0, white: 0, total: 0 };
          }

          // Get corresponding color cell
          const colorCell = colorMap[y][x];
          elementVotes[cell.elementLabel].total++;

          // Vote based on luminance
          if (colorCell.luminance > options.contrastThreshold) {
            elementVotes[cell.elementLabel].black++;
          } else {
            elementVotes[cell.elementLabel].white++;
          }
        }
      });
    });

    // Calculate results for each element
    const newResults: AccessibilityResult = {
      elementColors: {}
    };

    Object.entries(elementVotes).forEach(([label, votes]) => {
      const blackConsensus = votes.black / votes.total;
      const whiteConsensus = votes.white / votes.total;
      const bestConsensus = Math.max(blackConsensus, whiteConsensus);

      newResults.elementColors[label] = {
        color: bestConsensus >= options.consensusThreshold
          ? (blackConsensus > whiteConsensus ? 'text-black' : 'text-white')
          : 'background',
        debugInfo: {
          totalCells: votes.total,
          blackVotes: votes.black,
          whiteVotes: votes.white,
          consensusPercentage: bestConsensus
        }
      };
    });

    setResult(newResults);
  }, [colorMap, elementMap, options.consensusThreshold, options.contrastThreshold]);

  return result;
};