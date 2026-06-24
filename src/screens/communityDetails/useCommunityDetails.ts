import { useState, useCallback, useMemo } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchCommunityDetails } from '@/services/api/communityService';
import { fetchCommunityPosts, createPost } from '@/services/api/postService';
import { rootStackParams } from '@/navigation/rootStackNavigator/rootStackParams';
import { rootStackName } from '@/navigation/rootStackNavigator/rootStackName';
import { useCommunityJoinQueue } from '@/hooks/useCommunityJoinQueue';

export const useCommunityDetails = () => {
  const { t } = useTranslation();
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

  // 3. Integrate offline join/leave queue logic
  const {
    handleToggleJoin: triggerToggleJoin,
    getMergedCommunity,
    isTogglingJoin,
  } = useCommunityJoinQueue(communityId);

  // 4. Handle Join/Leave Button Press
  const handleToggleJoin = useCallback(() => {
    if (!detailsQuery.data) return;
    triggerToggleJoin(detailsQuery.data.joined);
  }, [detailsQuery.data, triggerToggleJoin]);

  // Merge query cache with offline queue status to guarantee accurate local override
  const community = useMemo(() => {
    return getMergedCommunity(detailsQuery.data);
  }, [detailsQuery.data, getMergedCommunity]);

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

  // 7. Retry failed optimistic post
  const retryMutation = useMutation({
    mutationFn: ({
      postId,
      title,
      body,
    }: {
      postId: string;
      title: string;
      body: string;
    }) => createPost(communityId, title, body),
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: ['communityPosts', communityId] });
      queryClient.setQueryData<any[]>(['communityPosts', communityId], (old) => {
        if (!old) return [];
        return old.map((post) =>
          post.id === postId ? { ...post, isPending: true, isFailed: false } : post
        );
      });
      queryClient.setQueryData<ICommunity>(['communityDetails', communityId], (old) => {
        if (!old) return old;
        return { ...old, postCount: old.postCount + 1 };
      });
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData<any[]>(['communityPosts', communityId], (old) => {
        if (!old) return [];
        return old.map((post) =>
          post.id === variables.postId ? data : post
        );
      });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['communityDetails', communityId] });
    },
    onError: (error, variables) => {
      console.error('Retry post creation failed:', error);
      queryClient.setQueryData<any[]>(['communityPosts', communityId], (old) => {
        if (!old) return [];
        return old.map((post) =>
          post.id === variables.postId
            ? { ...post, isPending: false, isFailed: true }
            : post
        );
      });
      queryClient.setQueryData<ICommunity>(['communityDetails', communityId], (old) => {
        if (!old) return old;
        return { ...old, postCount: Math.max(0, old.postCount - 1) };
      });
    },
  });

  const handleRetryPost = useCallback(
    (post: any) => {
      if (!post.isFailed) return;
      retryMutation.mutate({
        postId: post.id,
        title: post.title,
        body: post.body,
      });
    },
    [retryMutation]
  );

  return {
    communityId,
    community,
    posts: postsQuery.data || [],
    isDetailsLoading: detailsQuery.isPending,
    isDetailsError: detailsQuery.isError,
    isPostsLoading: postsQuery.isPending,
    isPostsError: postsQuery.isError,
    isTogglingJoin,
    refreshing,
    onRefresh,
    handleToggleJoin,
    handleGoBack,
    handleRetryPost,
    refetchDetails: detailsQuery.refetch,
    refetchPosts: postsQuery.refetch,
  };
};

export default useCommunityDetails;
