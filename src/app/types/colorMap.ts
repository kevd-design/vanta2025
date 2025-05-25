export type ColorMapCell = {
  position: [number, number]
  color: string
  background?: boolean
  luminance: number
};

export type ColorMap = ColorMapCell[][]; 
export type ColorGrid = ColorMap;