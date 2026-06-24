interface ICommunity {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  joined: boolean;
  postCount: number;
}

type SORT_OPTIONS = 'name_asc' | 'name_desc' | 'members_desc';

interface ICommunityParams {
  search?: string;
  sort?: SORT_OPTIONS;
  page?: number;
  limit?: number;
}

interface IPagination<T> {
  data: T[];
  nextPage: number | undefined;
  totalCount: number;
}
