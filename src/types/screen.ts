import { BoundingBox } from './ocr';

export type RecognizedScreenType =
  | 'WINDOWS_DESKTOP_TASKBAR'
  | 'WINDOWS_QUICK_SETTINGS'
  | 'WINDOWS_SETTINGS_NETWORK'
  | 'WINDOWS_SETTINGS_MOBILE_HOTSPOT'
  | 'WINDOWS_HOTSPOT_ERROR'
  | 'WINDOWS_HOTSPOT_ACTIVE'
  | 'WINDOWS_SETTINGS_WIFI'
  | 'UNKNOWN_SCREEN';

export interface ScreenClassification {
  screenType: RecognizedScreenType;
  confidence: number; // 0.0 to 1.0
  matchedKeywords: string[];
  identifiedElements: Record<string, BoundingBox>;
  rawSnippet: string;
  timestamp: number;
}

export interface ScreenSignature {
  screenType: RecognizedScreenType;
  requiredKeywords: string[][]; // Array of OR-groups: [ ['start'], ['wifi', 'network'] ]
  forbiddenKeywords?: string[];
  keyElementPatterns: Record<string, RegExp>;
  minimumConfidence: number;
}
