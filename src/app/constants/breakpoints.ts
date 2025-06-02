export const BREAKPOINTS = [320, 375, 425, 640, 768, 1024, 1280, 1536, 1920] as const

export function getNearestBreakpoint(width: number) {
  return BREAKPOINTS.reduce((prev, curr) =>
    Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev
  )
}