export const colors = {
  primary: '#3dad49', // Mid-tone green
  primaryDark: '#2c8135',
  primaryLight: '#eaf7eb',

  secondary: '#3b82f6', // Vibrant blue as secondary
  secondaryDark: '#1d4ed8',

  background: '#F9FAFB',
  surface: '#FFFFFF',

  text: '#111827',
  textSecondary: '#4B5563',
  textLight: '#9CA3AF',
  textOnPrimary: '#FFFFFF',

  border: '#E5E7EB',
  error: '#EF4444',
  success: '#3dad49',
  warning: '#F59E0B',

  black: '#000000',
  white: '#FFFFFF',
  backGroundGrey: '#F1F2F6',

  dark: {
    primary: '#4ade80',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: '#334155',
  },
} as const;

export const COLORS = colors;

export type Colors = typeof colors;
export type ThemeColor = keyof Omit<Colors, 'dark'>;

export const getColors = (mode: 'light' | 'dark') => {
  if (mode === 'dark') {
    return {
      ...colors,
      primary: colors.dark.primary,
      background: colors.dark.background,
      surface: colors.dark.surface,
      text: colors.dark.text,
      textSecondary: colors.dark.textSecondary,
      border: colors.dark.border,
    };
  }
  return colors;
};
