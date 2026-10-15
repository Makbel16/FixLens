import { BoundingBox, OCRLine, OCRResult, OCRTextBlock, OCRTextElement } from '../types/ocr';

/**
 * Normalizes text for robust comparison against screen signatures:
 * removes non-alphanumeric noise, strips multiple spaces, and converts to lowercase.
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculates Levenshtein distance between two strings for typo/OCR tolerance.
 */
export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/**
 * Returns similarity ratio between 0.0 (no match) and 1.0 (exact match).
 */
export function similarityScore(a: string, b: string): number {
  const na = normalizeText(a);
  const nb = normalizeText(b);
  if (na === nb) return 1.0;
  if (!na.length || !nb.length) return 0.0;
  const dist = levenshteinDistance(na, nb);
  const maxLen = Math.max(na.length, nb.length);
  return Math.max(0, 1 - dist / maxLen);
}

/**
 * Computes bounding box that encloses multiple bounding boxes.
 */
export function unionBoundingBoxes(boxes: BoundingBox[]): BoundingBox {
  if (boxes.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const box of boxes) {
    minX = Math.min(minX, box.x);
    minY = Math.min(minY, box.y);
    maxX = Math.max(maxX, box.x + box.width);
    maxY = Math.max(maxY, box.y + box.height);
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Searches OCR elements for target phrase or keyword, returning matched bounding box.
 */
export function findElementByPhrase(
  elements: OCRTextElement[],
  phrase: string,
  minSimilarity: number = 0.8
): { matched: boolean; box: BoundingBox | null; score: number } {
  const target = normalizeText(phrase);
  const targetWords = target.split(' ').filter(Boolean);

  if (targetWords.length === 0) {
    return { matched: false, box: null, score: 0 };
  }

  // First, check single elements that contain the entire phrase
  for (const el of elements) {
    const normEl = normalizeText(el.text);
    if (normEl.includes(target)) {
      return { matched: true, box: el.boundingBox, score: 1.0 };
    }
    const score = similarityScore(normEl, target);
    if (score >= minSimilarity) {
      return { matched: true, box: el.boundingBox, score };
    }
  }

  // Second, check multi-element sequences (e.g. "Mobile" and "hotspot" as adjacent items)
  if (targetWords.length > 1) {
    const matchedBoxes: BoundingBox[] = [];
    let matchedCount = 0;

    for (const word of targetWords) {
      const match = elements.find(el => {
        const norm = normalizeText(el.text);
        return norm === word || similarityScore(norm, word) >= 0.85;
      });

      if (match) {
        matchedCount++;
        matchedBoxes.push(match.boundingBox);
      }
    }

    if (matchedCount === targetWords.length) {
      return {
        matched: true,
        box: unionBoundingBoxes(matchedBoxes),
        score: 0.95,
      };
    }
  }

  return { matched: false, box: null, score: 0 };
}

/**
 * Parses raw text and elements into an indexed OCR result object.
 */
export function buildOCRResult(
  rawText: string,
  elements: OCRTextElement[],
  frameWidth: number,
  frameHeight: number
): OCRResult {
  const norm = normalizeText(rawText);
  const tokens = norm.split(' ').filter(t => t.length > 1);

  // Derive simple lines and blocks if not pre-populated
  const line: OCRLine = {
    text: rawText,
    elements,
    boundingBox: unionBoundingBoxes(elements.map(e => e.boundingBox)),
  };

  const block: OCRTextBlock = {
    text: rawText,
    lines: [line],
    boundingBox: line.boundingBox,
  };

  return {
    rawText,
    normalizedTokens: tokens,
    blocks: [block],
    lines: [line],
    elements,
    frameWidth,
    frameHeight,
    timestamp: Date.now(),
  };
}
