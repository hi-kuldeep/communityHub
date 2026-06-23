import React, {
  ReactElement,
  cloneElement,
  isValidElement,
  useEffect,
} from 'react';
import {
  Keyboard,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
  View,
  TouchableOpacityProps,
  PressableProps,
  StyleSheet,
} from 'react-native';
import { Modalize, ModalizeProps, useModalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { getColors } from '@/theme/colors';
import { useThemeStore } from '@/store/useThemeStore';

// Union of props to support both
type AllowedTouchable =
  | ReactElement<TouchableOpacityProps>
  | ReactElement<PressableProps>;

export interface ReuseableModalizeBottomSheet extends ModalizeProps {
  isOpen?: boolean;
  onClose?: () => void;
  actionElement?: AllowedTouchable;
  pressableStyle?: StyleProp<ViewStyle>;
  children?: ReactElement;
  onPress?: () => void;
  minHeight?: number;
  hitSlop?: number;
  disableBackdropClose?: boolean;
}

const ReuseableModalizeBottomSheet: React.FC<ReuseableModalizeBottomSheet> = ({
  actionElement,
  isOpen,
  onClose,
  pressableStyle,
  children,
  onPress,
  minHeight = 100,
  hitSlop = 30,
  disableBackdropClose = false,
  ...props
}) => {
  const { ref, open, close } = useModalize();
  const { themeMode } = useThemeStore();
  const colors = getColors(themeMode);

  // External control: open/close via isOpen prop
  useEffect(() => {
    if (isOpen) {
      open();
    } else {
      close();
    }
  }, [isOpen]);

  // Unified handler for action press
  const handlePress = (e?: any) => {
    e?.stopPropagation?.();
    Keyboard.dismiss();
    if (onPress) {
      onPress();
    } else {
      open();
    }
  };

  const wrappedActionElement =
    actionElement && React.isValidElement(actionElement)
      ? React.cloneElement(actionElement as React.ReactElement<any>, {
          onPress: handlePress,
        })
      : null;

  return (
    <>
      {/* {isValidElement(actionElement) && (
        <TouchableOpacity
          hitSlop={{ top: hitSlop, bottom: hitSlop, left: hitSlop, right: hitSlop }}
          onPress={handlePress}
          style={[{ alignSelf: 'baseline' }, pressableStyle]}
        >
          {cloneElement(actionElement, { onPress: handlePress })}
        </TouchableOpacity>
      )} */}
      {wrappedActionElement}
      <Portal>
        <Modalize
          ref={ref}
          adjustToContentHeight
          onClose={onClose}
          closeOnOverlayTap={!disableBackdropClose}
          panGestureEnabled={false}
          disableScrollIfPossible
          avoidKeyboardLikeIOS
          useNativeDriver
          modalTopOffset={50}
          handlePosition="inside"
          modalStyle={[styles.modal, { backgroundColor: colors.surface, minHeight }]}
          handleStyle={[styles.handle, { backgroundColor: colors.border }]}
          rootStyle={styles.root}
          {...props}
        >
          {children ? cloneElement(children, { close } as any) : children}
        </Modalize>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  root: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  handle: {
    height: 6,
    width: 40,
    borderRadius: 3,
  },
});

export default ReuseableModalizeBottomSheet;
