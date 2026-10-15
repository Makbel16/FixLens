import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

interface GuidesLibraryScreenProps {
  onSelectWorkflow: (workflow: TroubleshootingWorkflow) => void;
  onBack: () => void;
}

export const GuidesLibraryScreen: React.FC<GuidesLibraryScreenProps> = ({
  onSelectWorkflow,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'NETWORK', 'UPDATE'];

  const filteredWorkflows = WORKFLOWS_REGISTRY.filter(wf => {
    const matchesCategory = selectedCategory === 'ALL' || wf.category === selectedCategory;
    const matchesSearch =
      wf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wf.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Troubleshooting Library</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search computer issues (e.g. Hotspot, Wi-Fi, Update)..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Pills */}
      <View style={styles.categoryRow}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.catPill, selectedCategory === cat && styles.catPillActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.catPillText,
                selectedCategory === cat && styles.catPillTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {filteredWorkflows.map(wf => (
          <Card key={wf.workflowId} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{wf.category}</Text>
              </View>
              <Text style={styles.stepsCount}>{wf.steps.length} Steps</Text>
            </View>

            <Text style={styles.title}>{wf.title}</Text>
            <Text style={styles.desc}>{wf.fullDescription}</Text>

            <Button
              title="Launch Visual Scan"
              variant="primary"
              style={styles.startBtn}
              onPress={() => onSelectWorkflow(wf)}
            />
          </Card>
        ))}

        {filteredWorkflows.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No Guides Found</Text>
            <Text style={styles.emptySubtitle}>Try searching for another keyword or check category filters.</Text>
          </View>
        ) : null}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchInput: {
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: spacing.buttonRadius,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 14,
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surfaceCard,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  catPillActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryGlow,
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  catPillTextActive: {
    color: colors.primary,
  },
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
  },
  stepsCount: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  desc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  startBtn: {
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});

export default GuidesLibraryScreen;
