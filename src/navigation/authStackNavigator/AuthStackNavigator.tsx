import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { authStackParam } from './authStackParam';
import { authStackName } from './authStackName';
import Login from '@/screens/login/Login';

const AuthStack = createNativeStackNavigator<authStackParam>();
const { Navigator, Screen } = AuthStack;
const AuthStackNavigator = () => {
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
      <Screen name={authStackName.LOGIN} component={Login} />
    </Navigator>
  );
};

export default AuthStackNavigator;
