import axiosInstance from '@/services/api/axiosInstance';

/**
 * Fetches a paginated list of communities from the local mock server.
 * Supports filtering by keyword search, sorting, and pagination limit/offset.
 */
const fetchCommunities = async (
  params: ICommunityParams,
): Promise<IPagination<ICommunity>> =>
  axiosInstance.get('/communities', { params }).then(res => res?.data);

export { fetchCommunities };
