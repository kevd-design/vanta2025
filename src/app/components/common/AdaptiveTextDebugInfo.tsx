import React from 'react';
import type { OpacityDebugStep } from '@/app/lib/utils/opacityCalculator';

interface DebugInfoProps {
  backgroundColor: string;
  foregroundColor: string;
  opacity: number;
  contrastRatio: number;
  wcagLevel: string;
  backgroundOpacity: number | "auto";
  minContrastLevel: "AA" | "AAA";
  targetContrast: number;
  accessibilityData?: {
    needsBackground?: boolean;
    wcagCompliant?: boolean;
  };
  debugSteps?: OpacityDebugStep[];
  population?: number;
}

export const AdaptiveTextDebugInfo: React.FC<DebugInfoProps> = ({
  backgroundColor,
  foregroundColor,
  opacity,
  contrastRatio,
  wcagLevel,
  backgroundOpacity,
  minContrastLevel,
  targetContrast,
  accessibilityData,
  debugSteps,
  population
}) => {
  return (
    <div className="absolute top-0 right-0 bg-black/75 text-white text-xs p-1 max-w-[250px] overflow-auto">
      <div className="font-bold">BG: {backgroundColor} @ {(opacity * 100).toFixed(0)}%</div>
      <div>FG: {foregroundColor}</div>
      <div>Contrast: {contrastRatio.toFixed(2)}:1 ({wcagLevel})</div>
      
      {backgroundOpacity === 'auto' && (
        <>
          <div className="mt-1 border-t border-white/20 pt-1 font-bold">Auto Opacity Info:</div>
          <div>Target: {minContrastLevel} ({targetContrast.toFixed(1)}:1)</div>
          <div>Accessibility needs BG: {accessibilityData?.needsBackground ? 'Yes' : 'No'}</div>
          <div>Source: {accessibilityData?.needsBackground ? 'Accessibility Map' : 'Palette'}</div>
          {debugSteps?.[0]?.directContrast !== undefined && (
            <div className="text-xs text-green-300">
              {debugSteps[0].directContrast < targetContrast ? 
                "Background needed for contrast" : 
                "Direct contrast sufficient"}
            </div>
          )}
        </>
      )}
      
      {population !== undefined && (
        <div className="mt-1">Swatch Pop: {(population * 100).toFixed(1)}%</div>
      )}
    </div>
  );
};