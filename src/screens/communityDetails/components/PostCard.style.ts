import { StyleSheet } from 'react-native';
import { spacing } from '@/theme/spacing';

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.01,
    shadowRadius: 3,
    elevation: 1,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatar: {
    marginRight: spacing.sm,
  },
  authorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  authorName: {
    fontWeight: '600',
  },
  sendingText: {
    fontStyle: 'italic',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  body: {
    lineHeight: 20,
  },
  errorContainer: {
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
  },
  errorText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  loaderContainer: {
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
  },
});

export default styles;
