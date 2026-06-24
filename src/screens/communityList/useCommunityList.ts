import { useState, useCallback, useMemo } from 'react';
import useInfinitePaginatedQuery from '@/hooks/usePaginatedQuery';
import { fetchCommunities } from '@/services/api/communityService';

export const useCommunityList = () => {
  const [sort, setSort] = useState<SORT_OPTIONS>('name_asc');
  const [refreshing, setRefreshing] = useState(false);

  const { query, search, setSearch, data } = useInfinitePaginatedQuery({
    queryFn: fetchCommunities,
    queryKeyBase: 'communities',
    params: { sort },
  });

  console.log({ data, query });

  // Flat-map pages to get a clean array of Community items
  const communities = useMemo(() => {
    if (!query.data?.pages) return [] as ICommunity[];
    return query.data.pages.flatMap(page => page.data) as ICommunity[];
  }, [query.data]);

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
  const onPressCommunity = useCallback((id: string) => {
    console.log('Navigate to community details:', id);
  }, []);

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
