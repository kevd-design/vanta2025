import { useState, useEffect, RefObject, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import type { ElementMap, ElementInfo, ElementMapResult } from '../../types/elementMap';



export const useElementMap = (
  containerRef: RefObject<HTMLElement>,
  elements: ElementInfo[],
  baseGridSize = 100
): ElementMapResult => {
  const [result, setResult] = useState<ElementMapResult>({
  elementMap: [],
  debugInfo: {
    totalElements: 0,
    coveredCells: 0,
    grid: {
      width: 0,
      height: 0
    }
  }
  });

  // Memoize the map update function
  const updateElementMap = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    
    // Calculate grid dimensions based on container aspect ratio
    const containerAspectRatio = containerRect.width / containerRect.height;
    let gridWidth: number;
    let gridHeight: number;

    if (containerAspectRatio > 1) {
      // Landscape: maintain base size for height
      gridHeight = baseGridSize;
      gridWidth = Math.round(baseGridSize * containerAspectRatio);
    } else {
      // Portrait: maintain base size for width
      gridWidth = baseGridSize;
      gridHeight = Math.round(baseGridSize / containerAspectRatio);
    }

    // Initialize empty map with proportional dimensions
    const newMap: ElementMap = Array(gridHeight).fill(null)
      .map(() => Array(gridWidth).fill(null)
      .map(() => ({ isElement: false })));

    let coveredCells = 0;

    elements.forEach(({ ref, label }) => {
      if (!ref.current) return;

      const elementRect = ref.current.getBoundingClientRect();
      
      // Calculate element position relative to container
      const relativeRect = {
        top: elementRect.top - containerRect.top,
        left: elementRect.left - containerRect.left,
        width: elementRect.width,
        height: elementRect.height
      };

      // Calculate grid cells covered by element using proportional grid
      const startCol = Math.floor((relativeRect.left / containerRect.width) * gridWidth);
      const endCol = Math.ceil(((relativeRect.left + relativeRect.width) / containerRect.width) * gridWidth);
      const startRow = Math.floor((relativeRect.top / containerRect.height) * gridHeight);
      const endRow = Math.ceil(((relativeRect.top + relativeRect.height) / containerRect.height) * gridHeight);

      // Mark cells as covered by element
      for (let row = startRow; row < endRow && row < gridHeight; row++) {
        for (let col = startCol; col < endCol && col < gridWidth; col++) {
          if (row >= 0 && col >= 0) {
            newMap[row][col] = {
              isElement: true,
              elementLabel: label
            };
            coveredCells++;
          }
        }
      }
    });

    setResult({
      elementMap: newMap,
      debugInfo: {
        totalElements: elements.length,
        coveredCells,
        grid: { width: gridWidth, height: gridHeight }
      }
    });
  }, [containerRef, elements, baseGridSize]);

  // Debounce the update function
  const debouncedUpdate = useDebounce(updateElementMap, 100);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initial update
    debouncedUpdate();

    // Set up resize observer
    const resizeObserver = new ResizeObserver(() => {
      debouncedUpdate();
    });
    resizeObserver.observe(containerRef.current);

    // Clean up
    return () => {
      debouncedUpdate.cancel();
      resizeObserver.disconnect();
    };
  }, [containerRef, debouncedUpdate]);

  return result;
};