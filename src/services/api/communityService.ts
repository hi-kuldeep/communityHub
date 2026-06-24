import axiosInstance from '@/services/api/axiosInstance';

/**
 * Fetches a paginated list of communities from the local mock server.
 * Supports filtering by keyword search, sorting, and pagination limit/offset.
 */
const fetchCommunities = async (
  params: ICommunityParams,
): Promise<IPagination<ICommunity>> =>
  axiosInstance.get('/communities', { params }).then(res => res?.data);

/**
 * Fetches details for a single community.
 */
const fetchCommunityDetails = async (id: string): Promise<ICommunity> =>
  axiosInstance.get(`/communities/${id}`).then(res => res?.data);

/**
 * Joins or leaves a community.
 */
const toggleCommunityJoin = async (
  id: string,
  joined: boolean,
): Promise<ICommunity> =>
  axiosInstance.patch(`/communities/${id}`, { joined }).then(res => res?.data);

export { fetchCommunities, fetchCommunityDetails, toggleCommunityJoin };
