export interface DebugInfo {
  hasColorMap: boolean;
  hasElementMap: boolean;
  elementColors: Record<string, {
    color: string;
    background?: boolean;
  }>;
}