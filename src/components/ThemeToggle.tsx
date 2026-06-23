import React from 'react';
import { StyleSheet, Pressable, ViewStyle, StyleProp } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { getColors } from '@/theme/colors';

interface ThemeToggleProps {
  style?: StyleProp<ViewStyle>;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ style }) => {
  const { themeMode, toggleThemeMode } = useThemeStore();
  const colors = getColors(themeMode);
  const isDarkMode = themeMode === 'dark';

  return (
    <Pressable
      onPress={toggleThemeMode}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        pressed && styles.pressed,
        style,
      ]}
      accessibilityLabel="Toggle Theme"
      accessibilityRole="button"
    >
      {isDarkMode ? (
        <Sun size={20} color="#F59E0B" fill="#F59E0B" />
      ) : (
        <Moon size={20} color="#4B5563" fill="#4B5563" />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Premium shadow styles
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});

export default ThemeToggle;
