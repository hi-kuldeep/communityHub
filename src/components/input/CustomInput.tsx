import React, { forwardRef, useState } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  NativeSyntheticEvent,
  TargetedEvent,
} from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { getColors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { FONTS } from '@/theme/fonts';
import CustomText from '../CustomText';

export interface CustomInputProps extends TextInputProps {
  label?: string;
  errorText?: string | boolean;
  isError?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

const CustomInput = forwardRef<TextInput, CustomInputProps>(
  (
    {
      label,
      errorText,
      isError,
      leftIcon,
      rightIcon,
      containerStyle,
      inputStyle,
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const { themeMode } = useThemeStore();
    const colors = getColors(themeMode);
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: NativeSyntheticEvent<TargetedEvent>) => {
      setIsFocused(true);
      if (onFocus) {
        onFocus(e);
      }
    };

    const handleBlur = (e: NativeSyntheticEvent<TargetedEvent>) => {
      setIsFocused(false);
      if (onBlur) {
        onBlur(e);
      }
    };

    const hasError = isError || !!errorText;

    const inputBorderColor = hasError
      ? colors.error
      : isFocused
      ? colors.primary
      : colors.border;

    const placeholderColor = colors.textLight;

    return (
      <View style={[styles.outerContainer, containerStyle]}>
        {label && (
          <CustomText
            preset="bodySmall"
            color="textSecondary"
            style={styles.label}
          >
            {label}
          </CustomText>
        )}
        <View
          style={[
            styles.inputWrapper,
            {
              borderColor: inputBorderColor,
              backgroundColor: colors.surface,
            },
          ]}
        >
          {leftIcon && <View style={styles.leftIconWrapper}>{leftIcon}</View>}
          <TextInput
            ref={ref}
            style={[
              styles.input,
              {
                color: colors.text,
              },
              inputStyle,
            ]}
            placeholderTextColor={placeholderColor}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...rest}
          />
          {rightIcon && <View style={styles.rightIconWrapper}>{rightIcon}</View>}
        </View>
        {hasError && typeof errorText === 'string' && (
          <CustomText
            preset="bodySmall"
            color="error"
            style={styles.errorText}
          >
            {errorText}
          </CustomText>
        )}
      </View>
    );
  }
);

CustomInput.displayName = 'CustomInput';

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 8,
    height: 48,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: FONTS.regular,
    fontSize: 14,
    paddingVertical: 0,
  },
  leftIconWrapper: {
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconWrapper: {
    marginLeft: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: spacing.xs,
  },
});

export default CustomInput;
