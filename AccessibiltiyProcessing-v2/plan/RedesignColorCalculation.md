# Improving Color Calculation Accuracy for Elements Over Images

Based on your existing debug system and the ColorMap issue with DPR handling, here are better approaches to accurately determine the color of elements over images:

## Current Limitations in Your System

Your current approach samples colors from a grid and uses majority voting to determine text color, which has several issues:

1. **DPR Inconsistency**: As we discovered, device pixel ratio differences cause grid misalignment
2. **Uniform Grid Sampling**: May not accurately represent actual element positions
3. **Basic Luminance Calculation**: Using simple RGB luminance (0.299R + 0.587G + 0.114B) without accounting for human perception
4. **Binary Decision**: Text is either black or white, with no consideration for intermediate solutions

## Better Approaches for Color Calculation

### 1. Direct Pixel Sampling with DPR Awareness

Instead of pre-generating a color map grid, sample pixels directly from the positioned image:

```typescript
function getElementBackgroundColors(
  element: HTMLElement, 
  image: HTMLImageElement, 
  container: HTMLElement
): { color: string, luminance: number, samplePoints: [number, number][] } {
  // Get element position relative to container
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  
  // Account for DPR explicitly
  const dpr = window.devicePixelRatio || 1;
  
  // Calculate relative coordinates
  const relX = (elementRect.left - containerRect.left) / containerRect.width;
  const relY = (elementRect.top - containerRect.top) / containerRect.height;
  const relWidth = elementRect.width / containerRect.width;
  const relHeight = elementRect.height / containerRect.height;
  
  // Create temporary canvas scaled by DPR
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, image.width, image.height);
  
  // Sample multiple points within element (not just a grid)
  const samplePoints = getSamplePointsDistribution(relX, relY, relWidth, relHeight);
  
  // Get pixels at each sample point
  const colors = samplePoints.map(([x, y]) => {
    const imgX = Math.floor(x * image.width);
    const imgY = Math.floor(y * image.height);
    return ctx.getImageData(imgX, imgY, 1, 1).data;
  });
  
  // Calculate weighted average of colors
  const averageColor = calculateWeightedAverage(colors);
  
  // Use perceptual luminance instead of simple RGB formula
  const luminance = calculatePerceptualLuminance(averageColor);
  
  return {
    color: `rgb(${averageColor[0]},${averageColor[1]},${averageColor[2]})`,
    luminance,
    samplePoints
  };
}
```

### 2. Perceptual Color Contrast Algorithms

Replace the simple luminance formula with WCAG-compliant contrast calculations:

```typescript
function calculatePerceptualLuminance(rgb: [number, number, number]): number {
  // Convert RGB to linear RGB values
  const [r, g, b] = rgb.map(c => {
    const val = c / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  
  // WCAG luminance formula
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function calculateContrast(fg: number, bg: number): number {
  // Ensure foreground is lighter than background
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  
  // WCAG contrast formula
  return (lighter + 0.05) / (darker + 0.05);
}
```

### 3. Content-Aware Sampling

Instead of uniform sampling, focus on areas where text would be most affected:

```typescript
function getSamplePointsDistribution(
  relX: number, 
  relY: number, 
  relWidth: number, 
  relHeight: number
): [number, number][] {
  const points: [number, number][] = [];
  
  // More samples in the center where text typically appears
  const centerX = relX + relWidth / 2;
  const centerY = relY + relHeight / 2;
  
  // Central region samples (more dense)
  const centralRegion = 0.6; // 60% of the element area
  const centralOffsetX = relWidth * centralRegion / 2;
  const centralOffsetY = relHeight * centralRegion / 2;
  
  // Add perimeter samples
  for (let i = 0; i < 8; i++) {
    points.push([
      relX + (i / 8) * relWidth,
      relY
    ]); // Top edge
    points.push([
      relX + (i / 8) * relWidth,
      relY + relHeight
    ]); // Bottom edge
    points.push([
      relX,
      relY + (i / 8) * relHeight
    ]); // Left edge
    points.push([
      relX + relWidth,
      relY + (i / 8) * relHeight
    ]); // Right edge
  }
  
  // Add central region samples (more of them)
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 10; j++) {
      points.push([
        centerX - centralOffsetX + (i / 15) * relWidth * centralRegion,
        centerY - centralOffsetY + (j / 9) * relHeight * centralRegion
      ]);
    }
  }
  
  return points;
}
```

### 4. Machine Learning Approach

For more complex images, consider using ML to detect areas with text readability issues:

```typescript
async function analyzeImageForTextReadability(
  imageElement: HTMLImageElement, 
  elementPositions: Array<DOMRect>
): Promise<TextColorRecommendations[]> {
  // Load TensorFlow.js
  const tf = await import('@tensorflow/tfjs');
  
  // Load pre-trained model (simplfied example)
  const model = await tf.loadLayersModel('path/to/text-contrast-model/model.json');
  
  // Preprocess image
  const imgTensor = tf.browser.fromPixels(imageElement)
    .toFloat()
    .div(tf.scalar(255))
    .expandDims(0);
  
  // Run prediction
  const predictions = await model.predict(imgTensor);
  
  // Process predictions for each element position
  // (Map from model output to recommendations)
  
  return elementPositions.map(rect => {
    // Extract region for this element from predictions
    // Apply post-processing logic
    
    return {
      elementId: rect.id,
      recommendedColor: "white", // or "black" based on model output
      confidence: 0.95 // confidence score from model
    };
  });
}
```

### 5. Adaptive Text Color with Gradient or Shadow Fallbacks

When contrast is borderline, use adaptive techniques instead of binary black/white choice:

```tsx
function AdaptiveTextElement({ text, backgroundAnalysis }) {
  const { luminance, colorVariance } = backgroundAnalysis;
  
  // Standard contrast threshold is 0.5
  const primaryColor = luminance > 0.5 ? 'black' : 'white';
  
  // For borderline cases (0.4-0.6 luminance)
  const isBorderline = luminance > 0.4 && luminance < 0.6;
  
  // For high variance backgrounds (image has both dark and light areas)
  const hasHighVariance = colorVariance > 0.25;
  
  // Apply different strategies based on conditions
  let textStyle = {};
  
  if (isBorderline || hasHighVariance) {
    if (hasHighVariance) {
      // Use text shadow for complex backgrounds
      textStyle = {
        color: primaryColor,
        textShadow: primaryColor === 'white' 
          ? '0 0 5px rgba(0,0,0,0.8), 0 0 3px rgba(0,0,0,0.9)' 
          : '0 0 5px rgba(255,255,255,0.8), 0 0 3px rgba(255,255,255,0.9)'
      };
    } else {
      // Use semi-transparent background for borderline cases
      textStyle = {
        color: primaryColor,
        backgroundColor: primaryColor === 'white' 
          ? 'rgba(0,0,0,0.4)' 
          : 'rgba(255,255,255,0.4)',
        padding: '0.2em 0.5em',
        borderRadius: '3px'
      };
    }
  } else {
    // Simple case - just use the primary color
    textStyle = { color: primaryColor };
  }
  
  return <span style={textStyle}>{text}</span>;
}
```

## Implementation Strategy

To improve your current system:

1. **Create image snapshot service**: 
   - Capture the actual rendered image including DPR effects
   - Use DOM-to-image libraries for accurate representation

2. **Replace grid-based sampling with element-specific sampling**:
   - Sample pixels where text actually appears
   - Apply WCAG contrast algorithms on those specific pixels

3. **Add adaptive fallback mechanisms**:
   - For problematic images, automatically add text shadows or semi-transparent backgrounds

4. **Cache results with appropriate keys**:
   - Include DPR in cache keys
   - Invalidate cache on resize or zoom changes

5. **Enhance your debug visualization**:
   - Show actual sampling points used (not just grid cells)
   - Display calculated contrast ratio with WCAG pass/fail indicators

This approach would be more accurate than the current grid-based system, especially for responsive designs and variable DPR screens, while maintaining good performance with appropriate caching.

# Implementation Plan for Color Calculation System Refactor

I can't directly expand my own context to check all files, but based on the files you've shared previously, I can help create a step-by-step implementation plan to refactor your color calculation system according to the redesign document.

## Phase 1: Core Algorithms and Utilities (Week 1)

### Step 1: Create New Color Utility Module

```typescript
import type { RGB, ColorPoint, ColorSample } from '../types/color';

/**
 * Calculates perceptual luminance using WCAG formula
 * @param rgb RGB values (0-255)
 * @returns Luminance value between 0-1
 */
export function calculatePerceptualLuminance(rgb: [number, number, number]): number {
  // Convert RGB to linear RGB values
  const [r, g, b] = rgb.map(c => {
    const val = c / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  
  // WCAG luminance formula
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two luminance values
 */
export function calculateContrast(fg: number, bg: number): number {
  // Ensure foreground is lighter than background
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  
  // WCAG contrast formula
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculates color variance in a set of samples
 */
export function calculateColorVariance(samples: RGB[]): number {
  if (samples.length === 0) return 0;
  
  // Calculate average RGB
  const avgR = samples.reduce((sum, [r]) => sum + r, 0) / samples.length;
  const avgG = samples.reduce((sum, [, g]) => sum + g, 0) / samples.length;
  const avgB = samples.reduce((sum, [, , b]) => sum + b, 0) / samples.length;
  
  // Calculate variance (average squared distance from mean)
  const variance = samples.reduce((sum, [r, g, b]) => {
    const dr = r - avgR;
    const dg = g - avgG;
    const db = b - avgB;
    // Normalize by 255 to get variance in 0-1 range
    return sum + (dr*dr + dg*dg + db*db) / (3 * 255 * 255);
  }, 0) / samples.length;
  
  return variance;
}

/**
 * Calculate weighted average of colors
 */
export function calculateWeightedAverage(colors: Uint8ClampedArray[]): RGB {
  if (colors.length === 0) return [0, 0, 0];
  
  let totalR = 0, totalG = 0, totalB = 0;
  
  for (const color of colors) {
    totalR += color[0];
    totalG += color[1];
    totalB += color[2];
  }
  
  return [
    Math.round(totalR / colors.length),
    Math.round(totalG / colors.length),
    Math.round(totalB / colors.length)
  ];
}

/**
 * Get optimal text color based on background luminance with fallback info
 */
export function getOptimalTextColor(luminance: number, variance: number = 0): {
  color: 'black' | 'white',
  isBorderline: boolean,
  hasHighVariance: boolean
} {
  const color = luminance > 0.5 ? 'black' : 'white';
  const isBorderline = luminance > 0.4 && luminance < 0.6;
  const hasHighVariance = variance > 0.25;
  
  return { color, isBorderline, hasHighVariance };
}
```

### Step 2: Create Types for Color System

```typescript
export type RGB = [number, number, number];

export interface ColorPoint {
  x: number;
  y: number;
}

export interface ColorSample {
  point: ColorPoint;
  rgb: RGB;
  luminance: number;
}

export interface ElementColorAnalysis {
  elementId?: string;
  avgColor: RGB;
  avgLuminance: number;
  colorVariance: number;
  samplePoints: ColorPoint[];
  recommendedTextColor: 'black' | 'white';
  isBorderline: boolean;
  hasHighVariance: boolean;
  contrastRatio: number;
}

export interface ColorMapMetadata {
  dpr: number;
  imageWidth: number;
  imageHeight: number;
  containerWidth: number;
  containerHeight: number;
  timestamp: number;
}
```

## Phase 2: Sampling Implementation (Week 2)

### Step 3: Create Direct Pixel Sampling Module

```typescript
import type { RGB, ColorPoint, ColorSample } from '../types/color';
import { calculatePerceptualLuminance } from './colorUtils';

/**
 * Generates sample points distribution for an element
 */
export function getSamplePointsDistribution(
  relX: number, 
  relY: number, 
  relWidth: number, 
  relHeight: number
): ColorPoint[] {
  const points: ColorPoint[] = [];
  
  // More samples in the center where text typically appears
  const centerX = relX + relWidth / 2;
  const centerY = relY + relHeight / 2;
  
  // Central region samples (more dense)
  const centralRegion = 0.6; // 60% of the element area
  const centralOffsetX = relWidth * centralRegion / 2;
  const centralOffsetY = relHeight * centralRegion / 2;
  
  // Add perimeter samples
  for (let i = 0; i < 8; i++) {
    points.push({
      x: relX + (i / 8) * relWidth,
      y: relY
    }); // Top edge
    points.push({
      x: relX + (i / 8) * relWidth,
      y: relY + relHeight
    }); // Bottom edge
    points.push({
      x: relX,
      y: relY + (i / 8) * relHeight
    }); // Left edge
    points.push({
      x: relX + relWidth,
      y: relY + (i / 8) * relHeight
    }); // Right edge
  }
  
  // Add central region samples (more of them)
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 10; j++) {
      points.push({
        x: centerX - centralOffsetX + (i / 15) * relWidth * centralRegion,
        y: centerY - centralOffsetY + (j / 9) * relHeight * centralRegion
      });
    }
  }
  
  return points;
}

/**
 * Samples image pixels at specific points
 */
export function sampleImagePixels(
  image: HTMLImageElement,
  samplePoints: ColorPoint[]
): ColorSample[] {
  // Create temporary canvas
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    console.error('Could not get canvas context');
    return [];
  }
  
  // Draw image to canvas
  ctx.drawImage(image, 0, 0, image.width, image.height);
  
  // Sample pixels
  return samplePoints.map(point => {
    const imgX = Math.floor(point.x * image.width);
    const imgY = Math.floor(point.y * image.height);
    
    // Clamp values to prevent out of bounds errors
    const x = Math.max(0, Math.min(imgX, image.width - 1));
    const y = Math.max(0, Math.min(imgY, image.height - 1));
    
    const data = ctx.getImageData(x, y, 1, 1).data;
    const rgb: RGB = [data[0], data[1], data[2]];
    const luminance = calculatePerceptualLuminance(rgb);
    
    return { point, rgb, luminance };
  });
}
```

## Phase 3: Refactor Main Hook (Week 3)

### Step 4: Create a New Direct Sampling Hook

```typescript
import { useState, useCallback, useEffect, useRef } from 'react';
import { type RGB, type ColorPoint, type ColorSample, type ElementColorAnalysis, type ColorMapMetadata } from '../types/color';
import { calculatePerceptualLuminance, calculateColorVariance, calculateWeightedAverage, getOptimalTextColor, calculateContrast } from '../utils/colorUtils';
import { getSamplePointsDistribution, sampleImagePixels } from '../utils/pixelSampling';

export interface DirectSamplingOptions {
  containerRef: React.RefObject<HTMLElement>;
  imageUrl: string | null;
  elements?: HTMLElement[];
  sampleDensity?: 'low' | 'medium' | 'high';
  enabled?: boolean;
}

export function useDirectImageSampling({
  containerRef,
  imageUrl,
  elements = [],
  sampleDensity = 'medium',
  enabled = true
}: DirectSamplingOptions) {
  const [elementAnalyses, setElementAnalyses] = useState<ElementColorAnalysis[]>([]);
  const [metadata, setMetadata] = useState<ColorMapMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const imgRef = useRef<HTMLImageElement | null>(null);
  const cacheRef = useRef<Map<string, ElementColorAnalysis>>(new Map());
  
  // Function to analyze a single element
  const analyzeElement = useCallback((
    element: HTMLElement,
    image: HTMLImageElement,
    container: HTMLElement
  ): ElementColorAnalysis => {
    // Get element position relative to container
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Account for DPR explicitly
    const dpr = window.devicePixelRatio || 1;
    
    // Calculate relative coordinates
    const relX = (elementRect.left - containerRect.left) / containerRect.width;
    const relY = (elementRect.top - containerRect.top) / containerRect.height;
    const relWidth = elementRect.width / containerRect.width;
    const relHeight = elementRect.height / containerRect.height;
    
    // Get sampling points
    const samplePoints = getSamplePointsDistribution(relX, relY, relWidth, relHeight);
    
    // Sample image at these points
    const samples = sampleImagePixels(image, samplePoints);
    
    // Extract RGB values
    const rgbValues = samples.map(sample => sample.rgb);
    
    // Calculate average color
    const avgColor = calculateWeightedAverage(
      rgbValues.map(rgb => new Uint8ClampedArray([rgb[0], rgb[1], rgb[2], 255]))
    );
    
    // Calculate variance
    const colorVariance = calculateColorVariance(rgbValues);
    
    // Calculate luminance
    const avgLuminance = calculatePerceptualLuminance(avgColor);
    
    // Get text color recommendation
    const { color: recommendedTextColor, isBorderline, hasHighVariance } = 
      getOptimalTextColor(avgLuminance, colorVariance);
    
    // Calculate contrast with both white and black
    const blackContrast = calculateContrast(0, avgLuminance);
    const whiteContrast = calculateContrast(1, avgLuminance);
    const contrastRatio = Math.max(blackContrast, whiteContrast);
    
    return {
      elementId: element.id || undefined,
      avgColor,
      avgLuminance,
      colorVariance,
      samplePoints: samples.map(s => s.point),
      recommendedTextColor,
      isBorderline,
      hasHighVariance,
      contrastRatio
    };
  }, []);
  
  // Load image and analyze elements
  useEffect(() => {
    if (!enabled || !imageUrl || !containerRef.current || elements.length === 0) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    // Remove any DPR parameter to get the original image
    let normalizedUrl = imageUrl;
    if (normalizedUrl.includes('dpr=')) {
      normalizedUrl = normalizedUrl.replace(/dpr=\d+(\.\d+)?/, 'dpr=1');
    }
    
    img.onload = () => {
      try {
        const container = containerRef.current;
        if (!container) return;
        
        // Store reference to image
        imgRef.current = img;
        
        // Create metadata
        const dpr = window.devicePixelRatio || 1;
        const newMetadata: ColorMapMetadata = {
          dpr,
          imageWidth: img.width,
          imageHeight: img.height,
          containerWidth: container.offsetWidth,
          containerHeight: container.offsetHeight,
          timestamp: Date.now()
        };
        setMetadata(newMetadata);
        
        // Analyze each element
        const analyses = elements.map(element => {
          // Generate cache key
          const cacheKey = `${element.id || ''}_${img.width}_${img.height}_${dpr}`;
          
          // Check cache first
          if (cacheRef.current.has(cacheKey)) {
            return cacheRef.current.get(cacheKey)!;
          }
          
          // Analyze element
          const analysis = analyzeElement(element, img, container);
          
          // Cache result
          cacheRef.current.set(cacheKey, analysis);
          
          return analysis;
        });
        
        setElementAnalyses(analyses);
      } catch (err) {
        console.error('Error analyzing image:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };
    
    img.onerror = () => {
      setError(new Error(`Failed to load image: ${normalizedUrl}`));
      setIsLoading(false);
    };
    
    img.src = normalizedUrl;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl, containerRef, elements, enabled, analyzeElement]);
  
  return {
    elementAnalyses,
    metadata,
    isLoading,
    error
  };
}
```

## Phase 4: Create UI Components (Week 4)

### Step 5: Implement Adaptive Text Component

```tsx
import React from 'react';
import { type ElementColorAnalysis } from '../types/color';

interface AdaptiveTextProps {
  children: React.ReactNode;
  colorAnalysis: ElementColorAnalysis | null;
  fallbackColor?: 'black' | 'white' | 'auto';
  className?: string;
  enableTextShadow?: boolean;
  enableBackgroundFallback?: boolean;
}

export const AdaptiveText: React.FC<AdaptiveTextProps> = ({
  children,
  colorAnalysis,
  fallbackColor = 'auto',
  className = '',
  enableTextShadow = true,
  enableBackgroundFallback = true
}) => {
  // Default text color logic using fallback
  let textColor = 'inherit';
  if (fallbackColor === 'black') textColor = 'black';
  if (fallbackColor === 'white') textColor = 'white';
  
  // Use style based on analysis if available
  let textStyle: React.CSSProperties = { color: textColor };
  
  if (colorAnalysis) {
    const { 
      recommendedTextColor, 
      isBorderline, 
      hasHighVariance 
    } = colorAnalysis;
    
    // Base color from analysis
    textColor = recommendedTextColor;
    textStyle = { color: textColor };
    
    // Apply advanced styling based on analysis
    if ((isBorderline || hasHighVariance) && (enableTextShadow || enableBackgroundFallback)) {
      if (hasHighVariance && enableTextShadow) {
        // Use text shadow for complex backgrounds
        textStyle = {
          color: textColor,
          textShadow: textColor === 'white' 
            ? '0 0 5px rgba(0,0,0,0.8), 0 0 3px rgba(0,0,0,0.9)' 
            : '0 0 5px rgba(255,255,255,0.8), 0 0 3px rgba(255,255,255,0.9)'
        };
      } else if (isBorderline && enableBackgroundFallback) {
        // Use semi-transparent background for borderline cases
        textStyle = {
          color: textColor,
          backgroundColor: textColor === 'white' 
            ? 'rgba(0,0,0,0.4)' 
            : 'rgba(255,255,255,0.4)',
          padding: '0.2em 0.5em',
          borderRadius: '3px',
          boxDecorationBreak: 'clone', // For multi-line text
          WebkitBoxDecorationBreak: 'clone'
        };
      }
    }
  }
  
  return (
    <span className={className} style={textStyle}>
      {children}
    </span>
  );
};
```

### Step 6: Update Debug Visualization

```tsx
import React from 'react';
import { type ElementColorAnalysis } from '../../../types/color';

interface ColorSamplingsDebugProps {
  elementAnalyses: ElementColorAnalysis[];
  containerWidth: number;
  containerHeight: number;
  dpr: number;
  showSamplePoints?: boolean;
  showColors?: boolean;
  showContrast?: boolean;
}

export const ColorSamplingsDebug: React.FC<ColorSamplingsDebugProps> = ({
  elementAnalyses,
  containerWidth,
  containerHeight,
  dpr,
  showSamplePoints = true,
  showColors = true,
  showContrast = true
}) => {
  return (
    <div 
      className="relative overflow-hidden" 
      style={{ 
        width: containerWidth,
        height: containerHeight,
        transform: `scale(${1/dpr})`,
        transformOrigin: 'top left'
      }}
    >
      {/* Element outlines */}
      {elementAnalyses.map((analysis, index) => (
        <div
          key={`element-${analysis.elementId || index}`}
          className="absolute border-2 border-blue-500 pointer-events-none"
          style={{
            left: analysis.samplePoints[0]?.x * containerWidth,
            top: analysis.samplePoints[0]?.y * containerHeight,
            width: (analysis.samplePoints[analysis.samplePoints.length - 1]?.x - analysis.samplePoints[0]?.x) * containerWidth,
            height: (analysis.samplePoints[analysis.samplePoints.length - 1]?.y - analysis.samplePoints[0]?.y) * containerHeight
          }}
        >
          {/* Element info */}
          <div className="absolute top-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 rounded-bl">
            {analysis.elementId || `Element ${index}`}
          </div>
          
          {/* Color recommendation */}
          {showColors && (
            <div 
              className="absolute bottom-0 left-0 text-xs p-1 rounded-tr"
              style={{ 
                backgroundColor: analysis.recommendedTextColor === 'white' ? '#000' : '#fff',
                color: analysis.recommendedTextColor 
              }}
            >
              {analysis.recommendedTextColor}
              {analysis.isBorderline && ' (borderline)'}
              {analysis.hasHighVariance && ' (high variance)'}
            </div>
          )}
          
          {/* Contrast ratio */}
          {showContrast && (
            <div 
              className={`absolute bottom-0 right-0 text-xs p-1 rounded-tl ${
                analysis.contrastRatio >= 4.5 ? 'bg-green-500' : (
                  analysis.contrastRatio >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                )
              } text-black`}
            >
              {analysis.contrastRatio.toFixed(1)}:1
            </div>
          )}
        </div>
      ))}
      
      {/* Sample points */}
      {showSamplePoints && elementAnalyses.map((analysis, elIndex) => 
        analysis.samplePoints.map((point, i) => (
          <div
            key={`point-${elIndex}-${i}`}
            className="absolute w-1 h-1 rounded-full bg-yellow-500"
            style={{
              left: point.x * containerWidth,
              top: point.y * containerHeight,
              opacity: 0.5
            }}
          />
        ))
      )}
    </div>
  );
};
```

## Phase 5: Integration (Week 5)

### Step 7: Update AccessibilityDebug Component

```tsx
import React from 'react';
import { ColorSamplingsDebug } from './ColorSamplingsDebug';
import { type ElementColorAnalysis, type ColorMapMetadata } from '../../../types/color';

interface AccessibilityDebugProps {
  colorMap: Array<Array<{ r: number, g: number, b: number, luminance: number }>>;
  elementMap: Array<Array<{ id: string, element: HTMLElement } | null>>;
  elementAnalyses: ElementColorAnalysis[]; // New prop for direct sampling analyses
  colorMapMetadata: ColorMapMetadata | null; // Updated metadata
  viewportInfo: {
    scrollX: number;
    scrollY: number;
    width: number;
    height: number;
    zoomLevel: number; // This is DPR
  } | null;
  dimensions: {
    width: number;
    height: number;
  };
  showColorMap?: boolean;
  showElementMap?: boolean;
  showDirectSampling?: boolean; // New toggle for direct sampling visualization
}

export const AccessibilityDebug: React.FC<AccessibilityDebugProps> = ({
  colorMap,
  elementMap,
  elementAnalyses,
  colorMapMetadata,
  viewportInfo,
  dimensions,
  showColorMap = true,
  showElementMap = true,
  showDirectSampling = true
}) => {
  const dpr = viewportInfo?.zoomLevel || window.devicePixelRatio || 1;
  
  // Calculate visualization dimensions
  const visWidth = dimensions.width;
  const visHeight = dimensions.height;
  
  // Calculate cell dimensions for grid visualizations
  const cellWidth = colorMap[0]?.length ? visWidth / colorMap[0].length : 0;
  const cellHeight = colorMap.length ? visHeight / colorMap.length : 0;
  
  return (
    <div className="relative w-full h-full overflow-auto bg-gray-900">
      <div className="sticky top-0 left-0 z-10 bg-black bg-opacity-75 text-white p-2 text-sm">
        <div>DPR: {dpr.toFixed(2)}</div>
        <div>
          Dimensions: {dimensions.width}x{dimensions.height}
        </div>
        {colorMapMetadata && (
          <div>
            Image: {colorMapMetadata.imageWidth}x{colorMapMetadata.imageHeight}
          </div>
        )}
      </div>
      
      <div className="relative" style={{ width: visWidth, height: visHeight }}>
        {/* Original grid-based color map visualization */}
        {showColorMap && (
          <div 
            className="absolute inset-0"
            style={{
              transform: `scale(${1/dpr})`,
              transformOrigin: 'top left',
              width: `${visWidth * dpr}px`,
              height: `${visHeight * dpr}px`
            }}
          >
            {colorMap.map((row, y) => 
              row.map(({ r, g, b, luminance }, x) => (
                <div 
                  key={`color-${x}-${y}`}
                  style={{
                    position: 'absolute',
                    left: x * cellWidth * dpr,
                    top: y * cellHeight * dpr,
                    width: cellWidth * dpr,
                    height: cellHeight * dpr,
                    backgroundColor: `rgb(${r}, ${g}, ${b})`,
                    opacity: 0.5
                  }}
                  title={`${x},${y} - RGB(${r},${g},${b}) - Luminance: ${luminance.toFixed(2)}`}
                />
              ))
            )}
          </div>
        )}
        
        {/* Original grid-based element map visualization */}
        {showElementMap && (
          <div 
            className="absolute inset-0"
            style={{
              transform: `scale(${1/dpr})`,
              transformOrigin: 'top left',
              width: `${visWidth * dpr}px`,
              height: `${visHeight * dpr}px`,
              pointerEvents: 'none'
            }}
          >
            {elementMap.map((row, y) => 
              row.map((cell, x) => cell && (
                <div 
                  key={`element-${x}-${y}`}
                  style={{
                    position: 'absolute',
                    left: x * cellWidth * dpr,
                    top: y * cellHeight * dpr,
                    width: cellWidth * dpr,
                    height: cellHeight * dpr,
                    border: '1px dashed white',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                  }}
                  title={`${x},${y} - Element: ${cell.id}`}
                />
              ))
            )}
          </div>
        )}
        
        {/* New direct sampling visualization */}
        {showDirectSampling && (
          <ColorSamplingsDebug
            elementAnalyses={elementAnalyses}
            containerWidth={visWidth}
            containerHeight={visHeight}
            dpr={dpr}
            showSamplePoints={true}
            showColors={true}
            showContrast={true}
          />
        )}
      </div>
    </div>
  );
};
```

### Step 8: Update useDebugObserver to Include Direct Sampling

```typescript
import { useRef, useEffect } from 'react';
import { useImageColorMap } from './useImageColorMap';
import { useElementMap } from './useElementMap';
import { useDirectImageSampling } from './useDirectImageSampling'; // New import

export const useDebugObserver = ({
  containerRef,
  imageUrl,
  isActive = false
}) => {
  // ...existing code...
  
  // Add direct sampling hook
  const { 
    elementAnalyses, 
    metadata: directSamplingMetadata, 
    isLoading: directSamplingLoading 
  } = useDirectImageSampling({
    containerRef,
    imageUrl,
    elements: allElements, // Use same elements as before
    enabled: isActive,
    sampleDensity: 'medium'
  });
  
  // Update data passing to debug window
  useEffect(() => {
    // ...existing code...
    
    dataRef.current = {
      colorMap,
      elementMap,
      elementAnalyses, // Add new direct sampling analyses
      colorMapMetadata: {
        dpr: window.devicePixelRatio || 1,
        imageWidth: dimensions?.width || 0,
        imageHeight: dimensions?.height || 0,
        containerWidth: containerRef.current?.offsetWidth || 0,
        containerHeight: containerRef.current?.offsetHeight || 0,
        timestamp: Date.now()
      },
      viewportInfo: {
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        width: window.innerWidth,
        height: window.innerHeight,
        zoomLevel: window.devicePixelRatio || 1
      },
      dimensions: {
        width: containerRef.current?.offsetWidth || 0,
        height: containerRef.current?.offsetHeight || 0
      }
    };
    
    // Update debug window with new data
    // ...existing code...
  }, [
    // ...existing dependencies...,
    elementAnalyses,
    directSamplingMetadata
  ]);
  
  // ...rest of the hook...
};
```

## Phase 6: Update Consumer Components (Week 6)

### Step 9: Create a Text Overlay Component Using Direct Sampling

```tsx
import React, { useRef, useEffect, useState } from 'react';
import { useDirectImageSampling } from '../hooks/useDirectImageSampling';
import { AdaptiveText } from './AdaptiveText';

interface ImageWithTextProps {
  imageUrl: string;
  title?: string;
  subtitle?: string;
  description?: string;
  alt?: string;
  className?: string;
}

export const ImageWithText: React.FC<ImageWithTextProps> = ({
  imageUrl,
  title,
  subtitle,
  description,
  alt = '',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  
  const [elements, setElements] = useState<HTMLElement[]>([]);
  
  // Collect elements for analysis
  useEffect(() => {
    const elementsToAnalyze: HTMLElement[] = [];
    if (titleRef.current) elementsToAnalyze.push(titleRef.current);
    if (subtitleRef.current) elementsToAnalyze.push(subtitleRef.current);
    if (descriptionRef.current) elementsToAnalyze.push(descriptionRef.current);
    setElements(elementsToAnalyze);
  }, []);
  
  // Use direct sampling for text color analysis
  const { elementAnalyses } = useDirectImageSampling({
    containerRef,
    imageUrl,
    elements,
    enabled: elements.length > 0,
    sampleDensity: 'medium'
  });
  
  // Find color analyses for each element
  const titleAnalysis = elementAnalyses.find(e => e.elementId === titleRef.current?.id);
  const subtitleAnalysis = elementAnalyses.find(e => e.elementId === subtitleRef.current?.id);
  const descriptionAnalysis = elementAnalyses.find(e => e.elementId === descriptionRef.current?.id);
  
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <img 
        src={imageUrl} 
        alt={alt} 
        className="w-full h-full object-cover"
        loading="lazy"
      />
      
      <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
        {title && (
          <h2 
            ref={titleRef}
            id="image-title"
            className="text-2xl md:text-3xl font-bold mb-2"
          >
            <AdaptiveText 
              colorAnalysis={titleAnalysis}
              fallbackColor="white"
              enableTextShadow={true}
            >
              {title}
            </AdaptiveText>
          </h2>
        )}
        
        {subtitle && (
          <h3
            ref={subtitleRef}
            id="image-subtitle"
            className="text-xl md:text-2xl mb-2"
          >
            <AdaptiveText
              colorAnalysis={subtitleAnalysis}
              fallbackColor="white"
              enableBackgroundFallback={true}
            >
              {subtitle}
            </AdaptiveText>
          </h3>
        )}
        
        {description && (
          <p
            ref={descriptionRef}
            id="image-description"
            className="text-base md:text-lg max-w-prose"
          >
            <AdaptiveText
              colorAnalysis={descriptionAnalysis}
              fallbackColor="white"
            >
              {description}
            </AdaptiveText>
          </p>
        )}
      </div>
    </div>
  );
};
```

## Phase 7: Testing & Optimization (Week 7)

### Step 10: Create Testing Utility for Color Calculations

```typescript
import { 
  calculatePerceptualLuminance,
  calculateContrast,
  calculateColorVariance,
  calculateWeightedAverage,
  getOptimalTextColor
} from '../colorUtils';

describe('Color Utility Functions', () => {
  test('calculatePerceptualLuminance returns correct values', () => {
    // Pure black
    expect(calculatePerceptualLuminance([0, 0, 0])).toBeCloseTo(0);
    
    // Pure white
    expect(calculatePerceptualLuminance([255, 255, 255])).toBeCloseTo(1);
    
    // Mid gray
    expect(calculatePerceptualLuminance([127, 127, 127])).toBeCloseTo(0.2158, 2);
    
    // Pure red
    expect(calculatePerceptualLuminance([255, 0, 0])).toBeCloseTo(0.2126, 2);
    
    // Pure green
    expect(calculatePerceptualLuminance([0, 255, 0])).toBeCloseTo(0.7152, 2);
    
    // Pure blue
    expect(calculatePerceptualLuminance([0, 0, 255])).toBeCloseTo(0.0722, 2);
  });

  test('calculateContrast follows WCAG formula', () => {
    // Black text on white background
    expect(calculateContrast(0, 1)).toBeCloseTo(21, 0);
    
    // White text on black background
    expect(calculateContrast(1, 0)).toBeCloseTo(21, 0);
    
    // Mid gray on white
    expect(calculateContrast(0.5, 1)).toBeCloseTo(1.83, 2);
  });
  
  // More tests...
});
```

### Step 11: Performance Optimizations

```typescript
// Add to the existing hook:

// Add resize observer to update on resize
useEffect(() => {
  if (!containerRef.current || !enabled) return;
  
  const container = containerRef.current;
  
  // Create resize observer
  const resizeObserver = new ResizeObserver(() => {
    // Invalidate cache when container resizes
    cacheRef.current.clear();
    
    // Only trigger reanalysis if we already have an image
    if (imgRef.current && elements.length > 0) {
      const newAnalyses = elements.map(element => 
        analyzeElement(element, imgRef.current!, container)
      );
      setElementAnalyses(newAnalyses);
    }
  });
  
  // Start observing
  resizeObserver.observe(container);
  
  return () => {
    resizeObserver.disconnect();
  };
}, [containerRef, elements, enabled, analyzeElement]);

// Add throttling for heavy operations
const throttledAnalyzeElement = useCallback(
  throttle(analyzeElement, 100),
  [analyzeElement]
);

// Helper function to throttle calls
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      inThrottle = true;
      func(...args);
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
```

## Final Implementation Notes

1. **DPR Handling**:
   - Ensure all calculations account for DPR
   - Pass DPR information throughout the system
   - Scale visualizations appropriately

2. **Caching**:
   - Include DPR in cache keys
   - Invalidate cache on window resize or DPR changes
   - Consider using sessionStorage for larger datasets

3. **Fallback Mechanisms**:
   - Default to conservative values when analysis fails
   - Include visual indicators when contrast requirements aren't met

4. **Testing**:
   - Test across multiple devices and DPRs
   - Create visual regression tests
   - Verify WCAG compliance with automated tools

5. **Documentation**:
   - Document the new APIs
   - Create examples for the engineering team
   - Update design system guidelines

This comprehensive plan provides a phased approach to implementing the improved color calculation system, focusing on accurate pixel sampling, proper DPR handling, and adaptive text rendering to ensure optimal readability across all devices.