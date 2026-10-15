import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';
import { BoundingBox } from '../types/ocr';

interface TargetBoundingBoxProps {
  box: BoundingBox;
  label?: string | null;
  subtext?: string;
}

export const TargetBoundingBox: React.FC<TargetBoundingBoxProps> = ({
  box,
  label,
  subtext,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  if (!box || box.width <= 0 || box.height <= 0) {
    return null;
  }

  // Ensure minimum clickable/viewable size
  const renderWidth = Math.max(60, box.width);
  const renderHeight = Math.max(40, box.height);

  return (
    <View
      pointerEvents="none"
      style={[
        styles.container,
        {
          left: box.x,
          top: box.y,
          width: renderWidth,
          height: renderHeight,
        },
      ]}
    >
      {/* Outer pulsing glow */}
      <Animated.View
        style={[
          styles.glowBorder,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />

      {/* Main target box */}
      <View style={styles.boxBorder}>
        {/* Corner Reticles */}
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />
      </View>

      {/* Target Indicator Label & Arrow */}
      {label ? (
        <View style={styles.labelContainer}>
          <View style={styles.arrow} />
          <View style={styles.labelBadge}>
            <Text style={styles.labelText}>{label.toUpperCase()}</Text>
            {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowBorder: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderWidth: 2,
    borderColor: colors.primaryGlow,
    borderRadius: 8,
    backgroundColor: colors.targetFill,
  },
  boxBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  corner: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderColor: colors.primary,
  },
  cornerTL: {
    top: -2,
    left: -2,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTR: {
    top: -2,
    right: -2,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBL: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBR: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  labelContainer: {
    position: 'absolute',
    bottom: -38,
    alignItems: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.primary,
  },
  labelBadge: {
    backgroundColor: '#07101E',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  labelText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  subtext: {
    fontSize: 9,
    color: colors.textSecondary,
  },
});

export default TargetBoundingBox;
