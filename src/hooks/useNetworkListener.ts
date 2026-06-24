import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useNetworkStore } from '@/store/useNetworkStore';

/**
 * App-level hook — call once at the root (App.tsx).
 * Subscribes to NetInfo events and syncs connectivity state
 * into the Zustand useNetworkStore for global access.
 *
 * NOTE: isInternetReachable can be null when not yet determined.
 * We treat null as "reachable" to avoid false offline flashes on
 * connection changes (e.g. switching from WiFi to cellular).
 */

const useNetworkListener = () => {
  const setOnline = useNetworkStore(state => state.setOnline);

  useEffect(() => {
    // Determine online state: connected AND not explicitly unreachable
    // (null = unknown → assume online to avoid false positives)
    const resolveOnline = (
      isConnected: boolean | null,
      isInternetReachable: boolean | null,
    ) => isConnected === true && isInternetReachable !== false;

    // Fetch initial connectivity state immediately on mount
    const fetchStatus = () => {
      NetInfo.fetch().then(state => {
        console.log('FETCH:', state);
        setOnline(resolveOnline(state.isConnected, state.isInternetReachable));
      });
    };

    fetchStatus();

    // Subscribe to future changes
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('NET INFO CHANGE:', state);
      setOnline(resolveOnline(state.isConnected, state.isInternetReachable));
    });

    // Re-check status when app becomes active (returns to foreground)
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        fetchStatus();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      unsubscribe();
      subscription.remove();
    };
  }, [setOnline]);
};

export default useNetworkListener;
