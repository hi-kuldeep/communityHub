import { useState, useCallback } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCommunityDetails, toggleCommunityJoin } from '@/services/api/communityService';
import { fetchCommunityPosts } from '@/services/api/postService';
import { rootStackParams } from '@/navigation/rootStackNavigator/rootStackParams';
import { rootStackName } from '@/navigation/rootStackNavigator/rootStackName';

export const useCommunityDetails = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<rootStackParams, typeof rootStackName.COMMUNITY_DETAILS>>();
  const { communityId } = route.params;
  const queryClient = useQueryClient();

  const [refreshing, setRefreshing] = useState(false);

  // 1. Query for Community Details
  const detailsQuery = useQuery({
    queryKey: ['communityDetails', communityId],
    queryFn: () => fetchCommunityDetails(communityId),
    retry: 2,
  });

  // 2. Query for Community Posts
  const postsQuery = useQuery({
    queryKey: ['communityPosts', communityId],
    queryFn: () => fetchCommunityPosts(communityId),
    retry: 2,
  });

  // 3. Mutation for Join/Leave Toggle
  const toggleMutation = useMutation({
    mutationFn: (newJoinedState: boolean) =>
      toggleCommunityJoin(communityId, newJoinedState),
    onMutate: async (newJoinedState) => {
      // Cancel outgoing queries to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ['communityDetails', communityId] });
      await queryClient.cancelQueries({ queryKey: ['communities'] });

      // Snapshot previous value
      const previousDetails = queryClient.getQueryData<ICommunity>([
        'communityDetails',
        communityId,
      ]);

      // Optimistically update the details cache
      if (previousDetails) {
        queryClient.setQueryData<ICommunity>(
          ['communityDetails', communityId],
          {
            ...previousDetails,
            joined: newJoinedState,
            memberCount:
              previousDetails.memberCount + (newJoinedState ? 1 : -1),
          }
        );
      }

      // Return context with rollback info
      return { previousDetails };
    },
    onError: (err, newJoinedState, context) => {
      // Rollback cache if mutation fails
      if (context?.previousDetails) {
        queryClient.setQueryData<ICommunity>(
          ['communityDetails', communityId],
          context.previousDetails
        );
      }
    },
    onSettled: () => {
      // Always refetch / invalidate to stay in sync with database
      queryClient.invalidateQueries({ queryKey: ['communityDetails', communityId] });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
  });

  // 4. Handle Join/Leave Button Press
  const handleToggleJoin = useCallback(() => {
    if (!detailsQuery.data) return;
    const nextJoinedState = !detailsQuery.data.joined;
    toggleMutation.mutate(nextJoinedState);
  }, [detailsQuery.data, toggleMutation]);

  // 5. Handle pull-to-refresh for posts independently
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([detailsQuery.refetch(), postsQuery.refetch()]);
    } catch (error) {
      console.error('Refresh details and posts failed:', error);
    } finally {
      setRefreshing(false);
    }
  }, [detailsQuery, postsQuery]);

  // 6. Navigation goBack
  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    community: detailsQuery.data,
    posts: postsQuery.data || [],
    isDetailsLoading: detailsQuery.isPending,
    isDetailsError: detailsQuery.isError,
    isPostsLoading: postsQuery.isPending,
    isPostsError: postsQuery.isError,
    isTogglingJoin: toggleMutation.isPending,
    refreshing,
    onRefresh,
    handleToggleJoin,
    handleGoBack,
    refetchDetails: detailsQuery.refetch,
    refetchPosts: postsQuery.refetch,
  };
};

export default useCommunityDetails;
