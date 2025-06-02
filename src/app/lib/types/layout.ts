/**
 * Basic layout and dimension-related types that are used across the application
 */

/**
 * Current window dimensions
 */
export interface WindowSize {
  width: number;
  height: number;
}

/**
 * Default screen dimensions used for initial rendering 
 * or when actual dimensions aren't available
 */
export interface ScreenDimensions {
  defaultWidth: number;
  defaultHeight: number;
}

/**
 * Combined dimensions with aspect ratio - commonly used for container sizing
 */
export interface Dimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

/**
 * Position information
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Viewport information including scroll position
 */
export interface Viewport {
  width: number;
  height: number;
  scrollX: number;
  scrollY: number;
  zoomLevel: number
  dpr?: number
}

/**
 * Breakpoint configuration 
 */
export interface Breakpoint {
  name: string;
  minWidth: number;
}

