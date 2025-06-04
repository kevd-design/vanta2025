/**
 * Types for accessibility and visual debugging
 */

// Base debug info interface with common fields
export interface DebugInfo {
  hasColorMap?: boolean;
  hasElementMap?: boolean;
  elementColors?: Record<string, {
    color: string;
    background?: boolean;
  }>;
}

// Element-specific debug info
export interface ElementDebugInfo extends DebugInfo {
  totalCells: number;
  blackVotes: number;
  whiteVotes: number;
  consensusPercentage: number;
  contrastRatio?: number;
  varianceScore?: number;
  dpr?: number;
}

// Color mapping debug info
export interface ColorDebugInfo extends DebugInfo {
  sampleSize?: { width: number, height: number };
  colorCount?: number;
  luminanceRange?: { min: number, max: number, average: number };
  highestContrast?: { color: string, ratio: number };
  dpr?: number;
  samplingMethod?: string;
}

// Performance metrics debug info
export interface PerformanceDebugInfo extends DebugInfo {
  renderTime?: number;
  colorMapGenerationTime?: number;
  totalOperations?: number;
}

// Accessibility test debug info
export interface AccessibilityDebugInfo extends DebugInfo {
  wcagCompliant: boolean;
  needsBackground: boolean;
  contrastRatio?: number;
  backgroundRecommendation?: {
    reason: 'low-contrast' | 'high-variance' | 'low-consensus';
    details?: string;
  };
}