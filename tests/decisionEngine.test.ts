import { TroubleshootingDecisionEngine } from '../src/engine/decisionEngine';
import mobileHotspotWorkflow from '../src/engine/workflows/mobileHotspot';
import { ScreenClassification } from '../src/types/screen';

describe('Troubleshooting Decision Engine Tests', () => {
  let engine: TroubleshootingDecisionEngine;

  beforeEach(() => {
    engine = new TroubleshootingDecisionEngine(mobileHotspotWorkflow);
  });

  test('initializes on Step 1 with expected screen DESKTOP_TASKBAR', () => {
    const step = engine.getCurrentStep();
    expect(step.stepNumber).toBe(1);
    expect(step.expectedScreen).toBe('WINDOWS_DESKTOP_TASKBAR');
  });

  test('auto-advances to Step 2 when computer transitions to QUICK_SETTINGS', () => {
    const desktopClassification: ScreenClassification = {
      screenType: 'WINDOWS_DESKTOP_TASKBAR',
      confidence: 0.85,
      matchedKeywords: ['start', 'eng'],
      identifiedElements: { network_icon: { x: 1700, y: 1000, width: 40, height: 40 } },
      rawSnippet: 'desktop taskbar',
      timestamp: Date.now(),
    };

    engine.evaluateFrame(desktopClassification);
    expect(engine.getCurrentStep().stepNumber).toBe(1);

    // User clicks network icon on PC -> Quick Settings panel opens
    const quickSettingsClassification: ScreenClassification = {
      screenType: 'WINDOWS_QUICK_SETTINGS',
      confidence: 0.9,
      matchedKeywords: ['wi-fi', 'mobile hotspot'],
      identifiedElements: { mobile_hotspot_tile: { x: 1540, y: 780, width: 120, height: 45 } },
      rawSnippet: 'quick settings',
      timestamp: Date.now(),
    };

    // Frame 1 of new screen
    engine.evaluateFrame(quickSettingsClassification);
    // Frame 2 of new screen confirms transition
    const res = engine.evaluateFrame(quickSettingsClassification);

    expect(res.stateChanged).toBe(true);
    expect(res.reason).toBe('AUTO_ADVANCED_NEXT_SCREEN');
    expect(engine.getCurrentStep().stepNumber).toBe(2);
    expect(engine.getState().targetLabel).toBe('Mobile Hotspot Tile');
  });

  test('switches to Error Recovery step when error screen appears', () => {
    const errorClassification: ScreenClassification = {
      screenType: 'WINDOWS_HOTSPOT_ERROR',
      confidence: 0.92,
      matchedKeywords: ['cant set up mobile hotspot'],
      identifiedElements: { error_banner: { x: 500, y: 200, width: 300, height: 50 } },
      rawSnippet: 'cant set up mobile hotspot',
      timestamp: Date.now(),
    };

    const res = engine.evaluateFrame(errorClassification);
    expect(res.stateChanged).toBe(true);
    expect(res.reason).toBe('ERROR_STATE_DETECTED');
    expect(engine.getState().targetLabel).toBe('Hotspot Error Banner');
  });

  test('handles BACK, SKIP, and REPEAT user actions correctly', () => {
    // Advance to step 2 manually
    engine.handleUserAction('SKIP');
    expect(engine.getCurrentStep().stepNumber).toBe(2);

    // Move back
    engine.handleUserAction('BACK');
    expect(engine.getCurrentStep().stepNumber).toBe(1);

    // Repeat returns guidance
    const repeatRes = engine.handleUserAction('REPEAT');
    expect(repeatRes.success).toBe(true);
  });
});
