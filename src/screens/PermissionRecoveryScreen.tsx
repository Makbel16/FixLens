import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Card from '../components/Card';
import colors from '../theme/colors';

interface PermissionRecoveryScreenProps {
  onRequestPermission: () => void;
  onBack: () => void;
}

export const PermissionRecoveryScreen: React.FC<PermissionRecoveryScreenProps> = ({
  onRequestPermission,
  onBack,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>📷</Text>
        </View>

        <Text style={styles.title}>Camera Access Disabled</Text>
        <Text style={styles.subtitle}>
          FixLens relies on real-time camera computer vision to inspect your computer screen, identify errors, and align AR guidance highlights.
        </Text>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>Why camera access is safe with FixLens:</Text>
          <Text style={styles.infoBullet}>• 100% On-Device: Frames are analyzed in temporary RAM.</Text>
          <Text style={styles.infoBullet}>• Zero Uploads: No images or videos are sent to the cloud.</Text>
          <Text style={styles.infoBullet}>• Discarded Instantly: Memory is flushed after every scan step.</Text>
        </Card>

        <View style={styles.btnRow}>
          <Button
            title="Enable Camera Access"
            variant="primary"
            style={styles.primaryBtn}
            onPress={onRequestPermission}
          />
          <Button title="Return to Dashboard" variant="secondary" onPress={onBack} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primaryGlow,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 42,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  infoCard: {
    width: '100%',
    marginBottom: 28,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  infoBullet: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 6,
  },
  btnRow: {
    width: '100%',
  },
  primaryBtn: {
    marginBottom: 12,
  },
});

export default PermissionRecoveryScreen;
