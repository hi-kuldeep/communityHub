export const colors = {
  primary: '#3B82F6', // Vibrant blue
  primaryDark: '#1D4ED8',
  primaryLight: '#DBEAFE',
  
  secondary: '#10B981', // Emerald green
  secondaryDark: '#047857',
  
  background: '#F9FAFB',
  surface: '#FFFFFF',
  
  text: '#111827',
  textSecondary: '#4B5563',
  textLight: '#9CA3AF',
  textOnPrimary: '#FFFFFF',
  
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: '#334155',
  }
} as const;

export type Colors = typeof colors;
export type ThemeColor = keyof Omit<Colors, 'dark'>;
