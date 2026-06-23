import { FONTS } from './fonts';

export const typography = {
  fonts: {
    primary: FONTS.regular,
    primaryMedium: FONTS.medium,
    primarySemiBold: FONTS.semiBold,
    primaryBold: FONTS.bold,
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
      fontFamily: FONTS.bold,
      fontSize: 32,
      lineHeight: 42,
      fontWeight: '700',
    },
    heading2: {
      fontFamily: FONTS.bold,
      fontSize: 24,
      lineHeight: 34,
      fontWeight: '700',
    },
    heading3: {
      fontFamily: FONTS.semiBold,
      fontSize: 20,
      lineHeight: 30,
      fontWeight: '600',
    },
    bodyLarge: {
      fontFamily: FONTS.regular,
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
    },
    bodyMedium: {
      fontFamily: FONTS.regular,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
    },
    bodySmall: {
      fontFamily: FONTS.regular,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400',
    },
    button: {
      fontFamily: FONTS.semiBold,
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600',
    },
  } as const,
} as const;

export type Typography = typeof typography;
export type TypographyPreset = keyof typeof typography.presets;
