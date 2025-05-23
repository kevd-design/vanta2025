import { FC } from 'react'
import { OVERLAY_CONFIG } from './constants'
import type { ColorMapOverlayProps } from './types'

export const ColorMapOverlay: FC<ColorMapOverlayProps> = ({ 
  colorMap, 
  show, 
  className = '' 
}) => {
  if (!show) return null

  return (
    <div 
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        zIndex: OVERLAY_CONFIG.zIndex.colorMap
      }}
    >
      <div 
        className="w-full h-full" 
        style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${OVERLAY_CONFIG.grid.columns}, 1fr)`,
          gridTemplateRows: `repeat(${OVERLAY_CONFIG.grid.rows}, 1fr)`,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden'
        }}
      >
        {colorMap.flat().map((cell, i) => (
          <div
            key={i}
            style={{
              backgroundColor: cell.color,
              opacity: OVERLAY_CONFIG.opacity.colorMap,
              position: 'relative',
              width: '100%',
              height: '100%'
            }}
            title={`Luminance: ${cell.luminance.toFixed(2)}`}
          />
        ))}
      </div>
    </div>
  )
}