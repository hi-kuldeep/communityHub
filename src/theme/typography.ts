import { Platform } from 'react-native';

export const typography = {
  fonts: {
    primary: Platform.select({
      ios: 'System',
      android: 'sans-serif',
      default: 'System',
    }),
    primaryMedium: Platform.select({
      ios: 'System',
      android: 'sans-serif-medium',
      default: 'System',
    }),
    primaryBold: Platform.select({
      ios: 'System',
      android: 'sans-serif-bold',
      default: 'System',
    }),
  },
  
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 30,
    xxl: 34,
    xxxl: 42,
  },
  
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  } as const,
  
  presets: {
    heading1: {
      fontSize: 32,
      lineHeight: 42,
      fontWeight: '700',
    },
    heading2: {
      fontSize: 24,
      lineHeight: 34,
      fontWeight: '700',
    },
    heading3: {
      fontSize: 20,
      lineHeight: 30,
      fontWeight: '600',
    },
    bodyLarge: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
    },
    bodyMedium: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
    },
    bodySmall: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400',
    },
    button: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600',
    },
  } as const,
} as const;

export type Typography = typeof typography;
export type TypographyPreset = keyof typeof typography.presets;
