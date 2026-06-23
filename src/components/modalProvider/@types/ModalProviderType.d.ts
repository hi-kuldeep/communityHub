import { ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

interface IModalProvider {
  children?: ReactNode;
}

interface modalHandlerType {
  message?: string;
  title?: string;
  isVisible?: boolean;
  successFn?: () => void;
  showCancelButton?: boolean;
  successTitle?: string;
  type?: 'error' | 'success' | 'info' | undefined;
  successBtnStyle?: StyleProp<ViewStyle>;
  successTitleSTyle?: StyleProp<TextStyle>;
  cancelTitle?: string;
  closeIconVisible?: boolean;
  cancelFn?: () => void;
  iconVisible?: boolean;
  secondMessage?: string;
}

interface loadingModalProps {
  loadingText?: string;
}
