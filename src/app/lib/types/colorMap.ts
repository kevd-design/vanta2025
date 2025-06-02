import type { ImageMetadata } from './image';

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

export interface ColorMapData {
  map: ColorMap;
  metadata?: ImageMetadata;
}