import { FC } from 'react'
import { OVERLAY_CONFIG } from './constants'
import type { ColorMapOverlayProps } from './types'

export const ColorMapOverlay: FC<ColorMapOverlayProps> = ({ colorMap, show, className = '' }) => {
  if (!show) return null

  return (
    <div className={`absolute inset-0 z-${OVERLAY_CONFIG.zIndex.colorMap} ${className}`}>
      <div 
        className="relative w-full h-full" 
        style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${OVERLAY_CONFIG.grid.columns}, 1%)`,
          gridTemplateRows: `repeat(${OVERLAY_CONFIG.grid.rows}, 1%)`,
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