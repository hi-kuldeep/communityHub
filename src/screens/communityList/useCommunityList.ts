import { useState, useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import useInfinitePaginatedQuery from '@/hooks/usePaginatedQuery';
import { fetchCommunities } from '@/services/api/communityService';
import { rootStackName } from '@/navigation/rootStackNavigator/rootStackName';
import { RootStackNavigationProp } from '@/navigation/types';
import { useOfflineQueueStore } from '@/store/useOfflineQueueStore';

export const useCommunityList = () => {
  const navigation = useNavigation<RootStackNavigationProp<any>>();
  const [sort, setSort] = useState<SORT_OPTIONS>('name_asc');
  const [refreshing, setRefreshing] = useState(false);

  const { query, search, setSearch, data } = useInfinitePaginatedQuery({
    queryFn: fetchCommunities,
    queryKeyBase: 'communities',
    params: { sort },
  });

  const queue = useOfflineQueueStore(state => state.queue);

  // Flat-map pages to get a clean array of Community items, merging with pending offline queue states
  const communities = useMemo(() => {
    if (!query.data?.pages) return [] as ICommunity[];
    const rawList = query.data.pages.flatMap(page => page.data) as ICommunity[];

    return rawList.map(c => {
      const queued = queue.find(item => item.communityId === c.id);
      if (!queued) return c;
      const isJoined = queued.action === 'join';
      if (c.joined === isJoined) return c;
      return {
        ...c,
        joined: isJoined,
        memberCount: Math.max(0, c.memberCount + (isJoined ? 1 : -1)),
      };
    });
  }, [query.data, queue]);

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await query.refetch();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  }, [query]);

  // Handle pagination load-more
  const onEndReached = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query]);

  // Handle sort selection
  const onSelectSort = useCallback((option: SORT_OPTIONS) => {
    setSort(option);
  }, []);

  // Handle community card click navigation callback
  const onPressCommunity = useCallback(
    (id: string) => {
      navigation.navigate(rootStackName.COMMUNITY_DETAILS, { communityId: id });
    },
    [navigation],
  );

  // Derived loading / error states for granular feedback in the UI
  const isInitialLoading = query.isPending && !refreshing;
  const isError = query.isError && !refreshing;
  const isEmpty = !isInitialLoading && !isError && communities.length === 0;

  return {
    communities,
    search,
    setSearch,
    sort,
    onSelectSort,
    refreshing,
    onRefresh,
    onEndReached,
    onPressCommunity,
    isInitialLoading,
    isError,
    isEmpty,
    isFetchingNextPage: query.isFetchingNextPage,
    refetch: query.refetch,
    hasNextPage: query.hasNextPage,
  };
};

export default useCommunityList;
