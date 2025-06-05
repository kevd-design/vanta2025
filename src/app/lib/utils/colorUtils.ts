export const colorUtils = {
  hexToRgb: (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  },
  
  hexToRgba: (hex: string, opacity: number): string => {
    const [r, g, b] = colorUtils.hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },
  
  relativeLuminance: (rgb: [number, number, number]): number => {
    const srgb = rgb.map(val => {
      val = val / 255;
      return val <= 0.03928
        ? val / 12.92
        : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  },
  
  contrastRatio: (l1: number, l2: number): number => {
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }
};