import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Card from '../components/Card';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

interface WelcomeScreenProps {
  onStart: () => void;
  onExploreGuides: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onExploreGuides }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Branding */}
        <View style={styles.heroSection}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>⚡ FixLens</Text>
          </View>
          <Text style={styles.heroTitle}>AI Computer Troubleshooting</Text>
          <Text style={styles.heroSubtitle}>
            Point your camera at any computer screen. FixLens visually detects errors and guides you with real-time AR highlights.
          </Text>
        </View>

        {/* Core Value Props */}
        <View style={styles.featuresSection}>
          <Card style={styles.featureCard}>
            <Text style={styles.featureIcon}>👁️</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Real-Time Vision & OCR</Text>
              <Text style={styles.featureDesc}>
                Recognizes Windows menus, error banners, and buttons on-device without cloud lag.
              </Text>
            </View>
          </Card>

          <Card style={styles.featureCard}>
            <Text style={styles.featureIcon}>🎯</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>AR Visual Guidance</Text>
              <Text style={styles.featureDesc}>
                Draws dynamic tracking boxes and arrows directly over the computer controls you need to click.
              </Text>
            </View>
          </Card>

          <Card style={styles.featureCard}>
            <Text style={styles.featureIcon}>⚡</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Autonomous Progression</Text>
              <Text style={styles.featureDesc}>
                Detects when your computer screen updates and moves automatically to the next step.
              </Text>
            </View>
          </Card>

          <Card style={styles.featureCard}>
            <Text style={styles.featureIcon}>🔒</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>100% On-Device & Private</Text>
              <Text style={styles.featureDesc}>
                No photos are ever saved or uploaded. Runs completely free without subscriptions or API keys.
              </Text>
            </View>
          </Card>
        </View>

        {/* Call to Actions */}
        <View style={styles.actionSection}>
          <Button
            title="Start Live Troubleshooting"
            variant="primary"
            onPress={onStart}
            style={styles.primaryBtn}
          />
          <Button
            title="Browse Troubleshooting Library"
            variant="secondary"
            onPress={onExploreGuides}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.screenPadding,
    justifyContent: 'space-between',
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  logoBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: colors.primaryGlow,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  featuresSection: {
    marginBottom: 24,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 26,
    marginRight: 14,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  actionSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  primaryBtn: {
    marginBottom: 12,
  },
});

export default WelcomeScreen;
