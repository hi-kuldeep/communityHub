import { StyleSheet } from 'react-native';
import { theme } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.screenPadding,
  },
  title: {
    fontFamily: theme.typography.fonts.primaryBold,
    fontSize: theme.typography.sizes.xxl,
    lineHeight: theme.typography.lineHeights.xxl,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    fontWeight: theme.typography.weights.bold,
  },
  subtitle: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.md,
    lineHeight: theme.typography.lineHeights.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: theme.typography.weights.regular,
  },
});
