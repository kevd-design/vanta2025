'use client'

import { FC, useState, useEffect, useRef } from 'react'
import type { ColorMap } from '@/app/lib/types/colorMap'
import type { ElementMapCell } from '@/app/lib/types/elementMap'
import type { Viewport } from '@/app/lib/types/layout'

// Enhanced props to include new accessibility metrics
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
        wcagCompliant?: boolean
        needsBackground?: boolean
        debugInfo: {
          totalCells: number
          blackVotes: number
          whiteVotes: number
          consensusPercentage: number
          contrastRatio?: number
          varianceScore?: number
          dpr?: number
        }
      }
    }
  }
  imageUrl?: string
  viewportInfo?: Viewport
  scrollState?: 'idle' | 'scrolling' | 'completed'
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
  // Existing state setup
  const [hasValidData, setHasValidData] = useState(true)
  const prevViewportInfoRef = useRef<Viewport | undefined>(undefined)
  const propsUpdatedRef = useRef(0)
  const viewportUpdatedRef = useRef(0)
  const [viewportUpdateCount, setViewportUpdateCount] = useState(0)

  // Visualization toggles
  const [showBackground, setShowBackground] = useState(() => {
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

  // New toggle for WCAG compliance visualization
  const [showWcagCompliance, setShowWcagCompliance] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedPref = localStorage.getItem('debug-show-wcag');
      return savedPref === null ? true : savedPref === 'true';
    }
    return true;
  });

  // Add new state for grid visualization
  const [showGridLines, setShowGridLines] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedPref = localStorage.getItem('debug-show-gridlines');
      return savedPref === null ? false : savedPref === 'true';
    }
    return false;
  });

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('debug-show-background', showBackground.toString());
  }, [showBackground]);

  useEffect(() => {
    localStorage.setItem('debug-show-elements', showElements.toString());
  }, [showElements]);

  useEffect(() => {
    localStorage.setItem('debug-show-colormap', showColorMap.toString());
  }, [showColorMap]);

  useEffect(() => {
    localStorage.setItem('debug-show-wcag', showWcagCompliance.toString());
  }, [showWcagCompliance]);

  useEffect(() => {
    localStorage.setItem('debug-show-gridlines', showGridLines.toString());
  }, [showGridLines]);
  
  

  // Validate input data
  useEffect(() => {
    const isValid = Array.isArray(colorMap) && 
                   colorMap.length > 0 && 
                   Array.isArray(elementMap) &&
                   elementMap.length > 0 &&
                   typeof dimensions === 'object' &&
                   dimensions?.width > 0 &&
                   dimensions?.height > 0
    
    propsUpdatedRef.current += 1
    
    const viewportChanged = hasViewportChanged(viewportInfo, prevViewportInfoRef.current)
    if (viewportChanged) {
      viewportUpdatedRef.current += 1
      setViewportUpdateCount(count => count + 1)
      prevViewportInfoRef.current = viewportInfo
    }
    
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
  


  
  
  // Calculate scaling to fit visualization in available space
  const MAX_WIDTH = 600
  const scale = Math.min(1, MAX_WIDTH / dimensions.width)

  // Use viewportInfo if available, otherwise fallback to defaults
  const currentScrollY = viewportInfo?.scrollY ?? (typeof window !== 'undefined' ? window.scrollY : 0)
  const currentScrollX = viewportInfo?.scrollX ?? (typeof window !== 'undefined' ? window.scrollX : 0)
  const currentZoomLevel = viewportInfo?.zoomLevel ?? 1
  
  // Dimensions for the visualization
  const visWidth = dimensions.width * scale
  const visHeight = dimensions.height * scale

  const currentDpr = viewportInfo?.dpr ?? (typeof window !== 'undefined' ? window.devicePixelRatio : 1)

  // Log ColorMap details for debugging
  useEffect(() => {
    if (Array.isArray(colorMap) && colorMap.length > 0) {
      console.debug('AccessibilityDebug ColorMap:', { 
        dimensions: `${colorMap[0]?.length || 0}×${colorMap.length || 0}`,
        cellSizes: {
          width: visWidth / (colorMap[0]?.length || 1),
          height: visHeight / (colorMap.length || 1)
        },
        dpr: currentDpr,
        scale
      });
    }
  }, [colorMap, currentDpr, scale, visWidth, visHeight]);

  // Calculate cell size with DPR correction
  const exactCellWidth = visWidth / (colorMap[0]?.length || 1);
  const exactCellHeight = visHeight / (colorMap.length || 1);

  // Add cell dimension debugging
  useEffect(() => {
    if (colorMap?.length > 0 && colorMap[0]?.length > 0) {
      console.debug('AccessibilityDebug cell dimensions:', {
        rawCellSize: {
          width: visWidth / (colorMap[0]?.length || 1),
          height: visHeight / (colorMap.length || 1)
        },
        actualCellSize: {
          width: Math.max(1, Math.ceil(exactCellWidth)),
          height: Math.max(1, Math.ceil(exactCellHeight)),
        },
        colorMapSize: `${colorMap[0].length}×${colorMap.length}`,
        visualizationSize: `${Math.ceil(visWidth)}×${Math.ceil(visHeight)}`,
        dpr: currentDpr,
        zoomLevel: currentZoomLevel
      });
    }
  }, [colorMap, visWidth, visHeight, exactCellWidth, exactCellHeight, currentDpr, currentZoomLevel]);

    // Helper to detect meaningful viewport changes
  const hasViewportChanged = (current?: Viewport, previous?: Viewport): boolean => {
    if (!current || !previous) return true
    
    const scrollYDiff = Math.abs((current.scrollY || 0) - (previous.scrollY || 0))
    const scrollXDiff = Math.abs((current.scrollX || 0) - (previous.scrollX || 0))
    
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
    color: string,
    wcagCompliant?: boolean,
    contrastRatio?: number,
    varianceScore?: number
  }> = {}

    // Calculate viewport position based on scroll position from the main window
  const viewportY = Math.min(currentScrollY * scale, visHeight - viewportHeight)
  const viewportX = Math.min(currentScrollX * scale, visWidth - viewportWidth)



  
  // Process element map to find element boundaries
  elementMap.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell.isElement && cell.elementLabel) {
        const label = cell.elementLabel
        const elementResult = accessibilityResults.elementColors[label]
        
        // Enhanced color coding to include WCAG compliance status
        let color = 'rgba(128, 128, 128, 0.4)';  // Default gray
        
        if (elementResult) {
          if (elementResult.wcagCompliant) {
            // Compliant colors are more vibrant
            color = elementResult.color === 'text-black' ? 'rgba(0, 120, 255, 0.5)' :
                   elementResult.color === 'text-white' ? 'rgba(255, 60, 60, 0.5)' :
                   'rgba(255, 255, 0, 0.5)';
          } else {
            // Non-compliant colors are muted and more transparent
            color = elementResult.color === 'text-black' ? 'rgba(0, 80, 170, 0.3)' :
                   elementResult.color === 'text-white' ? 'rgba(170, 40, 40, 0.3)' :
                   'rgba(180, 180, 0, 0.3)';
          }
        }
        
        if (!elementGroups[label]) {
          elementGroups[label] = { 
            minX: x, 
            minY: y, 
            maxX: x, 
            maxY: y, 
            cells: 1,
            color,
            wcagCompliant: elementResult?.wcagCompliant,
            contrastRatio: elementResult?.debugInfo.contrastRatio,
            varianceScore: elementResult?.debugInfo.varianceScore
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
  

  
  // Calculate if each element is in the viewport
  const isElementInView = (minX: number, minY: number, maxX: number, maxY: number): boolean => {
    const elementLeft = minX * exactCellWidth
    const elementRight = (maxX + 1) * exactCellWidth
    const elementTop = minY * exactCellHeight
    const elementBottom = (maxY + 1) * exactCellHeight
    
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
  // Get the current zoom level from viewport info or fallback
  const zoom = viewportInfo?.zoomLevel || currentZoomLevel || 1;
  
  if (zoom > 1.01) { // Small threshold to avoid unnecessary calculations
    // Apply inverse scaling proportional to zoom level
    // This makes the indicator show the correct size relative to content
    return value / zoom;
  }
  
  return value;
};
  
  // Helper function to get WCAG compliance status display
  const getWcagStatusDisplay = (contrastRatio: number | undefined, isCompliant: boolean | undefined) => {
    if (contrastRatio === undefined) return '—';
    
    // Use the compliance flag to determine styling, but use contrast ratio for specific level
    const className = isCompliant ? "text-green-400" : "text-red-400";
    
    if (contrastRatio >= 7.0) {
      return <span className={className}>AAA ({contrastRatio.toFixed(1)}:1)</span>;
    } else if (contrastRatio >= 4.5) {
      return <span className={className}>AA ({contrastRatio.toFixed(1)}:1)</span>;
    } else if (contrastRatio >= 3.0) {
      // Special case for large text that might pass AA but not regular AA
      return <span className={contrastRatio >= 3.0 && isCompliant ? "text-yellow-400" : "text-red-400"}>
        AA Large ({contrastRatio.toFixed(1)}:1)
      </span>;
    } else {
      return <span className="text-red-400">Fail ({contrastRatio.toFixed(1)}:1)</span>;
    }
  };
  
  // Helper function to get variance status display
  const getVarianceDisplay = (variance: number | undefined) => {
    if (variance === undefined) return '—';
    
    if (variance < 0.1) {
      return <span className="text-green-400">Uniform ({variance.toFixed(2)})</span>;
    } else if (variance < 0.2) {
      return <span className="text-yellow-400">Moderate ({variance.toFixed(2)})</span>;
    } else {
      return <span className="text-red-400">High ({variance.toFixed(2)})</span>;
    }
  };
  

  
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
          <label className="flex items-center gap-1 text-xs">
            <input
              type="checkbox"
              checked={showWcagCompliance}
              onChange={() => setShowWcagCompliance(!showWcagCompliance)}
              className="form-checkbox h-3 w-3"
            />
            WCAG
          </label>
          <label className="flex items-center gap-1 text-xs">
            <input
              type="checkbox"
              checked={showGridLines}
              onChange={() => setShowGridLines(!showGridLines)}
              className="form-checkbox h-3 w-3"
            />
            Grid
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
            width: Math.ceil(visWidth),
            height: Math.ceil(visHeight)
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
                  // Calculate exact proportional positions instead of pixel-based positions
                  const proportionX = x / colorMap[0].length;
                  const proportionY = y / colorMap.length;
                  
                  // Convert to pixel space for rendering
                  const startX = Math.round(proportionX * visWidth);
                  const startY = Math.round(proportionY * visHeight);
                  const endX = Math.round((proportionX + 1/colorMap[0].length) * visWidth);
                  const endY = Math.round((proportionY + 1/colorMap.length) * visHeight);
                  
                  // Calculate actual dimensions from these positions
                  const actualWidth = Math.max(1, endX - startX);
                  const actualHeight = Math.max(1, endY - startY);
                  
                  // For WCAG compliance view, show different visualization
                  if (showWcagCompliance && cell.contrastWithBlack !== undefined && cell.contrastWithWhite !== undefined) {
                    // Show WCAG compliance visualization for contrast ratios
                    let cellColor: string;
                    
                    // Visualize best contrast (black or white)
                    const bestContrast = Math.max(cell.contrastWithBlack, cell.contrastWithWhite);
                    const preferWhiteText = cell.contrastWithWhite > cell.contrastWithBlack;
                    
                    // Determine color based on contrast ratio
                    if (bestContrast >= 7.0) {
                      cellColor = preferWhiteText ? 'rgba(0, 128, 0, 0.7)' : 'rgba(0, 200, 0, 0.7)';
                    } else if (bestContrast >= 4.5) {
                      cellColor = preferWhiteText ? 'rgba(0, 0, 170, 0.7)' : 'rgba(0, 120, 255, 0.7)';
                    } else if (bestContrast >= 3.0) {
                      cellColor = preferWhiteText ? 'rgba(180, 140, 0, 0.7)' : 'rgba(255, 200, 0, 0.7)';
                    } else {
                      cellColor = preferWhiteText ? 'rgba(170, 0, 0, 0.7)' : 'rgba(255, 0, 0, 0.7)';
                    }
                    
                    // Create cell style with calculated position and color
                    const cellStyle = {
                      position: 'absolute' as const,
                      left: startX,
                      top: startY,
                      width: Math.max(1, actualWidth),
                      height: Math.max(1, actualHeight),
                      backgroundColor: cellColor,
                      ...(showGridLines && { border: '1px solid rgba(255,255,255,0.1)' })
                    };
                    
                    return (
                      <div 
                        key={`cell-${x}-${y}`} 
                        style={cellStyle}
                        title={`Contrast - Black: ${cell.contrastWithBlack?.toFixed(1)}:1, White: ${cell.contrastWithWhite?.toFixed(1)}:1`}
                      />
                    );
                  } else {
                    // Original luminance-based visualization
                    const luminance = cell.luminance;
                    const cellStyle = {
                      position: 'absolute' as const,
                      left: Math.floor(x * exactCellWidth),
                      top: Math.floor(y * exactCellHeight),
                      width: Math.max(1, Math.ceil(exactCellWidth)),
                      height: Math.max(1, Math.ceil(exactCellHeight)),
                      backgroundColor: `rgba(${luminance * 255}, ${luminance * 255}, ${luminance * 255}, 0.3)`
                    };
                    
                    return (
                      <div 
                        key={`cell-${x}-${y}`}
                        style={cellStyle}
                        title={`${x},${y} - Luminance: ${luminance.toFixed(2)}`}
                      />
                    );
                  }
                })
              )}
            </div>
          )}
          
          {/* Element boundaries */}
          {showElements && Object.entries(elementGroups).map(([label, group]) => {
            // Calculate rectangle for the element group
            const x = group.minX * exactCellWidth
            const y = group.minY * exactCellHeight
            const width = (group.maxX - group.minX + 1) * exactCellWidth
            const height = (group.maxY - group.minY + 1) * exactCellHeight
            
            // Check if element is in viewport
            const inView = isElementInView(group.minX, group.minY, group.maxX, group.maxY)
            
            // Add WCAG compliance indicator to border
            const borderStyle = group.wcagCompliant
              ? inView ? '2px solid rgba(80, 255, 80, 0.9)' : '1px solid rgba(80, 255, 80, 0.6)'
              : inView ? '2px dashed rgba(255, 80, 80, 0.9)' : '1px dashed rgba(255, 80, 80, 0.6)';
              
            const style = {
              position: 'absolute' as const,
              left: x,
              top: y,
              width,
              height,
              backgroundColor: group.color,
              border: borderStyle,
              filter: inView ? 'brightness(1.2)' : 'brightness(0.8)'
            }
            
            return (
              <div key={`element-${label}`} style={style}>
                <div 
                  className={`absolute -top-5 left-0 text-xs px-1 ${
                    inView 
                      ? group.wcagCompliant ? 'bg-green-900/90' : 'bg-red-900/90' 
                      : 'bg-black/70'
                    } text-white rounded whitespace-nowrap`}
                  style={{ maxWidth: Math.max(width * 2, 200) }}
                >
                  {label} {group.contrastRatio && `(${group.contrastRatio.toFixed(1)}:1)`} {inView ? '✓' : ''}
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
          
        </div>
        
        {/* Enhanced Analysis Results */}
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
                <span className="text-gray-400">DPR:</span>
                <span className="text-gray-100">{currentDpr.toFixed(1)}×</span>
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
                      className={`flex justify-between ${
                        inView ? (group.wcagCompliant ? 'text-green-400' : 'text-yellow-400') : 'text-gray-500'
                      }`}
                    >
                      <span>{label}</span>
                      <span>{inView ? '✓' : '—'}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          
          {/* Enhanced element colors analysis with WCAG info */}
          {Object.entries(accessibilityResults.elementColors).map(([label, result]) => (
            <div key={label} className="mb-3 last:mb-0">
              <div className={`font-medium border-b pb-1 ${
                result.wcagCompliant ? 'text-green-400 border-green-800/50' : 'text-yellow-400 border-yellow-800/50'
              }`}>
                {label}
              </div>
              <div className="pl-2 pt-1 space-y-1">
                <div className="flex gap-2">
                  <span className="text-gray-400">Color:</span>
                  <span className="text-gray-100">{result.color}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400">WCAG:</span>
                  {getWcagStatusDisplay(result.debugInfo.contrastRatio, result.wcagCompliant)}
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400">Variance:</span>
                  {getVarianceDisplay(result.debugInfo.varianceScore)}
                </div>
                {result.needsBackground && (
                  <div className="bg-yellow-900/40 text-yellow-400 px-1 py-0.5 rounded text-[10px] mt-1">
                    Background recommended
                  </div>
                )}
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
        <div className="flex flex-wrap gap-4">
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
            <span>DPR: </span>
            <span className="text-white">{currentDpr.toFixed(1)}×</span>
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