import { Keyboard } from 'react-native';
import React from 'react';

const useKeyboardOpenListener = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = React.useState(false);
  React.useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardOpen(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardOpen(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return isKeyboardOpen;
};

export default useKeyboardOpenListener;
