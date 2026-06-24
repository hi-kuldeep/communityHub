import { useCallback, useMemo } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNetworkStore } from '@/store/useNetworkStore';
import { useOfflineQueueStore } from '@/store/useOfflineQueueStore';
import { toggleCommunityJoin } from '@/services/api/communityService';
import { showModal } from '@/components/modalProvider/ModalProvider';

export const useCommunityJoinQueue = (communityId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isOnline = useNetworkStore((state) => state.isOnline);
  const enqueue = useOfflineQueueStore((state) => state.enqueue);
  const getQueuedAction = useOfflineQueueStore((state) => state.getQueuedAction);

  const toggleMutation = useMutation({
    mutationFn: (newJoinedState: boolean) =>
      toggleCommunityJoin(communityId, newJoinedState),
    onMutate: async (newJoinedState) => {
      await queryClient.cancelQueries({ queryKey: ['communityDetails', communityId] });
      await queryClient.cancelQueries({ queryKey: ['communities'] });

      const previousDetails = queryClient.getQueryData<ICommunity>([
        'communityDetails',
        communityId,
      ]);

      if (previousDetails) {
        queryClient.setQueryData<ICommunity>(
          ['communityDetails', communityId],
          {
            ...previousDetails,
            joined: newJoinedState,
            memberCount: previousDetails.memberCount + (newJoinedState ? 1 : -1),
          }
        );
      }

      return { previousDetails };
    },
    onError: (err, newJoinedState, context) => {
      if (context?.previousDetails) {
        queryClient.setQueryData<ICommunity>(
          ['communityDetails', communityId],
          context.previousDetails
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['communityDetails', communityId] });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
  });

  const handleToggleJoin = useCallback(
    (currentJoined: boolean) => {
      const nextJoinedState = !currentJoined;

      if (!isOnline) {
        // Offline: Enqueue join/leave action
        enqueue(communityId, nextJoinedState ? 'join' : 'leave');

        // Update cache optimistically so that the UI changes instantly
        queryClient.setQueryData<ICommunity>(
          ['communityDetails', communityId],
          (old) => {
            if (!old) return old;
            return {
              ...old,
              joined: nextJoinedState,
              memberCount: Math.max(0, old.memberCount + (nextJoinedState ? 1 : -1)),
            };
          }
        );

        // Trigger list refresh
        queryClient.invalidateQueries({ queryKey: ['communities'] });

        // Notify the user that their request has been queued offline
        showModal({
          title: t('common.offline'),
          message: nextJoinedState
            ? t('communityDetails.offlineJoinQueued')
            : t('communityDetails.offlineLeaveQueued'),
          successTitle: t('common.ok'),
        });
      } else {
        // Online: Run mutation
        toggleMutation.mutate(nextJoinedState);
      }
    },
    [communityId, isOnline, enqueue, queryClient, t, toggleMutation]
  );

  const queuedAction = getQueuedAction(communityId);

  const getMergedCommunity = useCallback(
    (rawCommunity: ICommunity | undefined) => {
      if (!rawCommunity) return undefined;
      if (!queuedAction) return rawCommunity;
      const isJoined = queuedAction === 'join';
      if (rawCommunity.joined === isJoined) return rawCommunity;
      return {
        ...rawCommunity,
        joined: isJoined,
        memberCount: Math.max(0, rawCommunity.memberCount + (isJoined ? 1 : -1)),
      };
    },
    [queuedAction]
  );

  return {
    handleToggleJoin,
    getMergedCommunity,
    isTogglingJoin: toggleMutation.isPending,
  };
};

export default useCommunityJoinQueue;
