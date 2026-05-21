import { ActionType, createAsyncAction } from 'typesafe-actions';

export enum PostsTypes {
  FetchPosts = '[PostsTypes] FetchPosts',
  FetchPostsSuccess = '[PostsTypes] FetchPostsSuccess',
  FetchPostsFailed = '[PostsTypes] FetchPostsFailed',
}

export interface PostData {
  id: string;
  page: string;
  page_details?: {
    id: string;
    name: string;
    image_url: string;
    user_id: string;
  };
  content: string;
  image_url: string;
  reply_to: string | null;
  created_at: string;
  updated_at: string;
}

export const fetchPostsAction = createAsyncAction(
  PostsTypes.FetchPosts,
  PostsTypes.FetchPostsSuccess,
  PostsTypes.FetchPostsFailed
)<{ feedType: 'global' | 'subscriptions' }, PostData[], string>();

export type PostsActionUnion =
  | ActionType<typeof fetchPostsAction>
  | ActionType<typeof createPostAction>
  | ActionType<typeof fetchSubscriptionsAction>
  | ActionType<typeof toggleFollowAction>;

export const createPostAction = createAsyncAction(
  '[Posts] Create Post Request',
  '[Posts] Create Post Success',
  '[Posts] Create Post Failed'
)<{ content: string; imageFile?: File }, PostData, string>();

export const fetchSubscriptionsAction = createAsyncAction(
  '[Posts] Fetch Subscriptions Request',
  '[Posts] Fetch Subscriptions Success',
  '[Posts] Fetch Subscriptions Failed'
)<void, string[], string>();

export const toggleFollowAction = createAsyncAction(
  '[Posts] Toggle Follow Request',
  '[Posts] Toggle Follow Success',
  '[Posts] Toggle Follow Failed'
)<
  { pageId: string; isCurrentlyFollowed: boolean },
  { pageId: string; isNowFollowed: boolean },
  string
>();
