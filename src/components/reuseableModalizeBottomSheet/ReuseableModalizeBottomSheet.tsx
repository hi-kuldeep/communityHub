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
} from 'react-native';
import { Modalize, ModalizeProps, useModalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';

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
          modalStyle={{
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            minHeight,
          }}
          rootStyle={{
            backgroundColor: 'rgba(0, 46, 107, 0.3)',
          }}
          {...props}
        >
          {children ? cloneElement(children, { close } as any) : children}
        </Modalize>
      </Portal>
    </>
  );
};

export default ReuseableModalizeBottomSheet;
