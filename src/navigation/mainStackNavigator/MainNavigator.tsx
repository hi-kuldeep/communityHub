import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { mainStackParam } from './mainStackParam';
import { mainStackName } from './mainStackName';
import MainScreen from '@/screens/main/MainScreen';

const MainStack = createNativeStackNavigator<mainStackParam>();
const { Navigator, Screen } = MainStack;

const MainNavigator = () => {
  return (
    <Navigator
      screenOptions={{
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        fullScreenGestureEnabled: true,
        headerShown: false,
      }}
    >
      <Screen name={mainStackName.MAIN} component={MainScreen} />
    </Navigator>
  );
};

export default MainNavigator;
