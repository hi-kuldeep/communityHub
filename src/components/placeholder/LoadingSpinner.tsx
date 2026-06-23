import {
  View,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  ColorValue,
} from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getColors } from '@/theme/colors';
import CustomText from '@/components/CustomText';
import { useThemeStore } from '@/store/useThemeStore';

interface ILoadingSpinner {
  style?: StyleProp<ViewStyle>;
  textDisable?: boolean;
  spinnerSize?: number | 'large' | 'small';
  indicatorColor?: ColorValue;
}
function LoadingSpinner({
  style,
  spinnerSize = 'large',
  textDisable,
  indicatorColor,
}: ILoadingSpinner) {
  const { t } = useTranslation();
  const { themeMode } = useThemeStore();
  const colors = getColors(themeMode);
  const activeColor = indicatorColor ?? colors.primary;

  return (
    <View
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        },
        style,
      ]}
    >
      <ActivityIndicator size={spinnerSize} color={activeColor} />
      {textDisable ? null : (
        <CustomText
          colorCode={activeColor}
          // fontFamily="semiBold"
          fontSize={15}
          style={[{ marginVertical: 10 }]}
        >
          {t('common.pleaseWait')}
        </CustomText>
      )}
    </View>
  );
}

export default LoadingSpinner;
