import {
  buildOCRResult,
  findElementByPhrase,
  levenshteinDistance,
  normalizeText,
  similarityScore,
  unionBoundingBoxes,
} from '../src/engine/ocrParser';
import { OCRTextElement } from '../src/types/ocr';

describe('OCR Parser & Normalization Utilities', () => {
  test('normalizeText cleans punctuation and converts to lowercase', () => {
    expect(normalizeText('Wi-Fi & Internet Settings!')).toBe('wi fi internet settings');
    expect(normalizeText('  Mobile    Hotspot   ')).toBe('mobile hotspot');
  });

  test('levenshteinDistance computes accurate edit distance', () => {
    expect(levenshteinDistance('hotspot', 'hotspot')).toBe(0);
    expect(levenshteinDistance('hotspot', 'hotspat')).toBe(1);
    expect(levenshteinDistance('wifi', 'wi-fi')).toBe(1);
  });

  test('similarityScore handles exact and fuzzy matches', () => {
    expect(similarityScore('bluetooth', 'bluetooth')).toBe(1.0);
    expect(similarityScore('bluetooth', 'bluetoth')).toBeGreaterThanOrEqual(0.8);
    expect(similarityScore('settings', 'airplane')).toBeLessThan(0.4);
  });

  test('unionBoundingBoxes calculates correct enclosing rectangle', () => {
    const box1 = { x: 10, y: 20, width: 50, height: 30 };
    const box2 = { x: 40, y: 15, width: 60, height: 40 };

    const union = unionBoundingBoxes([box1, box2]);
    expect(union.x).toBe(10);
    expect(union.y).toBe(15);
    expect(union.width).toBe(90); // 100 - 10
    expect(union.height).toBe(40); // 55 - 15
  });

  test('findElementByPhrase matches target control element', () => {
    const elements: OCRTextElement[] = [
      {
        text: 'Wi-Fi',
        confidence: 0.95,
        boundingBox: { x: 100, y: 100, width: 80, height: 40 },
      },
      {
        text: 'Mobile hotspot',
        confidence: 0.98,
        boundingBox: { x: 200, y: 100, width: 120, height: 40 },
      },
      {
        text: 'Bluetooth',
        confidence: 0.92,
        boundingBox: { x: 340, y: 100, width: 90, height: 40 },
      },
    ];

    const match = findElementByPhrase(elements, 'mobile hotspot');
    expect(match.matched).toBe(true);
    expect(match.box?.x).toBe(200);
    expect(match.box?.width).toBe(120);

    const noMatch = findElementByPhrase(elements, 'airplane mode');
    expect(noMatch.matched).toBe(false);
  });

  test('buildOCRResult constructs normalized token list and structure', () => {
    const elements: OCRTextElement[] = [
      {
        text: 'Settings',
        confidence: 0.9,
        boundingBox: { x: 10, y: 10, width: 60, height: 20 },
      },
    ];

    const result = buildOCRResult('Settings Network & Internet', elements, 1920, 1080);
    expect(result.frameWidth).toBe(1920);
    expect(result.frameHeight).toBe(1080);
    expect(result.normalizedTokens).toContain('settings');
    expect(result.normalizedTokens).toContain('network');
    expect(result.normalizedTokens).toContain('internet');
  });
});
