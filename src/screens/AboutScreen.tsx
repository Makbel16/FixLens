import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/Card';
import colors from '../theme/colors';

interface AboutScreenProps {
  onBack: () => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ onBack }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About FixLens</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.brandHero}>
          <Text style={styles.brandTitle}>⚡ FixLens v1.0.0</Text>
          <Text style={styles.brandSubtitle}>
            Real-Time AI Computer Troubleshooting Mobile Assistant
          </Text>
        </View>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>🎯 Mission & Core Philosophy</Text>
          <Text style={styles.cardBody}>
            FixLens is engineered to bridge the gap between complex computer errors and everyday users. Rather than relying on static help articles or generic chatbots, FixLens turns your smartphone into a computer vision technician that visually identifies controls on your actual PC screen and guides you with real-time AR highlights.
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>💰 Zero-Budget & Local-First</Text>
          <Text style={styles.cardBody}>
            FixLens operates entirely on-device using local computer vision and heuristics. It requires zero cloud subscriptions, zero external API tokens, and zero paid infrastructure.
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>🔒 Privacy & Data Protection</Text>
          <Text style={styles.cardBody}>
            Your screen never leaves your device. Live frames from your camera are held transiently in RAM solely for OCR extraction and immediately garbage-collected. No screenshots or recordings are transmitted over the internet.
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>🛡️ Safety Guarantees</Text>
          <Text style={styles.cardBody}>
            FixLens does not execute automated remote shell commands on your PC. You remain in physical control of your computer at all times.
          </Text>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Built for Android with React Native & TypeScript</Text>
          <Text style={styles.footerSubtext}>Open Source & Local Intelligence</Text>
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
  brandHero: {
    alignItems: 'center',
    marginVertical: 16,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  footerText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  footerSubtext: {
    fontSize: 11,
    color: colors.textDim,
    marginTop: 2,
  },
});

export default AboutScreen;
