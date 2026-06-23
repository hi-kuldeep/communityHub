export const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  USER_SESSION: '@user_session',
  OFFLINE_QUEUE: '@offline_queue',
  THEME_PREFERENCE: '@theme_preference',
  CACHED_COMMUNITIES: '@cached_communities',
  CACHED_POSTS: '@cached_posts',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
