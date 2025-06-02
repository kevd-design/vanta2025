import { RefObject } from 'react';

export type ElementInfo = {
  ref: RefObject<HTMLElement | null>;
  label: string;
};

export type ElementMapCell = {
  isElement: boolean;
  elementLabel?: string;
  rawPosition?: {
    x: number;
    y: number;
  }
};

export type ElementMap = ElementMapCell[][];

export interface ElementMapResult {
  elementMap: ElementMap;
  debugInfo: {
    totalElements: number;
    coveredCells: number;
    grid: {
      width: number;
      height: number;
    };
    dpr: number;
  };
}