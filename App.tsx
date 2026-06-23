import 'react-native-gesture-handler';
import '@/localization';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/services/queryClient';
import { RootNavigator } from '@/navigation/RootNavigator';
import { useThemeStore } from '@/store/useThemeStore';
import { getColors } from '@/theme/colors';
import ModalProvider from '@/components/modalProvider/ModalProvider';

function App(): React.JSX.Element {
  const { themeMode } = useThemeStore();
  const colors = getColors(themeMode);
  const isDarkMode = themeMode === 'dark';

  const baseTheme = isDarkMode ? DarkTheme : DefaultTheme;

  const navigationTheme = {
    ...baseTheme,
    dark: isDarkMode,
    colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.error,
    },
  };

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer theme={navigationTheme}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={colors.background}
          />
          <ModalProvider>
            <RootNavigator />
          </ModalProvider>
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;
