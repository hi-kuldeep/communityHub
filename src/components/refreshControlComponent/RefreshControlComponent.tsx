import { COLORS } from '@/theme';
import React from 'react';
import { RefreshControl } from 'react-native';

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
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={[COLORS.white]}
      progressBackgroundColor={COLORS.primary}
      tintColor={tintColor ?? COLORS.primary}
      titleColor={COLORS.white}
      {...props}
    />
  );
};

export default RefreshControlComponent;
