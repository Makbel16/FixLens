import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Card from '../components/Card';
import { WORKFLOWS_REGISTRY } from '../engine/workflows';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { TroubleshootingWorkflow } from '../types/troubleshooting';

interface HomeScreenProps {
  onStartScan: (workflow: TroubleshootingWorkflow) => void;
  onOpenLibrary: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartScan,
  onOpenLibrary,
  onOpenHistory,
  onOpenSettings,
  onOpenAbout,
}) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<TroubleshootingWorkflow>(
    WORKFLOWS_REGISTRY[0]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brandTitle}>FixLens</Text>
            <Text style={styles.brandSubtitle}>AI Screen Diagnostic System</Text>
          </View>
          <TouchableOpacity
            style={styles.settingsIconBtn}
            activeOpacity={0.7}
            onPress={onOpenSettings}
          >
            <Text style={styles.settingsIconText}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Live Scan Hero Card */}
        <Card glow highlightColor={colors.primary} style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.heroBadgeText}>READY TO SCAN</Text>
          </View>

          <Text style={styles.heroWorkflowTitle}>{selectedWorkflow.title}</Text>
          <Text style={styles.heroWorkflowDesc}>{selectedWorkflow.shortDescription}</Text>

          <Button
            title="Start Live Scan"
            variant="primary"
            style={styles.scanButton}
            onPress={() => onStartScan(selectedWorkflow)}
          />

          <View style={styles.heroMetaRow}>
            <Text style={styles.heroMetaText}>⚡ {selectedWorkflow.steps.length} Steps</Text>
            <Text style={styles.heroMetaText}>🔒 100% On-Device</Text>
            <Text style={styles.heroMetaText}>🌐 Offline Ready</Text>
          </View>
        </Card>

        {/* Workflow Switcher List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Select Troubleshooting Target</Text>
          <TouchableOpacity onPress={onOpenLibrary}>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {WORKFLOWS_REGISTRY.map(wf => {
          const isSelected = wf.workflowId === selectedWorkflow.workflowId;
          return (
            <TouchableOpacity
              key={wf.workflowId}
              activeOpacity={0.8}
              onPress={() => setSelectedWorkflow(wf)}
            >
              <Card
                style={[styles.workflowCard, isSelected && styles.selectedWorkflowCard]}
                highlightColor={isSelected ? colors.primary : undefined}
              >
                <View style={styles.workflowCardContent}>
                  <Text style={styles.wfIcon}>
                    {wf.category === 'NETWORK' ? '📶' : wf.category === 'UPDATE' ? '🔄' : '💻'}
                  </Text>
                  <View style={styles.wfTextSection}>
                    <Text
                      style={[
                        styles.wfTitle,
                        isSelected && { color: colors.primary },
                      ]}
                    >
                      {wf.title}
                    </Text>
                    <Text numberOfLines={1} style={styles.wfDesc}>
                      {wf.shortDescription}
                    </Text>
                  </View>
                  {isSelected ? (
                    <View style={styles.checkBadge}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  ) : null}
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}

        {/* Quick Nav Grid */}
        <View style={styles.navGrid}>
          <TouchableOpacity
            style={styles.navTile}
            activeOpacity={0.7}
            onPress={onOpenLibrary}
          >
            <Text style={styles.navTileIcon}>📚</Text>
            <Text style={styles.navTileLabel}>Guides Library</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navTile}
            activeOpacity={0.7}
            onPress={onOpenHistory}
          >
            <Text style={styles.navTileIcon}>🕒</Text>
            <Text style={styles.navTileLabel}>Scan History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navTile}
            activeOpacity={0.7}
            onPress={onOpenSettings}
          >
            <Text style={styles.navTileIcon}>🛠️</Text>
            <Text style={styles.navTileLabel}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navTile}
            activeOpacity={0.7}
            onPress={onOpenAbout}
          >
            <Text style={styles.navTileIcon}>ℹ️</Text>
            <Text style={styles.navTileLabel}>About</Text>
          </TouchableOpacity>
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
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  settingsIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  settingsIconText: {
    fontSize: 18,
  },
  heroCard: {
    backgroundColor: '#0F172A',
    borderColor: colors.primaryDark,
    marginBottom: 24,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryGlow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  heroWorkflowTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  heroWorkflowDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  scanButton: {
    marginBottom: 14,
  },
  heroMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
  heroMetaText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  seeAllText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  workflowCard: {
    marginBottom: 10,
    padding: 14,
  },
  selectedWorkflowCard: {
    backgroundColor: '#16233B',
    borderColor: colors.primary,
  },
  workflowCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wfIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  wfTextSection: {
    flex: 1,
  },
  wfTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  wfDesc: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  checkBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0A0E17',
  },
  navGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 24,
  },
  navTile: {
    width: '48%',
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: spacing.cardRadius,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  navTileIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  navTileLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});

export default HomeScreen;
