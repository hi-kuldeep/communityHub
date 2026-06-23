import React, { forwardRef, useState } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { getColors } from '@/theme/colors';
import CustomInput, { CustomInputProps } from './CustomInput';

export interface PasswordInputProps extends Omit<CustomInputProps, 'secureTextEntry' | 'rightIcon'> {}

const PasswordInput = forwardRef<TextInput, PasswordInputProps>((props, ref) => {
  const [isSecure, setIsSecure] = useState(true);
  const { themeMode } = useThemeStore();
  const colors = getColors(themeMode);

  const toggleSecure = () => {
    setIsSecure(prev => !prev);
  };

  const RightIcon = (
    <TouchableOpacity onPress={toggleSecure} activeOpacity={0.7}>
      {isSecure ? (
        <EyeOff size={20} color={colors.textSecondary} />
      ) : (
        <Eye size={20} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <CustomInput
      ref={ref}
      secureTextEntry={isSecure}
      autoCorrect={false}
      autoCapitalize="none"
      rightIcon={RightIcon}
      {...props}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
