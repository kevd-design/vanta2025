import { useState, useEffect } from 'react';
import type { ColorMap } from '../../types/colorMap';
import type { ElementMap } from '../../types/elementMap';

// Enhanced options type with additional parameters
interface AccessibilityOptions {
  consensusThreshold: number;  // Percentage agreement needed for consensus
  contrastThreshold: number;   // WCAG minimum contrast ratio
  wcagLevel?: 'AA' | 'AAA';    // WCAG compliance level
  enableVarianceDetection?: boolean; // Whether to detect high-variance regions
}

type AccessibilityResult = {
  elementColors: {
    [key: string]: {
      color: 'text-black' | 'text-white' | 'background';
      wcagCompliant?: boolean; // Whether chosen color meets WCAG standards
      needsBackground?: boolean; // Whether a background is recommended
      debugInfo: {
        totalCells: number;
        blackVotes: number;
        whiteVotes: number;
        consensusPercentage: number;
        contrastRatio?: number; // Average contrast ratio
        varianceScore?: number; // How varied the background is
        dpr?: number;          // Device pixel ratio used for calculation
      };
    };
  };
};

export const useAccessibilityMap = (
  colorMap: ColorMap,
  elementMap: ElementMap,
  options: AccessibilityOptions = {
    consensusThreshold: 0.95, // 95% agreement needed
    contrastThreshold: 4.5,   // WCAG AA standard for normal text
    wcagLevel: 'AA',
    enableVarianceDetection: true
  }
): AccessibilityResult => {
  const [result, setResult] = useState<AccessibilityResult>({
    elementColors: {}
  });

  // Get current DPR for debugging information
  const [dpr, setDpr] = useState(() => typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);

  // Monitor DPR changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia(`(resolution: ${dpr}dppx)`);
    
    const handleChange = () => {
      const newDpr = window.devicePixelRatio || 1;
      setDpr(newDpr);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [dpr]);

  useEffect(() => {
    // Validate input data before processing
    if (!colorMap?.length || !elementMap?.length) {
      console.debug('Skipping accessibility analysis - missing data', {
        hasColorMap: !!colorMap?.length,
        hasElementMap: !!elementMap?.length
      });
      return;
    }

    try {
      // Enhanced vote tracking to include contrast and variance information
      const elementVotes: {
        [key: string]: {
          black: number;
          white: number;
          total: number;
          contrastSumBlack: number;
          contrastSumWhite: number;
          luminanceValues: number[];  // Store all luminance values for variance calculation
        }
      } = {};

      // Analyze each cell in the element map
      elementMap.forEach((row, y) => {
        row.forEach((cell, x) => {
          // Skip if element is not valid
          if (!cell?.isElement || !cell?.elementLabel) return;
          
          // Initialize element tracking if needed
          if (!elementVotes[cell.elementLabel]) {
            elementVotes[cell.elementLabel] = {
              black: 0,
              white: 0,
              total: 0,
              contrastSumBlack: 0,
              contrastSumWhite: 0,
              luminanceValues: []
            };
          }

          // Get corresponding color cell - with safety checks
          const colorCell = colorMap[y]?.[x];
          
          // Skip if color cell is missing or invalid
          if (!colorCell || typeof colorCell.luminance !== 'number') return;
          
          const votes = elementVotes[cell.elementLabel];
          votes.total++;
          
          // Store luminance value for variance calculation
          votes.luminanceValues.push(colorCell.luminance);
          
          // Check if we have contrast values directly from colorMap
          if (colorCell.contrastWithBlack !== undefined && colorCell.contrastWithWhite !== undefined) {
            // Use pre-calculated contrast values
            votes.contrastSumBlack += colorCell.contrastWithBlack;
            votes.contrastSumWhite += colorCell.contrastWithWhite;
            
            // Vote based on WCAG compliance if possible
            if (colorCell.wcagAACompliant?.withBlackText) {
              votes.black++;
            } else if (colorCell.wcagAACompliant?.withWhiteText) {
              votes.white++;
            } else {
              // Fall back to luminance-based decision if neither meets WCAG
              votes.black += colorCell.luminance > 0.5 ? 1 : 0;
              votes.white += colorCell.luminance <= 0.5 ? 1 : 0;
            }
          } else {
            // Calculate contrast on the fly if not available
            const contrastWithBlack = (colorCell.luminance + 0.05) / 0.05;
            const contrastWithWhite = 1.05 / (colorCell.luminance + 0.05);
            
            votes.contrastSumBlack += contrastWithBlack;
            votes.contrastSumWhite += contrastWithWhite;
            
            // Vote based on WCAG thresholds
            const wcagThreshold = options.wcagLevel === 'AAA' ? 7.0 : 4.5;
            
            if (contrastWithBlack >= wcagThreshold) {
              votes.black++;
            } else if (contrastWithWhite >= wcagThreshold) {
              votes.white++;
            } else {
              // Fall back to luminance if neither meets WCAG
              votes.black += colorCell.luminance > 0.5 ? 1 : 0;
              votes.white += colorCell.luminance <= 0.5 ? 1 : 0;
            }
          }
        });
      });

      // Calculate results for each element with enhanced metrics
      const newResults: AccessibilityResult = {
        elementColors: {}
      };

      Object.entries(elementVotes).forEach(([label, votes]) => {
        // Skip if no votes were registered
        if (votes.total === 0) return;
        
        const blackConsensus = votes.black / votes.total;
        const whiteConsensus = votes.white / votes.total;
        const bestConsensus = Math.max(blackConsensus, whiteConsensus);
        
        // Calculate average contrast ratios
        const avgContrastBlack = votes.contrastSumBlack / votes.total;
        const avgContrastWhite = votes.contrastSumWhite / votes.total;
        
        // Determine best color based on consensus and contrast
        const preferBlack = blackConsensus > whiteConsensus;
        const selectedColor = bestConsensus >= options.consensusThreshold 
          ? (preferBlack ? 'text-black' : 'text-white') 
          : 'background';
        
        // Calculate variance for background decision
        let varianceScore = 0;
        if (options.enableVarianceDetection && votes.luminanceValues.length > 1) {
          const avgLuminance = votes.luminanceValues.reduce((sum, val) => sum + val, 0) / votes.luminanceValues.length;
          const sumSquaredDiff = votes.luminanceValues.reduce((sum, val) => sum + Math.pow(val - avgLuminance, 2), 0);
          varianceScore = Math.sqrt(sumSquaredDiff / votes.luminanceValues.length);
        }
        
        // Check if selected color meets WCAG requirements
        const bestContrast = preferBlack ? avgContrastBlack : avgContrastWhite;
        const wcagThreshold = options.wcagLevel === 'AAA' ? 7.0 : 4.5;
        const isWcagCompliant = bestContrast >= wcagThreshold;
        
        // Determine if a background is needed (low consensus or high variance)
        const needsBackground = 
          selectedColor === 'background' || // Low consensus already triggers background
          (varianceScore > 0.2) || // High variance regions need background
          (!isWcagCompliant); // Non-compliant contrast needs background
        
        newResults.elementColors[label] = {
          color: selectedColor,
          wcagCompliant: isWcagCompliant,
          needsBackground: needsBackground,
          debugInfo: {
            totalCells: votes.total,
            blackVotes: votes.black,
            whiteVotes: votes.white,
            consensusPercentage: bestConsensus,
            contrastRatio: preferBlack ? avgContrastBlack : avgContrastWhite,
            varianceScore: varianceScore,
            dpr: dpr
          }
        };
      });

      setResult(newResults);
      
      // Log meaningful debug output
      console.debug('Accessibility analysis complete', {
        elements: Object.keys(newResults.elementColors).length,
        dpr: dpr,
        contrastThreshold: options.contrastThreshold,
        consensusThreshold: options.consensusThreshold,
        wcagLevel: options.wcagLevel
      });
    } catch (error) {
      console.error('Error in useAccessibilityMap:', error);
      // Maintain previous result on error
    }
  }, [colorMap, elementMap, options.consensusThreshold, options.contrastThreshold, options.wcagLevel, options.enableVarianceDetection, dpr]);

  return result;
};