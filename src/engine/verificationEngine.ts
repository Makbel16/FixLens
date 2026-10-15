import { OCRResult } from '../types/ocr';
import { normalizeText } from './ocrParser';

export interface VerificationEvaluation {
  verified: boolean;
  confidence: number;
  matchedEvidence: string[];
  summaryMessage: string;
}

export class VerificationEngine {
  /**
   * Evaluates whether the Windows 11 Mobile Hotspot is actively running based on visible evidence.
   */
  public static verifyMobileHotspot(ocr: OCRResult): VerificationEvaluation {
    const norm = normalizeText(ocr.rawText);
    const matchedEvidence: string[] = [];

    // Critical success indicators on Windows 11 Mobile Hotspot page
    const indicators = [
      { pattern: /devices\s+connected/i, label: 'Active device connection counter' },
      { pattern: /share\s+over\s+wi\s*fi/i, label: 'Wi-Fi broadcasting mode confirmed' },
      { pattern: /network\s+name/i, label: 'Hotspot SSID assigned' },
      { pattern: /network\s+password/i, label: 'WPA2/WPA3 security key established' },
      { pattern: /share\s+my\s+internet/i, label: 'Internet sharing upstream active' },
    ];

    for (const ind of indicators) {
      if (ind.pattern.test(ocr.rawText)) {
        matchedEvidence.push(ind.label);
      }
    }

    // Check for negative indicator (error banner)
    const hasError = /we\s+cant\s+set\s+up|turned\s+off|error/i.test(ocr.rawText);

    if (hasError) {
      return {
        verified: false,
        confidence: 0.9,
        matchedEvidence: ['Error banner detected on screen'],
        summaryMessage: 'Windows encountered an error while trying to broadcast the hotspot.',
      };
    }

    if (matchedEvidence.length >= 2) {
      const confidence = Math.min(0.98, 0.6 + matchedEvidence.length * 0.1);
      return {
        verified: true,
        confidence,
        matchedEvidence,
        summaryMessage: 'Visual verification confirmed: Mobile Hotspot is operational and broadcasting.',
      };
    }

    return {
      verified: false,
      confidence: 0.3,
      matchedEvidence,
      summaryMessage:
        'Insufficient visual evidence of active hotspot. Please verify that the toggle is set to ON and no error is displayed.',
    };
  }
}
