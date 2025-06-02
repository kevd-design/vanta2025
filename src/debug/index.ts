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

// Context Providers
export { useDebug, DebugProvider } from './context/DebugContext';
export { DebugLayoutProvider, useDebugLayout } from './context/DebugLayoutContext';
export type { DebugContent } from './context/DebugLayoutContext';


// Hooks
export { useDebugKeyboard } from './hooks/useDebugKeyboard';
export { useDebugObserver } from './hooks/useDebugObserver';
export { useDebugUpdate } from './hooks/useDebugUpdate';
export { useDebugDimensions } from './hooks/useDebugDimensions';
export { useImageDebug } from './hooks/useImageDebug';


// Utilities
export { DebugWindowManager } from './lib/utils/debugWindowManager';
export { DebugStorage } from './lib/utils/debugStorage';

// Constants
export { DEBUG_CONFIG } from './constants/debugConfig';

// Types
// Once you create type files:
export type { DebugInfo } from './lib/types/debug.types';
