import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface IContainerProps {
  children?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  isLoading?: boolean;
  isError?: boolean;
  errorText?: string;
  isPaddingBottomEnabled?: boolean;
  stickyHeaderIndices?: number[];
  isScrollable?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  alwaysBounceVertical?: boolean;
  keyboardVerticalOffset?: number;
  containerStyle?: StyleProp<ViewStyle>;
  isSaferAreaView?: boolean;
  keyboardShouldPersistTaps?: 'handled' | 'never' | 'always';
}
