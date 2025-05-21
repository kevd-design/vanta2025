import { RefObject } from 'react';

export type ElementInfo = {
  ref: RefObject<HTMLElement | null>;
  label: string;
};

export type ElementMapCell = {
  isElement: boolean;
  elementLabel?: string;
};

export type ElementMap = ElementMapCell[][];

export type ElementMapResult = {
  elementMap: ElementMap;
  debugInfo: {
    totalElements: number;
    coveredCells: number;
  };
};