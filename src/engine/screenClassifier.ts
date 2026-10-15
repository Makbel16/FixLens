import { OCRResult } from '../types/ocr';
import { RecognizedScreenType, ScreenClassification, ScreenSignature } from '../types/screen';
import { normalizeText } from './ocrParser';

// Definitive Screen Signatures for Windows 11 Diagnostics
export const SCREEN_SIGNATURES: ScreenSignature[] = [
  // 1. Critical Error Banner takes top precedence
  {
    screenType: 'WINDOWS_HOTSPOT_ERROR',
    requiredKeywords: [
      ['we cant set up mobile hotspot', 'cant set up mobile hotspot', 'cant set up'],
      ['ethernet', 'wi fi', 'wifi', 'connection', 'cellular', 'turn on wi fi']
    ],
    keyElementPatterns: {
      error_banner: /cant\s+set\s+up\s+mobile\s+hotspot|we\s+cant\s+set\s+up/i,
      action_link: /settings|go\s+to\s+settings/i,
    },
    minimumConfidence: 0.70,
  },
  // 2. Active Verified Broadcasting State
  {
    screenType: 'WINDOWS_HOTSPOT_ACTIVE',
    requiredKeywords: [
      ['mobile hotspot', 'hotspot'],
      ['devices connected', '0 of', '1 of', '2 of', 'devices']
    ],
    forbiddenKeywords: ['we cant set up', 'cant set up'],
    keyElementPatterns: {
      status_label: /devices\s+connected|share\s+over/i,
      hotspot_toggle: /mobile\s+hotspot/i,
    },
    minimumConfidence: 0.70,
  },
  // 3. Dedicated Mobile Hotspot Settings Page
  {
    screenType: 'WINDOWS_SETTINGS_MOBILE_HOTSPOT',
    requiredKeywords: [
      ['mobile hotspot', 'hotspot'],
      ['share my internet', 'share over', 'share my internet connection', 'properties', 'power saving']
    ],
    forbiddenKeywords: ['we cant set up', 'cant set up', 'devices connected'],
    keyElementPatterns: {
      hotspot_switch: /mobile\s+hotspot/i,
      share_over_dropdown: /share\s+over/i,
      band_selector: /network\s+band/i,
      edit_properties_btn: /properties|edit/i,
    },
    minimumConfidence: 0.70,
  },
  // 4. Quick Settings Flyout
  {
    screenType: 'WINDOWS_QUICK_SETTINGS',
    requiredKeywords: [
      ['quick settings', 'wi fi', 'bluetooth', 'airplane mode', 'mobile hotspot', 'night light'],
      ['wi fi', 'wifi', 'bluetooth', 'mobile hotspot', 'airplane']
    ],
    forbiddenKeywords: ['share my internet', 'devices connected', 'we cant set up', 'cant set up'],
    keyElementPatterns: {
      mobile_hotspot_tile: /mobile\s+hotspot/i,
      wifi_tile: /wi\s*fi/i,
      bluetooth_tile: /bluetooth/i,
    },
    minimumConfidence: 0.65,
  },
  // 5. Network & Internet Main Settings Page
  {
    screenType: 'WINDOWS_SETTINGS_NETWORK',
    requiredKeywords: [
      ['network internet', 'network and internet', 'network'],
      ['advanced network settings', 'data usage', 'vpn', 'ethernet']
    ],
    forbiddenKeywords: ['we cant set up', 'cant set up', 'share my internet', 'devices connected'],
    keyElementPatterns: {
      mobile_hotspot_item: /mobile\s+hotspot/i,
      wifi_item: /wi\s*fi/i,
      ethernet_item: /ethernet/i,
    },
    minimumConfidence: 0.65,
  },
  // 6. Windows Desktop / Taskbar
  {
    screenType: 'WINDOWS_DESKTOP_TASKBAR',
    requiredKeywords: [
      ['start', 'search', 'widgets', 'copilot'],
      ['eng', 'am', 'pm', '7', '8', '9', '10', '11', '12']
    ],
    forbiddenKeywords: ['mobile hotspot', 'quick settings', 'share my internet'],
    keyElementPatterns: {
      network_icon: /eng|am|pm|search|start/i,
    },
    minimumConfidence: 0.60,
  },
];

export class ScreenClassifier {
  private recentHistory: RecognizedScreenType[] = [];
  private readonly historyCapacity = 3;

  /**
   * Classifies an OCR result into one of the supported Windows screen states.
   */
  public classify(ocr: OCRResult): ScreenClassification {
    const norm = normalizeText(ocr.rawText);

    if (norm.length < 5 || ocr.elements.length === 0) {
      return this.buildUnknownResult('Screen obscured or no text detected');
    }

    let bestMatch: ScreenClassification = this.buildUnknownResult('No matching signature');
    let highestScore = 0;

    for (const sig of SCREEN_SIGNATURES) {
      // Check forbidden keywords if specified
      if (sig.forbiddenKeywords) {
        const hasForbidden = sig.forbiddenKeywords.some(fk => norm.includes(normalizeText(fk)));
        if (hasForbidden) continue;
      }

      // Check required keyword OR-groups
      let matchedGroups = 0;
      const matchedKeywords: string[] = [];

      for (const group of sig.requiredKeywords) {
        let groupMatched = false;
        for (const kw of group) {
          const normKw = normalizeText(kw);
          if (norm.includes(normKw)) {
            matchedKeywords.push(kw);
            groupMatched = true;
            break;
          }
        }
        if (groupMatched) {
          matchedGroups++;
        }
      }

      const groupScore = matchedGroups / sig.requiredKeywords.length;

      if (groupScore >= 0.8) {
        // Find key elements and their bounding boxes
        const identifiedElements: Record<string, any> = {};
        let elementsFound = 0;
        const totalKeys = Object.keys(sig.keyElementPatterns);

        for (const [key, pattern] of Object.entries(sig.keyElementPatterns)) {
          for (const el of ocr.elements) {
            const normEl = normalizeText(el.text);
            if (pattern.test(el.text) || pattern.test(normEl)) {
              identifiedElements[key] = el.boundingBox;
              elementsFound++;
              break;
            }
          }
        }

        const elementBonus = totalKeys.length > 0 ? (elementsFound / totalKeys.length) * 0.2 : 0;
        // Priority weight: error signatures get a slight priority bump
        const priorityBump = sig.screenType === 'WINDOWS_HOTSPOT_ERROR' ? 0.15 : 0;
        const confidence = Math.min(1.0, groupScore * 0.8 + elementBonus + priorityBump);

        if (confidence >= sig.minimumConfidence && confidence > highestScore) {
          highestScore = confidence;
          bestMatch = {
            screenType: sig.screenType,
            confidence: Number(confidence.toFixed(2)),
            matchedKeywords,
            identifiedElements,
            rawSnippet: ocr.rawText.slice(0, 120),
            timestamp: Date.now(),
          };
        }
      }
    }

    // Apply debounce / hysteresis smoothing to prevent state flicker
    if (bestMatch.screenType !== 'UNKNOWN_SCREEN') {
      const smoothedType = this.applyHysteresis(bestMatch.screenType);
      bestMatch.screenType = smoothedType;
    } else {
      this.recentHistory.push('UNKNOWN_SCREEN');
      if (this.recentHistory.length > this.historyCapacity) {
        this.recentHistory.shift();
      }
    }

    return bestMatch;
  }

  /**
   * Applies anti-flapping logic. Requires persistent detections before shifting away from a stable state.
   */
  private applyHysteresis(candidate: RecognizedScreenType): RecognizedScreenType {
    this.recentHistory.push(candidate);
    if (this.recentHistory.length > this.historyCapacity) {
      this.recentHistory.shift();
    }

    const counts: Record<string, number> = {};
    for (const t of this.recentHistory) {
      counts[t] = (counts[t] || 0) + 1;
    }

    for (const [type, count] of Object.entries(counts)) {
      if (count >= 2 && type !== 'UNKNOWN_SCREEN') {
        return type as RecognizedScreenType;
      }
    }

    return candidate;
  }

  public reset(): void {
    this.recentHistory = [];
  }

  private buildUnknownResult(reason: string): ScreenClassification {
    return {
      screenType: 'UNKNOWN_SCREEN',
      confidence: 0,
      matchedKeywords: [],
      identifiedElements: {},
      rawSnippet: reason,
      timestamp: Date.now(),
    };
  }
}
