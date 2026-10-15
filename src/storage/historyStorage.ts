import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HistoryRecord {
  id: string;
  workflowId: string;
  workflowTitle: string;
  timestamp: number;
  status: 'RESOLVED' | 'UNRESOLVED' | 'ERROR_DETECTED' | 'DISMISSED';
  stepsCompleted: number;
  totalSteps: number;
  notes?: string;
}

const HISTORY_KEY = '@fixlens_scan_history_v1';

export class HistoryStorage {
  public static async getHistory(): Promise<HistoryRecord[]> {
    try {
      const raw = await AsyncStorage.getItem(HISTORY_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public static async addRecord(record: Omit<HistoryRecord, 'id'>): Promise<void> {
    try {
      const current = await this.getHistory();
      const newRecord: HistoryRecord = {
        ...record,
        id: `scan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      };
      const updated = [newRecord, ...current].slice(0, 50); // Keep last 50
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to add scan record:', e);
    }
  }

  public static async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      console.warn('Failed to clear history:', e);
    }
  }
}
