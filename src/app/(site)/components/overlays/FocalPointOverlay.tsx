import { FC } from 'react'

interface FocalPointOverlayProps {
  show: boolean
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

export const FocalPointOverlay: FC<FocalPointOverlayProps> = ({
  show,
  hotspot,
  renderInfo
}) => {
  if (!show || !hotspot) return null

  const x = hotspot.x * renderInfo.width
  const y = hotspot.y * renderInfo.height

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Focal point indicator */}
      <div 
        className="absolute w-3 h-3 bg-red-500 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${x}px`,
          top: `${y}px`
        }}
      />
      
      {/* Hotspot area indicator (if width/height provided) */}
    {hotspot.width && hotspot.height && (
      <div 
        className="absolute border-2 border-red-500/50 z-40"
        style={{
          left: `${(hotspot.x - hotspot.width/2) * renderInfo.width}px`,
          top: `${(hotspot.y - hotspot.height/2) * renderInfo.height}px`,
          width: `${hotspot.width * renderInfo.width}px`,
          height: `${hotspot.height * renderInfo.height}px`
        }}
      />
    )}

    </div>
  )
}