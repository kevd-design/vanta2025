export type TextContrastResult = {
  textColor: 'text-black' | 'text-white';
  averageLuminance: number;
  debugInfo: {
    centerLuminance: number;
    sampleSize: number;
    sampledCells: number;
  };
};

/**
 * Options for text contrast analysis
 */
export interface TextContrastOptions {
  sampleArea: number;  // Percentage of center area to sample (0-1)
  threshold: number;   // WCAG contrast threshold
}

export interface ColorAccessibilityResult {
  isWCAGCompliant: boolean;
  contrastRatio: number;
  recommendedColor: string;
}