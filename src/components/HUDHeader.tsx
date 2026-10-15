import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../theme/colors';

interface HUDHeaderProps {
  workflowTitle: string;
  isPaused: boolean;
  debugMode: boolean;
  onTogglePause: () => void;
  onToggleDebug: () => void;
  onExit: () => void;
}

export const HUDHeader: React.FC<HUDHeaderProps> = ({
  workflowTitle,
  isPaused,
  debugMode,
  onTogglePause,
  onToggleDebug,
  onExit,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity activeOpacity={0.7} style={styles.iconButton} onPress={onExit}>
        <Text style={styles.iconButtonText}>✕</Text>
      </TouchableOpacity>

      <View style={styles.centerSection}>
        <View style={styles.liveIndicator}>
          <View style={[styles.pulseDot, isPaused && styles.pulseDotPaused]} />
          <Text style={styles.liveText}>{isPaused ? 'PAUSED' : 'LIVE AI SCAN'}</Text>
        </View>
        <Text numberOfLines={1} style={styles.workflowText}>
          {workflowTitle}
        </Text>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.smallButton, debugMode && styles.smallButtonActive]}
          onPress={onToggleDebug}
        >
          <Text style={[styles.smallButtonText, debugMode && styles.smallButtonTextActive]}>
            OCR
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.iconButton, isPaused && styles.pausedButton]}
          onPress={onTogglePause}
        >
          <Text style={styles.iconButtonText}>{isPaused ? '▶' : '⏸'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: 'rgba(11, 15, 25, 0.75)',
  },
  centerSection: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  pulseDotPaused: {
    backgroundColor: colors.warning,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  workflowText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(31, 44, 68, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  pausedButton: {
    borderColor: colors.warning,
    backgroundColor: colors.warningGlow,
  },
  iconButtonText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  smallButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(31, 44, 68, 0.8)',
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  smallButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryGlow,
  },
  smallButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  smallButtonTextActive: {
    color: colors.primary,
  },
});

export default HUDHeader;
