import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNetworkStore } from '@/store/useNetworkStore';
import { useOfflineQueueStore } from '@/store/useOfflineQueueStore';
import { toggleCommunityJoin } from '@/services/api/communityService';
import { queryClient } from '@/services/queryClient';

export const useOfflineQueueSync = () => {
  const { t } = useTranslation();
  const isOnline = useNetworkStore(state => state.isOnline);
  const wasOffline = useRef(false);
  const isSyncing = useRef(false);

  useEffect(() => {
    const syncQueue = async () => {
      if (isSyncing.current) return;
      isSyncing.current = true;

      try {
        let queue = useOfflineQueueStore.getState().queue;
        
        while (queue.length > 0) {
          // Double check network state
          if (!useNetworkStore.getState().isOnline) {
            console.log('Syncing paused: went offline during sync');
            break;
          }

          // Sort queue by timestamp and take the first item
          const sortedQueue = [...queue].sort((a, b) => a.timestamp - b.timestamp);
          const item = sortedQueue[0];

          try {
            console.log(`Syncing offline action: ${item.action} for community ${item.communityId}`);
            await toggleCommunityJoin(item.communityId, item.action === 'join');
            useOfflineQueueStore.getState().dequeue(item.communityId);
          } catch (error: any) {
            console.error(`Offline sync failed for community ${item.communityId}:`, error);

            if (error.response) {
              // Client/Server Error (e.g. 400/404/500) - discard to prevent stuck queue
              useOfflineQueueStore.getState().dequeue(item.communityId);
              
              // Display localized error
              const localizedAction = item.action === 'join' 
                ? t('communityDetails.join') 
                : t('communityDetails.leave');
              
              Alert.alert(
                t('common.error'),
                t('communityDetails.syncFailed', { action: localizedAction }),
                [{ text: t('common.ok') }]
              );
            } else {
              // Network/Timeout Error - pause processing until network status changes again
              break;
            }
          }

          // Fetch the latest state of the queue for the next loop iteration
          queue = useOfflineQueueStore.getState().queue;
        }
      } finally {
        // Refresh react-query active queries on sync completion or pause
        queryClient.invalidateQueries({ queryKey: ['communities'] });
        queryClient.invalidateQueries({ queryKey: ['communityDetails'] });
        isSyncing.current = false;
      }
    };

    if (isOnline) {
      // If we were offline and now came online, or on initial mount when online
      const queue = useOfflineQueueStore.getState().queue;
      if (queue.length > 0) {
        syncQueue();
      } else if (wasOffline.current) {
        // No queue to sync, but we transitioned from offline -> online: refresh stale active queries
        queryClient.invalidateQueries({ queryKey: ['communities'] });
        queryClient.invalidateQueries({ queryKey: ['communityDetails'] });
      }
      wasOffline.current = false;
    } else {
      wasOffline.current = true;
    }
  }, [isOnline, t]);
};

export default useOfflineQueueSync;
