import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { rootStackParams } from './rootStackParams';
import { rootStackName } from './rootStackName';
import AuthStackNavigator from '../authStackNavigator/AuthStackNavigator';
import BottomTabNavigator from '../bottomTabStackNavigator/BottomTabNavigator';
import { useAuthStore } from '@/store/useAuthStore';
import LoadingSpinner from '@/components/placeholder/LoadingSpinner';
import { useThemeStore } from '@/store/useThemeStore';
import { getColors } from '@/theme/colors';

const Stack = createNativeStackNavigator<rootStackParams>();

const RootStackNavigator: React.FC = () => {
  const { isAuthenticated, isRestoring, restoreSession } = useAuthStore();
  const { themeMode } = useThemeStore();
  const colors = getColors(themeMode);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    if (!isRestoring) {
      if (isAuthenticated) {
        navigation.reset({
          index: 0,
          routes: [{ name: rootStackName.MAIN }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: rootStackName.AUTH }],
        });
      }
    }
  }, [isAuthenticated, isRestoring, navigation]);

  if (isRestoring) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={
        isAuthenticated ? rootStackName.MAIN : rootStackName.AUTH
      }
    >
      <Stack.Screen name={rootStackName.MAIN} component={BottomTabNavigator} />
      <Stack.Screen name={rootStackName.AUTH} component={AuthStackNavigator} />
    </Stack.Navigator>
  );
};

export default RootStackNavigator;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
