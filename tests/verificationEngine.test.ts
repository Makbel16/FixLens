import { VerificationEngine } from '../src/engine/verificationEngine';
import { OCRResult } from '../src/types/ocr';

const hotspotVerifiedFixture = require('../src/engine/fixtures/hotspot_verified_ocr.json');
const hotspotErrorFixture = require('../src/engine/fixtures/hotspot_error_ocr.json');
const unknownFixture = require('../src/engine/fixtures/unknown_screen_ocr.json');

describe('Verification Engine Tests', () => {
  test('confirms verified success when required indicators are present', () => {
    const ocr: OCRResult = {
      ...hotspotVerifiedFixture,
      normalizedTokens: [],
      blocks: [],
      lines: [],
      timestamp: Date.now(),
    };

    const res = VerificationEngine.verifyMobileHotspot(ocr);
    expect(res.verified).toBe(true);
    expect(res.confidence).toBeGreaterThanOrEqual(0.7);
    expect(res.matchedEvidence).toContain('Active device connection counter');
  });

  test('rejects verification if error banner is detected', () => {
    const ocr: OCRResult = {
      ...hotspotErrorFixture,
      normalizedTokens: [],
      blocks: [],
      lines: [],
      timestamp: Date.now(),
    };

    const res = VerificationEngine.verifyMobileHotspot(ocr);
    expect(res.verified).toBe(false);
  });

  test('does not claim success when viewing unrelated screens', () => {
    const ocr: OCRResult = {
      ...unknownFixture,
      normalizedTokens: [],
      blocks: [],
      lines: [],
      timestamp: Date.now(),
    };

    const res = VerificationEngine.verifyMobileHotspot(ocr);
    expect(res.verified).toBe(false);
    expect(res.confidence).toBeLessThan(0.5);
  });
});
