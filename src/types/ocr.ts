export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface OCRTextElement {
  text: string;
  confidence: number;
  boundingBox: BoundingBox;
  cornerPoints?: Point2D[];
}

export interface OCRLine {
  text: string;
  elements: OCRTextElement[];
  boundingBox: BoundingBox;
}

export interface OCRTextBlock {
  text: string;
  lines: OCRLine[];
  boundingBox: BoundingBox;
}

export interface OCRResult {
  rawText: string;
  normalizedTokens: string[];
  blocks: OCRTextBlock[];
  lines: OCRLine[];
  elements: OCRTextElement[];
  frameWidth: number;
  frameHeight: number;
  timestamp: number;
}
