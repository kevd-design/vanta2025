/**
 * Debug System Exports
 * 
 * This file re-exports all debug-related functionality for easier importing.
 * Components, hooks, and utilities are grouped by category.
 */

// Layout Components
export { DebugLayout } from './components/layout/DebugLayout';
export { DebugStatus } from './components/layout/DebugStatus';

// Provider Components
export { DebugKeyboardProvider } from './components/providers/DebugKeyboardProvider';

// Debug Visualization Components
export { AccessibilityDebug } from './components/AccessibilityDebug';
export { ImageDebug } from './components/ImageDebug';
// Export other visualization components as they're added
// export { PaletteVisualizer } from './components/PaletteVisualizer';
// export { ColorMapVisualizer } from './components/ColorMapVisualizer';

// Context Providers
export { useDebug, DebugProvider } from './context/DebugContext';
export { DebugLayoutProvider, useDebugLayout } from './context/DebugLayoutContext';
export type { DebugContent } from './context/DebugLayoutContext';


// Hooks
// These imports will need to be updated once you move them to the debug folder
export { useDebugKeyboard } from './hooks/useDebugKeyboard';
export { useDebugObserver } from './hooks/useDebugObserver';
export { useDebugUpdate } from './hooks/useDebugUpdate';
export { useDebugDimensions } from './hooks/useDebugDimensions';
export { useImageDebug } from './hooks/useImageDebug';
// When you move these to debug/hooks:
// export { useDebug } from './hooks/useDebug';

// Utilities
export { DebugWindowManager } from './utils/debugWindowManager';
export { DebugStorage } from './utils/debugStorage';
// When you move this to debug/utils:
// export { DebugWindowManager } from './utils/debugWindowManager';
// export { debugWindowManager } from './utils/debugWindowManager';

// Constants
export { DEBUG_CONFIG } from './constants/debugConfig';
// When you move this to debug/constants:
// export { DEBUG_CONFIG } from './constants/debugConfig';

// Types
// Once you create type files:
// export type { DebugComponentProps } from './types/debug.types';
// export type { ViewportInfo } from './types/debug.types';