import axiosInstance from '@/services/api/axiosInstance';

/**
 * Fetches the list of posts for a specific community.
 */
const fetchCommunityPosts = async (communityId: string): Promise<IPost[]> =>
  axiosInstance.get('/posts', { params: { communityId } }).then(res => res?.data);

/**
 * Creates a new post in a community.
 */
const createPost = async (
  communityId: string,
  title: string,
  body: string,
): Promise<IPost> =>
  axiosInstance
    .post('/posts', { communityId, title, body })
    .then(res => res?.data);

export { fetchCommunityPosts, createPost };
