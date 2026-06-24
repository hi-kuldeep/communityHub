import 'react-native-gesture-handler';
import '@/localization';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { QueryClientProvider, onlineManager } from '@tanstack/react-query';
import { queryClient } from '@/services/queryClient';
import RootStackNavigator from '@/navigation/rootStackNavigator/RootStackNavigator';
import { useThemeStore } from '@/store/useThemeStore';
import { getColors } from '@/theme/colors';
import ModalProvider from '@/components/modalProvider/ModalProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useNetworkListener from '@/hooks/useNetworkListener';
import useOfflineQueueSync from '@/hooks/useOfflineQueueSync';
import ErrorBoundary from '@/components/ErrorBoundary';
import OfflineBanner from '@/components/OfflineBanner';
import NetInfo from '@react-native-community/netinfo';
import { hideSplash } from 'react-native-splash-view';

// Configure once during app startup
NetInfo.configure({
  reachabilityUrl: 'https://www.google.com',
  reachabilityTest: async response => response.ok,
  reachabilityShortTimeout: 5000,
  reachabilityLongTimeout: 30000,
});

// Hook up TanStack Query's onlineManager to NetInfo
onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    const isOnline = state.isConnected === true && state.isInternetReachable !== false;
    setOnline(isOnline);
  });
});

function App(): React.JSX.Element {
  const { themeMode } = useThemeStore();
  const colors = getColors(themeMode);
  const isDarkMode = themeMode === 'dark';

  // Start global NetInfo listener — syncs to useNetworkStore
  useNetworkListener();

  // Start background queue synchronization listener
  useOfflineQueueSync();

  // Hide native splash screen
  React.useEffect(() => {
    hideSplash();
  }, []);

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <NavigationContainer theme={navigationTheme}>
              <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background}
              />
              <ModalProvider>
                <RootStackNavigator />
              </ModalProvider>
              {/* Global offline banner — rendered above all navigation content */}
              <OfflineBanner />
            </NavigationContainer>
          </ErrorBoundary>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
