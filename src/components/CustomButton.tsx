import React from 'react';
import {
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '@/theme';
import { getColors } from '@/theme/colors';
import { useThemeStore } from '@/store/useThemeStore';
import CustomText from './CustomText';

// ─── Gradient colours ─────────────────────────────────────────────────────────

const GRADIENT_ACTIVE: [string, string] = ['#3DAD49', '#98D32B'];
const GRADIENT_DISABLED: [string, string] = ['#B0BEC5', '#CFD8DC'];

const gradientColors = (isDisabled: boolean): [string, string] =>
  isDisabled ? GRADIENT_DISABLED : GRADIENT_ACTIVE;

export interface CustomButtonProps {
  mode?: 'filled' | 'outlined' | 'text';
  disabled?: boolean;
  loading?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  mode = 'filled',
  disabled = false,
  loading = false,
  onPress,
  style,
  textStyle,
  children,
}) => {
  const { themeMode } = useThemeStore();
  const colors = getColors(themeMode);

  const handlePress = (event: GestureResponderEvent) => {
    if (!disabled && !loading && onPress) {
      onPress(event);
    }
  };

  const renderContent = () => {
    if (loading) {
      const loaderColor =
        mode === 'filled' ? colors.textOnPrimary : colors.primary;
      return <ActivityIndicator size="small" color={loaderColor} />;
    }

    if (typeof children === 'string') {
      let resolvedTextColor: string = colors.textOnPrimary;
      if (mode === 'outlined') {
        resolvedTextColor = disabled ? colors.textLight : colors.primary;
      } else if (mode === 'text') {
        resolvedTextColor = disabled ? colors.textLight : colors.primary;
      }

      return (
        <CustomText
          preset="button"
          style={[styles.text, { color: resolvedTextColor }, textStyle]}
        >
          {children}
        </CustomText>
      );
    }

    return children;
  };

  if (mode === 'filled') {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled || loading}
        style={({ pressed }) => [
          styles.container,
          styles.filled,
          pressed && styles.pressed,
          style,
        ]}
      >
        <LinearGradient
          colors={gradientColors(disabled)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        {renderContent()}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.container,
        mode === 'outlined' && styles.outlined,
        mode === 'outlined' && { borderColor: colors.primary },
        mode === 'outlined' && disabled && { borderColor: colors.border },
        mode === 'text' && styles.textMode,
        pressed && styles.pressed,
        style,
      ]}
    >
      {renderContent()}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    minWidth: 100,
  },
  filled: {
    paddingHorizontal: theme.spacing.lg,
  },
  outlined: {
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    backgroundColor: 'transparent',
    paddingHorizontal: theme.spacing.lg,
  },
  outlinedDisabled: {
    borderColor: theme.colors.border,
  },
  textMode: {
    backgroundColor: 'transparent',
    paddingHorizontal: theme.spacing.sm,
  },
  text: {
    textAlign: 'center',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
});

export default CustomButton;
