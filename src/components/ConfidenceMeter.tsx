import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';

interface ConfidenceMeterProps {
  confidence: number; // 0.0 to 1.0
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ confidence }) => {
  const pct = Math.min(100, Math.max(0, Math.round(confidence * 100)));

  const getColor = () => {
    if (pct >= 75) return colors.success;
    if (pct >= 50) return colors.warning;
    return colors.error;
  };

  return (
    <View style={styles.container}>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: getColor() }]} />
      </View>
      <Text style={[styles.label, { color: getColor() }]}>
        Recognition Confidence: {pct}%
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  barBackground: {
    height: 4,
    backgroundColor: colors.surfaceBorder,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
  },
});

export default ConfidenceMeter;
