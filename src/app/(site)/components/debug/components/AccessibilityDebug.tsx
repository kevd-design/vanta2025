import { FC } from 'react'
import type { ColorMap } from '../../../../types/colorMap'
import type { ElementMapCell } from '../../../../types'

interface AccessibilityDebugProps {
  colorMap: ColorMap
  elementMap: ElementMapCell[][]
  dimensions: {
    width: number
    height: number
  }
  screenDimensions: {
    width: number
    height: number
  }
  accessibilityResults: {
    elementColors: {
      [key: string]: {
        color: 'text-black' | 'text-white' | 'background'
        debugInfo: {
          totalCells: number
          blackVotes: number
          whiteVotes: number
          consensusPercentage: number
        }
      }
    }
  }
}



export const AccessibilityDebug: FC<AccessibilityDebugProps> = ({
  colorMap,
  elementMap,
  accessibilityResults,
  screenDimensions
}) => {
  // Base size for the map
  const BASE_SIZE = 300
  const PADDING = 8

  // Get grid dimensions
  const columns = colorMap[0]?.length || 1
  const rows = colorMap.length || 1

  // Calculate cell size based on BASE_SIZE
  const cellSize = (BASE_SIZE - PADDING * 2) / Math.max(columns, rows)

  // Calculate actual grid dimensions
  const gridWidth = columns * cellSize
  const gridHeight = rows * cellSize

  // Set container size to match grid
  const containerWidth = gridWidth + PADDING * 2
  const containerHeight = gridHeight + PADDING * 2

  // Calculate viewport indicator dimensions with minimum size protection
  const MIN_VIEWPORT_WIDTH = 320 // Minimum width for mobile
  
  // If screen width is below minimum, use different calculation
  const effectiveViewportWidth = Math.max(MIN_VIEWPORT_WIDTH, screenDimensions.width)
  const effectiveViewportRatio = effectiveViewportWidth / screenDimensions.height

  // Calculate viewport indicator size
  const viewportWidth = Math.min(
    gridWidth,
    Math.max(MIN_VIEWPORT_WIDTH * (cellSize / 2), gridWidth * effectiveViewportRatio)
  )
  const viewportHeight = Math.min(
    gridHeight,
    viewportWidth / effectiveViewportRatio
  )

  // Center viewport indicator in grid
  const viewportX = PADDING + (gridWidth - viewportWidth) / 2
  const viewportY = PADDING

  return (
    <div className="flex flex-col lg:flex-row gap-4 mt-20">
      {/* Color Map Preview */}
      <div 
        className="bg-gray-900/80 rounded-lg backdrop-blur-sm shrink-0 border border-gray-700 relative sticky top-20"
        style={{
          width: containerWidth,
          height: containerHeight
        }}
      >
        {/* Viewport indicator - rendered first to be behind grid */}
        <div
          className="absolute border-2 border-blue-500/50 pointer-events-none"
          style={{
            left: viewportX,
            top: viewportY,
            width: viewportWidth,
            height: viewportHeight
          }}
        />

        {/* Grid */}
        <div 
          className="absolute"
          style={{ 
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
            gap: '0px',
            left: PADDING,
            top: PADDING,
            width: gridWidth,
            height: gridHeight
          }}
        >
          {colorMap.map((row, y) => 
            row.map((cell, x) => {
              const isElement = elementMap[y]?.[x]?.isElement
              const elementLabel = elementMap[y]?.[x]?.elementLabel
              const luminance = cell.luminance
              const elementResult = elementLabel ? accessibilityResults.elementColors[elementLabel] : null
              
              return (
                <div
                  key={`${x}-${y}`}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: isElement 
                      ? elementResult?.color === 'text-black'
                        ? 'rgba(0, 100, 255, 0.6)'
                        : elementResult?.color === 'text-white'
                          ? 'rgba(255, 50, 50, 0.6)'
                          : 'rgba(255, 255, 0, 0.6)'
                      : luminance > 0.5
                        ? 'rgba(255, 255, 255, 0.3)' 
                        : 'rgba(0, 0, 0, 0.3)',
                    outline: isElement ? '1px solid rgba(255, 255, 0, 0.8)' : 'none'
                  }}
                  title={`${x},${y} - L:${luminance.toFixed(2)}${
                    elementLabel ? `\n${elementLabel} (${elementResult?.color})` : ''
                  }`}
                />
              )
            })
          )}
        </div>
      </div>

      {/* Analysis Results */}
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 text-xs text-gray-100 min-w-[200px] sticky top-20"> {/* Made results sticky too */}
        <h3 className="font-bold mb-2 text-white">Accessibility Analysis</h3>
        {Object.entries(accessibilityResults.elementColors).map(([label, result]) => (
          <div key={label} className="mb-3 last:mb-0">
            <div className="font-medium border-b border-gray-700 pb-1 text-white">{label}</div>
            <div className="pl-2 pt-1 space-y-1">
              <div className="flex gap-2">
                <span className="text-gray-400">Color:</span>
                <span className="text-gray-100">{result.color}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400">Consensus:</span>
                <span className="text-gray-100">{(result.debugInfo.consensusPercentage * 100).toFixed(1)}%</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400">Cells:</span>
                <span className="text-gray-100">{result.debugInfo.totalCells}</span>
              </div>
              <div className="flex justify-between text-[10px] pt-1 text-gray-400">
                <span>Dark: {result.debugInfo.blackVotes}</span>
                <span>Light: {result.debugInfo.whiteVotes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}