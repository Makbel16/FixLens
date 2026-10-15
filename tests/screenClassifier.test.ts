import { ScreenClassifier } from '../src/engine/screenClassifier';
import { OCRResult } from '../src/types/ocr';

const desktopFixture = require('../src/engine/fixtures/desktop_taskbar_ocr.json');
const quickSettingsFixture = require('../src/engine/fixtures/quick_settings_ocr.json');
const hotspotSettingsFixture = require('../src/engine/fixtures/settings_mobile_hotspot_ocr.json');
const hotspotErrorFixture = require('../src/engine/fixtures/hotspot_error_ocr.json');
const hotspotVerifiedFixture = require('../src/engine/fixtures/hotspot_verified_ocr.json');
const unknownFixture = require('../src/engine/fixtures/unknown_screen_ocr.json');

describe('Screen State Classifier Tests', () => {
  let classifier: ScreenClassifier;

  beforeEach(() => {
    classifier = new ScreenClassifier();
  });

  test('correctly identifies Windows Desktop / Taskbar', () => {
    const ocr: OCRResult = {
      ...desktopFixture,
      normalizedTokens: [],
      blocks: [],
      lines: [],
      timestamp: Date.now(),
    };

    const res = classifier.classify(ocr);
    expect(res.screenType).toBe('WINDOWS_DESKTOP_TASKBAR');
    expect(res.confidence).toBeGreaterThanOrEqual(0.6);
  });

  test('correctly identifies Windows Quick Settings flyout', () => {
    const ocr: OCRResult = {
      ...quickSettingsFixture,
      normalizedTokens: [],
      blocks: [],
      lines: [],
      timestamp: Date.now(),
    };

    const res = classifier.classify(ocr);
    expect(res.screenType).toBe('WINDOWS_QUICK_SETTINGS');
    expect(res.confidence).toBeGreaterThanOrEqual(0.65);
    expect(res.identifiedElements.mobile_hotspot_tile).toBeDefined();
  });

  test('correctly identifies Windows Mobile Hotspot Settings page', () => {
    const ocr: OCRResult = {
      ...hotspotSettingsFixture,
      normalizedTokens: [],
      blocks: [],
      lines: [],
      timestamp: Date.now(),
    };

    const res = classifier.classify(ocr);
    expect(res.screenType).toBe('WINDOWS_SETTINGS_MOBILE_HOTSPOT');
    expect(res.confidence).toBeGreaterThanOrEqual(0.7);
  });

  test('correctly detects Mobile Hotspot Error State', () => {
    const ocr: OCRResult = {
      ...hotspotErrorFixture,
      normalizedTokens: [],
      blocks: [],
      lines: [],
      timestamp: Date.now(),
    };

    const res = classifier.classify(ocr);
    expect(res.screenType).toBe('WINDOWS_HOTSPOT_ERROR');
    expect(res.confidence).toBeGreaterThanOrEqual(0.75);
    expect(res.identifiedElements.error_banner).toBeDefined();
  });

  test('correctly identifies Hotspot Verified Active state', () => {
    const ocr: OCRResult = {
      ...hotspotVerifiedFixture,
      normalizedTokens: [],
      blocks: [],
      lines: [],
      timestamp: Date.now(),
    };

    const res = classifier.classify(ocr);
    expect(res.screenType).toBe('WINDOWS_HOTSPOT_ACTIVE');
    expect(res.confidence).toBeGreaterThanOrEqual(0.7);
  });

  test('falls back safely to UNKNOWN_SCREEN on unrelated screens', () => {
    const ocr: OCRResult = {
      ...unknownFixture,
      normalizedTokens: [],
      blocks: [],
      lines: [],
      timestamp: Date.now(),
    };

    const res = classifier.classify(ocr);
    expect(res.screenType).toBe('UNKNOWN_SCREEN');
    expect(res.confidence).toBe(0);
  });
});
