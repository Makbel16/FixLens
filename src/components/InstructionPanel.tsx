import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { RecognizedScreenType } from '../types/screen';
import { TroubleshootingStep, UserAction } from '../types/troubleshooting';
import ScreenBadge from './ScreenBadge';

interface InstructionPanelProps {
  step: TroubleshootingStep;
  currentScreen: RecognizedScreenType;
  confidence: number;
  onUserAction: (action: UserAction) => void;
  unknownFramesCount?: number;
}

export const InstructionPanel: React.FC<InstructionPanelProps> = ({
  step,
  currentScreen,
  confidence,
  onUserAction,
  unknownFramesCount = 0,
}) => {
  const isUnknownProlonged = unknownFramesCount >= 5;

  return (
    <View style={styles.card}>
      {/* Top Bar: Screen Badge & Step counter */}
      <View style={styles.topRow}>
        <ScreenBadge screenType={currentScreen} confidence={confidence} />
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>
            STEP {step.stepNumber} / {step.totalSteps}
          </Text>
        </View>
      </View>

      {/* Main Guidance Text */}
      <View style={styles.contentSection}>
        <Text style={styles.stepTitle}>{step.title}</Text>
        <Text style={styles.instructionText}>{step.instruction}</Text>

        {isUnknownProlonged ? (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ Screen unrecognized: Hold phone steady, eliminate screen glare, and keep the PC window fully visible.
            </Text>
          </View>
        ) : (
          <Text style={styles.tipText}>💡 {step.detailedTip}</Text>
        )}
      </View>

      {/* Action Buttons Row */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.actionBtn}
          onPress={() => onUserAction('BACK')}
          disabled={step.stepNumber <= 1}
        >
          <Text style={[styles.actionBtnText, step.stepNumber <= 1 && styles.disabledText]}>
            ◀ Back
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.actionBtn}
          onPress={() => onUserAction('REPEAT')}
        >
          <Text style={styles.actionBtnText}>🔄 Repeat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.actionBtn}
          onPress={() => onUserAction('SKIP')}
        >
          <Text style={styles.actionBtnText}>Skip ▶</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.actionBtn, styles.notWorkingBtn]}
          onPress={() => onUserAction('NOT_WORKING')}
        >
          <Text style={styles.notWorkingBtnText}>❓ Help</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepBadge: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  contentSection: {
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  warningBox: {
    backgroundColor: colors.warningGlow,
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  warningText: {
    fontSize: 12,
    color: colors.warning,
    lineHeight: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: 8,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  disabledText: {
    color: colors.textDim,
  },
  notWorkingBtn: {
    borderColor: colors.primaryDark,
    backgroundColor: 'rgba(0, 180, 216, 0.15)',
  },
  notWorkingBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default InstructionPanel;
