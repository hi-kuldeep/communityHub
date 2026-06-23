import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { rootStackParams } from './rootStackParams';
import { rootStackName } from './rootStackName';
import AuthStackNavigator from '../authStackNavigator/AuthStackNavigator';

const Stack = createNativeStackNavigator<rootStackParams>();

const RootStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={rootStackName.AUTH} component={AuthStackNavigator} />
    </Stack.Navigator>
  );
};

export default RootStackNavigator;
