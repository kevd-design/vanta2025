// This file should contain all your color map related types

export interface ColorMapCell {
  position: [number, number];
  color: string;
  rawColor: [number, number, number];
  luminance: number;
  contrastWithBlack: number;
  contrastWithWhite: number;
  wcagAACompliant: {
    withBlackText: boolean;
    withWhiteText: boolean;
  };
}

export type ColorMap = ColorMapCell[][];

// Our custom ImageMetadata type - distinct from Sanity's ImageMetadata
export interface ImageMetadata {
  sourceUrl: string;            // Original Sanity image URL without transforms
  transformedUrl: string;       // URL with all transforms applied
  sourceWidth: number;          // Original image width
  sourceHeight: number;         // Original image height 
  renderedWidth: number;        // Width as rendered in the DOM
  renderedHeight: number;       // Height as rendered in the DOM
  cropRect?: {                  // Crop information from Sanity
    x: number;
    y: number;
    width: number;
    height: number;
  };
  dpr: number;                  // Device pixel ratio when the map was generated
}

export interface ColorMapData {
  map: ColorMap;
  metadata?: ImageMetadata;
}