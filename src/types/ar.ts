import { BoundingBox } from './ocr';

export interface ViewportDimensions {
  width: number;
  height: number;
}

export interface FrameDimensions {
  width: number;
  height: number;
}

export type AspectMode = 'aspectFill' | 'aspectFit';

export interface CoordinateTransformConfig {
  frame: FrameDimensions;
  viewport: ViewportDimensions;
  mode: AspectMode;
}

export interface ARHighlightTarget {
  id: string;
  sourceBox: BoundingBox;
  viewportBox: BoundingBox;
  label: string;
  subtext?: string;
  confidence: number;
  status: 'TRACKING' | 'SEARCHING' | 'CONFIRMED' | 'ATTENTION';
}
