import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING } from '../../src/constants/theme';
import { useAppStore } from '../../src/store/useAppStore';

export default function DashboardScreen() {
  const router = useRouter();
  const profile = useAppStore((state) => state.profile);
  const wordStates = useAppStore((state) => state.wordStates);

  // Calculate review counts
  const now = Date.now();
  const dueCount = Object.values(wordStates).filter(
    (w) => w.nextReviewDate < now
  ).length;

  const startSession = (type: 'flashcard' | 'test') => {
    router.push({ pathname: '/session', params: { type } });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi, {profile.userId}</Text>
          <Text style={styles.subtext}>Ready to learn?</Text>
        </View>
        <View style={styles.tokenContainer}>
          <Ionicons name="diamond" size={20} color={COLORS.warning} />
          <Text style={styles.tokenText}>{profile.tokens}</Text>
        </View>
      </View>

      {/* Progress Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Goal</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: '40%' }]} />
          {/* Mocked 40% progress */}
        </View>
        <Text style={styles.progressText}>12 / {profile.dailyGoalWords} words learned</Text>
      </View>

      {/* Actions */}
      <Text style={styles.sectionTitle}>Start Learning</Text>

      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: COLORS.primary }]}
          onPress={() => startSession('flashcard')}
        >
          <Ionicons name="layers" size={32} color="white" />
          <Text style={styles.actionText}>Flashcards</Text>
          {dueCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{dueCount}</Text></View>}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: COLORS.secondary }]}
          onPress={() => startSession('test')}
        >
          <Ionicons name="create" size={32} color="white" />
          <Text style={styles.actionText}>Speed Quiz</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activity / Stats */}
      <Text style={styles.sectionTitle}>Your Stats</Text>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{profile.streakDays}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{profile.xp}</Text>
          <Text style={styles.statLabel}>Total XP</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{Object.keys(wordStates).length}</Text>
          <Text style={styles.statLabel}>Words</Text>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingTop: Platform.OS === 'web' ? SPACING.lg : 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtext: {
    fontSize: 16,
    color: COLORS.textDim,
  },
  tokenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceHighlight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tokenText: {
    color: COLORS.text,
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 16,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 16,
    marginBottom: SPACING.xl,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: COLORS.surfaceHighlight,
    borderRadius: 5,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.success,
  },
  progressText: {
    color: COLORS.textDim,
    fontSize: 14,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  actionCard: {
    flex: 1,
    height: 140,
    borderRadius: 16,
    padding: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  actionText: {
    color: 'white',
    marginTop: SPACING.sm,
    fontSize: 16,
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.error,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: COLORS.textDim,
    fontSize: 12,
    marginTop: 4,
  },
});
