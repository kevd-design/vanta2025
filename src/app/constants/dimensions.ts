export const DIMENSIONS = {
  breakpoint: {
    mobile: 768,
    tablet: 1024,
    desktop: 1440
  },
  screen: {
    defaultWidth: 1024, // Safe default for SSR
    defaultHeight: 800
  },
  logo: {
    mobile: 149, // Fixed size for mobile
    desktop: 215 // Fixed size for desktop
  }
} as const