import axiosInstance from '@/services/api/axiosInstance';

/**
 * Fetches the list of posts for a specific community.
 */
const fetchCommunityPosts = async (communityId: string): Promise<IPost[]> =>
  axiosInstance.get('/posts', { params: { communityId } }).then(res => res?.data);

export { fetchCommunityPosts };
