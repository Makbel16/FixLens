import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppSettings {
  lowPerformanceMode: boolean;
  ocrConfidenceThreshold: number; // 0.5 to 0.95
  autoAdvanceEnabled: boolean;
  showDebugBoundingBoxes: boolean;
  voiceGuidance: boolean;
  cameraFpsThrottlingMs: number; // e.g. 600ms default, 1200ms in low-power
}

export const DEFAULT_SETTINGS: AppSettings = {
  lowPerformanceMode: false,
  ocrConfidenceThreshold: 0.65,
  autoAdvanceEnabled: true,
  showDebugBoundingBoxes: false,
  voiceGuidance: false,
  cameraFpsThrottlingMs: 600,
};

const SETTINGS_KEY = '@fixlens_settings_v1';

export class SettingsStorage {
  public static async loadSettings(): Promise<AppSettings> {
    try {
      const raw = await AsyncStorage.getItem(SETTINGS_KEY);
      if (!raw) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  public static async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  }

  public static async resetSettings(): Promise<AppSettings> {
    try {
      await AsyncStorage.removeItem(SETTINGS_KEY);
    } catch (e) {
      console.warn('Failed to reset settings:', e);
    }
    return DEFAULT_SETTINGS;
  }
}
