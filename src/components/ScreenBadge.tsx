import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { RecognizedScreenType } from '../types/screen';

interface ScreenBadgeProps {
  screenType: RecognizedScreenType;
  confidence: number;
}

export const ScreenBadge: React.FC<ScreenBadgeProps> = ({ screenType, confidence }) => {
  const getBadgeConfig = () => {
    switch (screenType) {
      case 'WINDOWS_DESKTOP_TASKBAR':
        return {
          label: 'Windows Desktop / Taskbar',
          color: colors.info,
          bg: 'rgba(56, 189, 248, 0.15)',
        };
      case 'WINDOWS_QUICK_SETTINGS':
        return {
          label: 'Quick Settings Panel',
          color: colors.primary,
          bg: colors.primaryGlow,
        };
      case 'WINDOWS_SETTINGS_NETWORK':
        return {
          label: 'Network & Internet Settings',
          color: colors.primaryDark,
          bg: 'rgba(0, 180, 216, 0.15)',
        };
      case 'WINDOWS_SETTINGS_MOBILE_HOTSPOT':
        return {
          label: 'Mobile Hotspot Settings',
          color: colors.primary,
          bg: colors.primaryGlow,
        };
      case 'WINDOWS_HOTSPOT_ERROR':
        return {
          label: 'Hotspot Error Detected',
          color: colors.error,
          bg: colors.errorGlow,
        };
      case 'WINDOWS_HOTSPOT_ACTIVE':
        return {
          label: 'Hotspot Active & Verified',
          color: colors.success,
          bg: colors.successGlow,
        };
      case 'UNKNOWN_SCREEN':
      default:
        return {
          label: 'Aim at Computer Screen',
          color: colors.warning,
          bg: colors.warningGlow,
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <View style={[styles.badge, { backgroundColor: config.bg, borderColor: config.color }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.text, { color: config.color }]}>
        {config.label}
      </Text>
      {screenType !== 'UNKNOWN_SCREEN' && confidence > 0 ? (
        <Text style={[styles.confidence, { color: config.color }]}>
          {Math.round(confidence * 100)}%
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: spacing.badgeRadius,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 8,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  confidence: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 6,
    opacity: 0.85,
  },
});

export default ScreenBadge;
