import { StyleSheet } from 'react-native';
import { spacing } from '@/theme/spacing';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  communityName: {
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  description: {
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: spacing.md,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: '700',
    marginBottom: 2,
  },
  joinButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonText: {
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: spacing.xxl + 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postsLoadingContainer: {
    paddingVertical: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postsErrorContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButton: {
    marginTop: spacing.sm,
    minWidth: 100,
  },
});

export default styles;
