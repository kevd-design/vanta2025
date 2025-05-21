import { useState, useEffect, RefObject, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import type { ElementMap, ElementInfo, ElementMapResult } from '../../types/elementMap';



export const useElementMap = (
  containerRef: RefObject<HTMLElement>,
  elements: ElementInfo[],
  gridSize = 100
): ElementMapResult => {
  const [result, setResult] = useState<ElementMapResult>({
    elementMap: [],
    debugInfo: {
      totalElements: 0,
      coveredCells: 0
    }
  });

  // Memoize the map update function
  const updateElementMap = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    
    // Initialize empty map
    const newMap: ElementMap = Array(gridSize).fill(null)
      .map(() => Array(gridSize).fill(null)
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

      // Calculate grid cells covered by element
      const startCol = Math.floor((relativeRect.left / containerRect.width) * gridSize);
      const endCol = Math.ceil(((relativeRect.left + relativeRect.width) / containerRect.width) * gridSize);
      const startRow = Math.floor((relativeRect.top / containerRect.height) * gridSize);
      const endRow = Math.ceil(((relativeRect.top + relativeRect.height) / containerRect.height) * gridSize);

      // Mark cells as covered by element
      for (let row = startRow; row < endRow && row < gridSize; row++) {
        for (let col = startCol; col < endCol && col < gridSize; col++) {
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
        coveredCells
      }
    });
  }, [containerRef, elements, gridSize]);

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