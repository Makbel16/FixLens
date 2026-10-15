import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Card from '../components/Card';
import { AppSettings, DEFAULT_SETTINGS, SettingsStorage } from '../storage/settingsStorage';
import colors from '../theme/colors';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    SettingsStorage.loadSettings().then(setSettings);
  }, []);

  const updateSetting = async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    await SettingsStorage.saveSettings(updated);
  };

  const handleResetSettings = () => {
    Alert.alert('Reset Settings', 'Restore all troubleshooting and camera settings to default values?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          const def = await SettingsStorage.resetSettings();
          setSettings(def);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Performance & Camera */}
        <Text style={styles.sectionHeader}>PERFORMANCE & VISION</Text>
        <Card style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Low-Performance Mode</Text>
              <Text style={styles.settingDesc}>
                Reduces OCR frame analysis frequency to save battery and reduce phone heating.
              </Text>
            </View>
            <Switch
              value={settings.lowPerformanceMode}
              onValueChange={v => updateSetting('lowPerformanceMode', v)}
              trackColor={{ false: colors.surfaceBorder, true: colors.primary }}
              thumbColor={settings.lowPerformanceMode ? '#FFFFFF' : '#888888'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Autonomous Progression</Text>
              <Text style={styles.settingDesc}>
                Automatically updates instructions when your computer screen changes without tapping Next.
              </Text>
            </View>
            <Switch
              value={settings.autoAdvanceEnabled}
              onValueChange={v => updateSetting('autoAdvanceEnabled', v)}
              trackColor={{ false: colors.surfaceBorder, true: colors.primary }}
              thumbColor={settings.autoAdvanceEnabled ? '#FFFFFF' : '#888888'}
            />
          </View>
        </Card>

        {/* Developer & Debug */}
        <Text style={styles.sectionHeader}>DEBUGGING & DIAGNOSTICS</Text>
        <Card style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Show Debug OCR Readout</Text>
              <Text style={styles.settingDesc}>
                Renders detected OCR text strings and confidence bars at top of live view.
              </Text>
            </View>
            <Switch
              value={settings.showDebugBoundingBoxes}
              onValueChange={v => updateSetting('showDebugBoundingBoxes', v)}
              trackColor={{ false: colors.surfaceBorder, true: colors.primary }}
              thumbColor={settings.showDebugBoundingBoxes ? '#FFFFFF' : '#888888'}
            />
          </View>
        </Card>

        {/* Reset Actions */}
        <Button
          title="Restore Default Settings"
          variant="secondary"
          style={styles.resetBtn}
          onPress={handleResetSettings}
        />
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
  container: {
    padding: 16,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
    marginTop: 14,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceBorder,
    marginVertical: 12,
  },
  resetBtn: {
    marginTop: 10,
  },
});

export default SettingsScreen;
