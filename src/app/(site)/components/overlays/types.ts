export interface ColorMapCell {
  color: string
  luminance: number
}

export interface ElementMapCell {
  isElement: boolean
  elementLabel?: string
}

export interface BaseOverlayProps {
  show: boolean
  className?: string
}

export interface ColorMapOverlayProps extends BaseOverlayProps {
  colorMap: ColorMapCell[][];
  show: boolean;
  className?: string;
}

export interface ElementMapOverlayProps extends BaseOverlayProps {
  elementMap: ElementMapCell[][]
}

export interface FocalPointOverlayProps extends BaseOverlayProps {
  hotspot?: {
    x: number
    y: number
    width?: number
    height?: number
  }
  renderInfo: {
    width: number
    height: number
  }
}

export interface ImageDebugOverlayProps extends BaseOverlayProps {
  imageUrl: string
  renderInfo: {
    width: number
    height: number
  }
  screenDimensions: {
    width: number
    height: number
  }
}

export interface DebugControlsProps {
  showColorMap: boolean
  showElementMap: boolean
  onToggleColorMap: () => void
  onToggleElementMap: () => void
}

