import { StyleSheet } from 'react-native';
import { theme } from '@/theme';
import { getColors } from '@/theme/colors';

export const createStyles = (themeMode: 'light' | 'dark') => {
  const colors = getColors(themeMode);
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.screenPadding,
    },
    title: {
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    subtitle: {
      fontFamily: theme.typography.fonts.primary,
      fontSize: theme.typography.sizes.md,
      lineHeight: theme.typography.lineHeights.md,
      textAlign: 'center',
      fontWeight: theme.typography.weights.regular,
    },
    themeToggleButton: {
      marginTop: theme.spacing.lg,
    },
  });
};
