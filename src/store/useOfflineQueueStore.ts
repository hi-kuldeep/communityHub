import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface IOfflineAction {
  communityId: string;
  action: 'join' | 'leave';
  timestamp: number;
}

interface IOfflineQueueState {
  queue: IOfflineAction[];
  enqueue: (communityId: string, action: 'join' | 'leave') => void;
  dequeue: (communityId: string) => void;
  getQueuedAction: (communityId: string) => 'join' | 'leave' | undefined;
  clearQueue: () => void;
}

export const useOfflineQueueStore = create<IOfflineQueueState>()(
  persist(
    (set, get) => ({
      queue: [],
      enqueue: (communityId, action) => {
        set((state) => {
          // If the community already has an action queued, check if the new action cancels it out.
          // E.g. queued was 'join', new action is 'leave' (cancels out, so remove it).
          // E.g. queued was 'join', new action is 'join' (redundant, keep original timestamp).
          const existing = state.queue.find((item) => item.communityId === communityId);
          if (existing) {
            if (existing.action !== action) {
              // Cancels out! Remove it entirely.
              return {
                queue: state.queue.filter((item) => item.communityId !== communityId),
              };
            }
            // Same action, do nothing.
            return state;
          }
          // New action, add to queue
          return {
            queue: [
              ...state.queue,
              { communityId, action, timestamp: Date.now() },
            ],
          };
        });
      },
      dequeue: (communityId) => {
        set((state) => ({
          queue: state.queue.filter((item) => item.communityId !== communityId),
        }));
      },
      getQueuedAction: (communityId) => {
        return get().queue.find((item) => item.communityId === communityId)?.action;
      },
      clearQueue: () => {
        set({ queue: [] });
      },
    }),
    {
      name: 'community-hub-offline-queue',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useOfflineQueueStore;
