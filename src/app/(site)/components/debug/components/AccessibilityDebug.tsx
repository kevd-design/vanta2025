import { FC, useState, useEffect, useRef } from 'react'
import type { ColorMap } from '../../../../types/colorMap'
import type { ElementMapCell, ViewportInfo } from '../../../../types'

// Add a scrolling prop to show indication when scrolling
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
  imageUrl?: string
  viewportInfo?: ViewportInfo
  scrollState?: 'idle' | 'scrolling' | 'completed';
}

export const AccessibilityDebug: FC<AccessibilityDebugProps> = ({
  colorMap,
  elementMap,
  dimensions,
  screenDimensions,
  accessibilityResults,
  imageUrl,
  viewportInfo,
  scrollState = 'idle'
}) => {

  const [hasValidData, setHasValidData] = useState(true)
  const prevViewportInfoRef = useRef<ViewportInfo | undefined>(undefined)
  
  // Track when the props actually update for debugging
  const propsUpdatedRef = useRef(0)
  const viewportUpdatedRef = useRef(0)
  const [viewportUpdateCount, setViewportUpdateCount] = useState(0)

  // State for toggling visualization options
  const [showBackground, setShowBackground] = useState(() => {
  // Try to get saved preference from localStorage, default to true if not found
  if (typeof window !== 'undefined') {
    const savedPref = localStorage.getItem('debug-show-background');
    return savedPref === null ? true : savedPref === 'true';
  }
  return true;
});

const [showElements, setShowElements] = useState(() => {
  if (typeof window !== 'undefined') {
    const savedPref = localStorage.getItem('debug-show-elements');
    return savedPref === null ? true : savedPref === 'true';
  }
  return true;
});

const [showColorMap, setShowColorMap] = useState(() => {
  if (typeof window !== 'undefined') {
    const savedPref = localStorage.getItem('debug-show-colormap');
    return savedPref === null ? true : savedPref === 'true';
  }
  return true;
});

useEffect(() => {
  localStorage.setItem('debug-show-background', showBackground.toString());
}, [showBackground]);

useEffect(() => {
  localStorage.setItem('debug-show-elements', showElements.toString());
}, [showElements]);

useEffect(() => {
  localStorage.setItem('debug-show-colormap', showColorMap.toString());
}, [showColorMap]);
  
  // Validate input data and detect changes
  useEffect(() => {
    const isValid = Array.isArray(colorMap) && 
                   colorMap.length > 0 && 
                   Array.isArray(elementMap) &&
                   elementMap.length > 0 &&
                   typeof dimensions === 'object' &&
                   dimensions?.width > 0 &&
                   dimensions?.height > 0
    
    // Count prop updates for debugging
    propsUpdatedRef.current += 1
    
    // Check if viewport info actually changed
    const viewportChanged = hasViewportChanged(viewportInfo, prevViewportInfoRef.current)
    if (viewportChanged) {
      viewportUpdatedRef.current += 1
      setViewportUpdateCount(count => count + 1)
      prevViewportInfoRef.current = viewportInfo
    }
    
    // Log meaningful changes to help debug
    console.log(`AccessibilityDebug data update #${propsUpdatedRef.current}`, {
      isValid,
      colorMapSize: `${colorMap?.[0]?.length || 0}×${colorMap?.length || 0}`,
      elementMapSize: `${elementMap?.[0]?.length || 0}×${elementMap?.length || 0}`,
      dimensions: dimensions ? `${dimensions.width}×${dimensions.height}` : 'missing',
      viewportChanged,
      viewportUpdates: viewportUpdatedRef.current,
      viewportInfo: viewportInfo ? {
        scroll: `${viewportInfo.scrollX},${viewportInfo.scrollY}`,
        size: `${viewportInfo.width}×${viewportInfo.height}`,
        zoom: viewportInfo.zoomLevel
      } : 'missing'
    })
                   
    setHasValidData(isValid)
  }, [colorMap, elementMap, dimensions, viewportInfo])
  
  // Helper to detect meaningful viewport changes
  const hasViewportChanged = (current?: ViewportInfo, previous?: ViewportInfo): boolean => {
    if (!current || !previous) return true
    
    // Check if scroll position changed by more than 5px
    const scrollYDiff = Math.abs((current.scrollY || 0) - (previous.scrollY || 0))
    const scrollXDiff = Math.abs((current.scrollX || 0) - (previous.scrollX || 0))
    
    // Consider it a change if scroll position changes significantly or dimensions/zoom changes
    return (
      scrollYDiff > 5 ||
      scrollXDiff > 5 ||
      current.width !== previous.width ||
      current.height !== previous.height ||
      Math.abs(current.zoomLevel - previous.zoomLevel) > 0.05
    )
  }
  
  // If data is invalid, show an error state
  if (!hasValidData) {
    return (
      <div className="flex flex-col gap-4">
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-sm text-gray-300">
          <p className="font-medium text-red-300 mb-2">Unable to render accessibility visualization</p>
          <p>Missing or invalid data. This usually happens during component resizing or updates.</p>
          <p className="mt-2 text-xs text-gray-400">The visualization will appear once valid data is available.</p>
        </div>
      </div>
    )
  }
  
  // Calculate scaling to fit visualization in available space
  const MAX_WIDTH = 600
  const scale = Math.min(1, MAX_WIDTH / dimensions.width)
  
  // Dimensions for the visualization
  const visWidth = dimensions.width * scale
  const visHeight = dimensions.height * scale
  
  // Use viewportInfo if available, otherwise fallback to screenDimensions and window.scrollY
  const currentScrollY = viewportInfo?.scrollY ?? (typeof window !== 'undefined' ? window.scrollY : 0)
  const currentScrollX = viewportInfo?.scrollX ?? (typeof window !== 'undefined' ? window.scrollX : 0)
  const currentZoomLevel = viewportInfo?.zoomLevel ?? 1
  
  // Viewport dimensions (what's currently visible in main window)
  const viewportWidth = Math.min(
    (viewportInfo?.width ?? screenDimensions.width),
    dimensions.width
  ) * scale
  
  const viewportHeight = Math.min(
    (viewportInfo?.height ?? screenDimensions.height),
    dimensions.height
  ) * scale
  
  // Group elements by their labels
  const elementGroups: Record<string, { 
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
    cells: number,
    color: string 
  }> = {}
  
  // Process element map to find element boundaries
  elementMap.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell.isElement && cell.elementLabel) {
        const label = cell.elementLabel
        const elementResult = accessibilityResults.elementColors[label]
        
        const color = elementResult?.color === 'text-black' ? 'rgba(0, 100, 255, 0.4)' :
                     elementResult?.color === 'text-white' ? 'rgba(255, 50, 50, 0.4)' :
                     'rgba(255, 255, 0, 0.4)'
        
        if (!elementGroups[label]) {
          elementGroups[label] = { 
            minX: x, 
            minY: y, 
            maxX: x, 
            maxY: y, 
            cells: 1,
            color
          }
        } else {
          const group = elementGroups[label]
          group.minX = Math.min(group.minX, x)
          group.minY = Math.min(group.minY, y)
          group.maxX = Math.max(group.maxX, x)
          group.maxY = Math.max(group.maxY, y)
          group.cells++
        }
      }
    })
  })
  
  // Calculate viewport position based on scroll position from the main window
  const viewportY = Math.min(currentScrollY * scale, visHeight - viewportHeight)
  const viewportX = Math.min(currentScrollX * scale, visWidth - viewportWidth)
  
  // Calculate cell size
  const cellWidth = visWidth / (colorMap[0]?.length || 1)
  const cellHeight = visHeight / (colorMap.length || 1)
  
  // Calculate if each element is in the viewport
  const isElementInView = (minX: number, minY: number, maxX: number, maxY: number): boolean => {
    const elementLeft = minX * cellWidth
    const elementRight = (maxX + 1) * cellWidth
    const elementTop = minY * cellHeight
    const elementBottom = (maxY + 1) * cellHeight
    
    const viewportRight = viewportX + viewportWidth
    const viewportBottom = viewportY + viewportHeight
    
    return (
      elementRight >= viewportX && 
      elementLeft <= viewportRight &&
      elementBottom >= viewportY && 
      elementTop <= viewportBottom
    )
  }
  
  // Adjust display properties based on zoom level
  const adjustForZoom = (value: number): number => {
    // When zoomed in more than 1.5x, make elements slightly smaller to see more content
    if (currentZoomLevel > 1.5) {
      return value / (currentZoomLevel * 0.2 + 0.8) // Gentle reduction
    }
    return value
  }
  
  // Add a visual indicator for scroll state
  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      <div className="flex gap-2 items-center justify-between">
        <div className="flex items-center gap-2">
          {scrollState === 'scrolling' && (
            <div className="text-xs text-blue-400 animate-pulse flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Scrolling
            </div>
          )}
          <div className="text-xs text-gray-400">
            <span className="mr-2">Updates: {viewportUpdatedRef.current}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <label className="flex items-center gap-1 text-xs">
            <input
              type="checkbox"
              checked={showBackground}
              onChange={() => setShowBackground(!showBackground)}
              className="form-checkbox h-3 w-3"
            />
            Background
          </label>
          <label className="flex items-center gap-1 text-xs">
            <input
              type="checkbox"
              checked={showElements}
              onChange={() => setShowElements(!showElements)}
              className="form-checkbox h-3 w-3"
            />
            Elements
          </label>
          <label className="flex items-center gap-1 text-xs">
            <input
              type="checkbox"
              checked={showColorMap}
              onChange={() => setShowColorMap(!showColorMap)}
              className="form-checkbox h-3 w-3"
            />
            Color Map
          </label>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Visualization */}
        <div 
          className={`bg-gray-900/80 rounded-lg backdrop-blur-sm border border-gray-700 relative overflow-hidden ${
            scrollState === 'scrolling' ? 'opacity-70' : 'opacity-100'
          } transition-opacity duration-300`}
          style={{
            width: visWidth,
            height: visHeight
          }}
        >
          {/* Background image layer */}
          {showBackground && imageUrl && (
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                opacity: 0.3
              }}
            />
          )}
          
          {/* Color map grid */}
          {showColorMap && (
            <div className="absolute inset-0">
              {colorMap.map((row, y) => 
                row.map((cell, x) => {
                  const luminance = cell.luminance
                  const cellStyle = {
                    position: 'absolute' as const,
                    left: x * cellWidth,
                    top: y * cellHeight,
                    width: cellWidth,
                    height: cellHeight,
                    backgroundColor: `rgba(${luminance * 255}, ${luminance * 255}, ${luminance * 255}, 0.3)`
                  }
                  
                  return (
                    <div 
                      key={`cell-${x}-${y}`}
                      style={cellStyle}
                      title={`${x},${y} - Luminance: ${luminance.toFixed(2)}`}
                    />
                  )
                })
              )}
            </div>
          )}
          
          {/* Element boundaries */}
          {showElements && Object.entries(elementGroups).map(([label, group]) => {
            // Calculate rectangle for the element group
            const x = group.minX * cellWidth
            const y = group.minY * cellHeight
            const width = (group.maxX - group.minX + 1) * cellWidth
            const height = (group.maxY - group.minY + 1) * cellHeight
            
            // Check if element is in viewport
            const inView = isElementInView(group.minX, group.minY, group.maxX, group.maxY)
            
            const style = {
              position: 'absolute' as const,
              left: x,
              top: y,
              width,
              height,
              backgroundColor: group.color,
              border: inView ? '2px solid rgba(255, 255, 255, 0.9)' : '1px dashed rgba(255, 255, 255, 0.6)',
              filter: inView ? 'brightness(1.2)' : 'brightness(0.8)'
            }
            
            return (
              <div key={`element-${label}`} style={style}>
                <div 
                  className={`absolute -top-5 left-0 text-xs px-1 ${inView ? 'bg-green-900/90' : 'bg-black/70'} text-white rounded whitespace-nowrap`}
                  style={{ maxWidth: Math.max(width * 2, 200) }}
                >
                  {label} {inView ? '(in view)' : ''}
                </div>
              </div>
            )
          })}
          
          {/* Viewport indicator - updates with scroll from main window */}
          <div 
            className="absolute border-2 border-blue-500/80 pointer-events-none"
            style={{
              left: viewportX,
              top: viewportY,
              width: adjustForZoom(viewportWidth),
              height: adjustForZoom(viewportHeight)
            }}
          >
            <div className="absolute top-1 left-1 text-xs bg-blue-500/80 text-white px-1 py-0.5 rounded">
              Viewport ({currentZoomLevel.toFixed(1)}×)
            </div>
          </div>
          
          {/* Scroll position indicator */}
          <div className="absolute right-1 top-1 bottom-1 w-1.5 bg-gray-800/60 rounded">
            <div 
              className="absolute w-1.5 bg-blue-500/80 rounded"
              style={{
                top: (currentScrollY / dimensions.height) * 100 + '%',
                height: ((viewportInfo?.height || screenDimensions.height) / dimensions.height) * 100 + '%',
                maxHeight: '100%'
              }}
            />
          </div>
          
          {/* Scale and zoom indicators */}
          <div className="absolute bottom-1 right-3 text-xs bg-black/70 text-white px-1 py-0.5 rounded flex gap-2">
            <span>Scale: {Math.round(scale * 100)}%</span>
            <span>|</span>
            <span>Zoom: {currentZoomLevel.toFixed(2)}×</span>
          </div>
        </div>
        
        {/* Analysis Results */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 text-xs text-gray-100 min-w-[200px] lg:max-w-[300px] sticky top-20">
          <h3 className="font-bold mb-2 text-white">Accessibility Analysis</h3>
          
          {/* Viewport dimensions info - now updates with main window scroll */}
          <div className="mb-3">
            <div className="font-medium border-b border-gray-700 pb-1 text-white">Viewport</div>
            <div className="pl-2 pt-1 space-y-1">
              <div className="flex gap-2">
                <span className="text-gray-400">Width:</span>
                <span className="text-gray-100">{viewportInfo?.width || screenDimensions.width}px</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400">Height:</span>
                <span className="text-gray-100">{viewportInfo?.height || screenDimensions.height}px</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400">Scroll Y:</span>
                <span className="text-gray-100">{Math.round(currentScrollY)}px</span>
              </div>
              {(viewportInfo?.scrollX || 0) > 0 && (
                <div className="flex gap-2">
                  <span className="text-gray-400">Scroll X:</span>
                  <span className="text-gray-100">{Math.round(viewportInfo?.scrollX || 0)}px</span>
                </div>
              )}
              <div className="flex gap-2">
                <span className="text-gray-400">Zoom:</span>
                <span className="text-gray-100">{currentZoomLevel.toFixed(2)}×</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400">Visible Area:</span>
                <span className="text-gray-100">
                  {Math.round(currentScrollY)}-{Math.round(currentScrollY + (viewportInfo?.height || screenDimensions.height))}px
                </span>
              </div>
            </div>
          </div>
          
          {/* Content dimensions */}
          <div className="mb-3">
            <div className="font-medium border-b border-gray-700 pb-1 text-white">Content</div>
            <div className="pl-2 pt-1 space-y-1">
              <div className="flex gap-2">
                <span className="text-gray-400">Width:</span>
                <span className="text-gray-100">{dimensions.width}px</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400">Height:</span>
                <span className="text-gray-100">{dimensions.height}px</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400">Grid:</span>
                <span className="text-gray-100">{colorMap[0]?.length || 0}×{colorMap.length || 0}</span>
              </div>
            </div>
          </div>
          
          {/* Elements in view */}
          <div className="mb-3">
            <div className="font-medium border-b border-gray-700 pb-1 text-white">Elements in View</div>
            <div className="pl-2 pt-1">
              <ul className="space-y-1">
                {Object.entries(elementGroups).map(([label, group]) => {
                  const inView = isElementInView(group.minX, group.minY, group.maxX, group.maxY);
                  return (
                    <li 
                      key={`view-${label}`} 
                      className={`flex justify-between ${inView ? 'text-green-400' : 'text-gray-500'}`}
                    >
                      <span>{label}</span>
                      <span>{inView ? '✓' : '—'}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          
          {/* Element colors analysis */}
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
      
      {/* Debugging information section */}
      <div className="mt-4 p-2 bg-gray-800/30 rounded text-xs text-gray-400">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-medium text-gray-300">Debug Info</h3>
          <button 
            onClick={() => setViewportUpdateCount(0)} 
            className="text-xs text-gray-500 hover:text-white px-2 py-0.5 rounded"
            title="Reset viewport update counter"
          >
            Reset counter
          </button>
        </div>
        <div className="flex gap-4">
          <div>
            <span>Viewport updates: </span>
            <span className="text-white">{viewportUpdateCount}</span>
          </div>
          <div>
            <span>Scroll position: </span>
            <span className="text-white">
              {viewportInfo ? 
                `${Math.round(viewportInfo.scrollY)}px` : 
                'unknown'}
            </span>
          </div>
          <div>
            <span>Last update: </span>
            <span className="text-white">
              {viewportInfo ? 
                new Date().toLocaleTimeString() : 
                'never'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}