import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Card from '../components/Card';
import { HistoryRecord, HistoryStorage } from '../storage/historyStorage';
import colors from '../theme/colors';

interface ScanHistoryScreenProps {
  onBack: () => void;
}

export const ScanHistoryScreen: React.FC<ScanHistoryScreenProps> = ({ onBack }) => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  const loadHistory = async () => {
    const records = await HistoryStorage.getHistory();
    setHistory(records);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClearHistory = () => {
    Alert.alert('Clear History', 'Are you sure you want to delete all past scan records?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: async () => {
          await HistoryStorage.clearHistory();
          setHistory([]);
        },
      },
    ]);
  };

  const getStatusBadge = (status: HistoryRecord['status']) => {
    switch (status) {
      case 'RESOLVED':
        return { label: 'RESOLVED', color: colors.success, bg: colors.successGlow };
      case 'ERROR_DETECTED':
        return { label: 'ERROR DETECTED', color: colors.error, bg: colors.errorGlow };
      default:
        return { label: 'UNRESOLVED', color: colors.warning, bg: colors.warningGlow };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan History</Text>
        {history.length > 0 ? (
          <TouchableOpacity onPress={handleClearHistory}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 36 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {history.map(record => {
          const badge = getStatusBadge(record.status);
          const dateStr = new Date(record.timestamp).toLocaleString();

          return (
            <Card key={record.id} style={styles.recordCard}>
              <View style={styles.recordHeader}>
                <View style={[styles.statusBadge, { backgroundColor: badge.bg, borderColor: badge.color }]}>
                  <Text style={[styles.statusText, { color: badge.color }]}>{badge.label}</Text>
                </View>
                <Text style={styles.dateText}>{dateStr}</Text>
              </View>

              <Text style={styles.workflowTitle}>{record.workflowTitle}</Text>
              <Text style={styles.stepsText}>
                Completed {record.stepsCompleted} of {record.totalSteps} steps
              </Text>
            </Card>
          );
        })}

        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📜</Text>
            <Text style={styles.emptyTitle}>No Scan History</Text>
            <Text style={styles.emptySubtitle}>
              When you troubleshoot computer problems with the live camera, diagnostic results will appear here.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  clearText: {
    fontSize: 13,
    color: colors.error,
    fontWeight: '700',
  },
  container: {
    padding: 16,
  },
  recordCard: {
    marginBottom: 12,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dateText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  workflowTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  stepsText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default ScanHistoryScreen;
