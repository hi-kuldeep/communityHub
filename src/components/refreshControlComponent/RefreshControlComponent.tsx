import React from 'react';
import { RefreshControl } from 'react-native';
import { getColors } from '@/theme/colors';
import { useThemeStore } from '@/store/useThemeStore';

type TRefreshControlComponent = {
  refreshing: boolean;
  onRefresh?: () => void;
  tintColor?: string;
};

const RefreshControlComponent = ({
  refreshing,
  onRefresh,
  tintColor,
  ...props
}: TRefreshControlComponent) => {
  const { themeMode } = useThemeStore();
  const colors = getColors(themeMode);

  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={[colors.textOnPrimary]}
      progressBackgroundColor={colors.primary}
      tintColor={tintColor ?? colors.primary}
      titleColor={colors.textOnPrimary}
      {...props}
    />
  );
};

export default RefreshControlComponent;
