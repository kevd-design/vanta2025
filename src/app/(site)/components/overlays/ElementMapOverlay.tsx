import { FC } from 'react'
import { OVERLAY_CONFIG } from './constants'
import type { ElementMapOverlayProps } from './types'

export const ElementMapOverlay: FC<ElementMapOverlayProps> = ({ 
  elementMap, 
  show, 
  className = '' 
}) => {
  if (!show) return null

  return (
    <div className={`absolute inset-0 z-${OVERLAY_CONFIG.zIndex.elementMap} ${className}`}>
      <div 
        className="relative w-full h-full border-2 border-black" 
        style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${OVERLAY_CONFIG.grid.columns}, 1%)`,
          gridTemplateRows: `repeat(${OVERLAY_CONFIG.grid.rows}, 1%)`,
        }}
      >
        {elementMap.flat().map((cell, i) => (
          <div
            key={i}
            style={{
              backgroundColor: cell.isElement 
                ? `rgba(255, 0, 0, ${OVERLAY_CONFIG.opacity.elementMap})` 
                : 'transparent',
              border: cell.isElement ? '1px solid rgba(255, 0, 0, 0.5)' : 'none'
            }}
            title={cell.elementLabel}
          />
        ))}
      </div>
    </div>
  )
}