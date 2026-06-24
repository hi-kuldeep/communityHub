import { create } from 'zustand';

interface NetworkState {
  isOnline: boolean;
  setOnline: (value: boolean) => void;
}

/**
 * Zustand client store for network connectivity state.
 * NetInfo listener writes here; components read from here reactively.
 * Do NOT use this for server state — use React Query for that.
 */
export const useNetworkStore = create<NetworkState>(set => ({
  isOnline: true, // Optimistic default until first NetInfo event
  setOnline: (value: boolean) => set({ isOnline: value }),
}));
