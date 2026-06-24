import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  InfiniteData,
} from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useDebounce } from './useDebounce';

// Utility to extract return type of a Promise
type AwaitedReturnType<T> = T extends (...args: any) => Promise<infer R>
  ? R
  : never;

interface UseInfinitePaginatedQueryProps<
  TQueryFn extends (params: any) => Promise<any>,
> {
  queryFn: TQueryFn;
  queryKeyBase: string;
  initialSearch?: string;
  initialPage?: number;
  params?: IObjectKeys<any>;
  // params2?: string | number;
  enabled?: boolean;
  getNextPageParam?: (
    lastPage: AwaitedReturnType<TQueryFn>,
    allPages: AwaitedReturnType<TQueryFn>[],
  ) => number | undefined;
  select?: (data: any) => any;
  pageLimit?: number;
}

function useInfinitePaginatedQuery<
  TQueryFn extends (params: any) => Promise<any>,
>({
  queryFn,
  queryKeyBase,
  initialSearch = '',
  initialPage = 1,
  params,
  // params2,
  enabled = true,
  getNextPageParam,
  select,
  pageLimit = 10,
}: UseInfinitePaginatedQueryProps<TQueryFn>) {
  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebounce(search, 500);

  const queryKey = [queryKeyBase, debouncedSearch, params];

  const query: UseInfiniteQueryResult<InfiniteData<AwaitedReturnType<TQueryFn>>> =
    useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam = initialPage }) =>
        queryFn({
          search: debouncedSearch,
          limit: pageLimit,
          ...params,
          page: pageParam,
        }),
      getNextPageParam: (lastPage: any, allPages) => {
        if (getNextPageParam) {
          return getNextPageParam(lastPage, allPages);
        }
        // Check if the response contains a nextPage property directly (standard metadata response)
        if (lastPage && typeof lastPage === 'object' && 'nextPage' in lastPage) {
          return lastPage.nextPage;
        }
        // Default logic: if the last page has items, assume there's a next page
        if (
          Array.isArray(lastPage) &&
          lastPage.length > 0 &&
          lastPage.length >= (params?.limit ?? pageLimit)
        ) {
          return allPages.length + 1;
        }
        return undefined;
      },
      enabled,
      initialPageParam: initialPage,
      select: select,
    });

  const data = useMemo(() => {
    if (!query.data?.pages) return [];
    return query.data.pages.flat();
  }, [query.data]);

  return {
    query,
    search,
    setSearch,
    queryKey,
    data,
  };
}

export default useInfinitePaginatedQuery;
