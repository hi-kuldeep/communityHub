import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IDraft {
  title: string;
  body: string;
}

interface IDraftState {
  drafts: Record<string, IDraft>; // key is communityId
  getDraft: (communityId: string) => IDraft;
  saveDraft: (communityId: string, title: string, body: string) => void;
  clearDraft: (communityId: string) => void;
}

export const useDraftStore = create<IDraftState>()(
  persist(
    (set, get) => ({
      drafts: {},
      getDraft: (communityId) => {
        return get().drafts[communityId] || { title: '', body: '' };
      },
      saveDraft: (communityId, title, body) => {
        set((state) => ({
          drafts: {
            ...state.drafts,
            [communityId]: { title, body },
          },
        }));
      },
      clearDraft: (communityId) => {
        set((state) => {
          const newDrafts = { ...state.drafts };
          delete newDrafts[communityId];
          return { drafts: newDrafts };
        });
      },
    }),
    {
      name: 'community-hub-drafts',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useDraftStore;
