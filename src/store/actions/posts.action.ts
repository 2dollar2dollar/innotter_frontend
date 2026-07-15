import { ActionType, createAsyncAction } from 'typesafe-actions';

export enum PostsTypes {
  FetchPosts = '[PostsTypes] FetchPosts',
  FetchPostsSuccess = '[PostsTypes] FetchPostsSuccess',
  FetchPostsFailed = '[PostsTypes] FetchPostsFailed',
}

export interface PostData {
  id: string;
  page: string;
  author_id?: string; // <-- НОВОЕ ПОЛЕ с бэкенда
  author?: {
    // <-- Сюда сага положит данные юзера из UMS
    username?: string;
    name?: string;
    surname?: string;
    profile_image_url?: string | null;
  };
  page_details?: {
    id: string;
    name: string;
    image_url: string;
    user_id: string;
    owner_group_name?: string;
    user?: {
      username?: string;
      name?: string;
      surname?: string;
      profile_image_url?: string | null;
    };
  };
  content: string;
  image_url: string;
  reply_to: string | null;
  created_at: string;
  updated_at: string;
  likes_count?: number;
  is_liked?: boolean;
  replies_count?: number;
}

export interface TagData {
  id: number;
  name: string;
}

export interface PageItemData {
  id: string;
  name: string;
  description: string;
  image_url: string;
  user_id: string;
  followers_count: number;
}

export const fetchPostsAction = createAsyncAction(
  PostsTypes.FetchPosts,
  PostsTypes.FetchPostsSuccess,
  PostsTypes.FetchPostsFailed
)<{ feedType: 'global' | 'subscriptions' | 'page'; pageId?: string }, PostData[], string>();

export const fetchPageDetailsAction = createAsyncAction(
  '[Posts] Fetch Page Details Request',
  '[Posts] Fetch Page Details Success',
  '[Posts] Fetch Page Details Failed'
)<string, any, string>();

export const createPostAction = createAsyncAction(
  '[Posts] Create Post Request',
  '[Posts] Create Post Success',
  '[Posts] Create Post Failed'
)<{ content: string; imageFile?: File; pageId?: string }, PostData, string>();

export const fetchSubscriptionsAction = createAsyncAction(
  '[Posts] Fetch Subscriptions Request',
  '[Posts] Fetch Subscriptions Success',
  '[Posts] Fetch Subscriptions Failed'
)<void, string[], string>();

export const fetchMyLikesAction = createAsyncAction(
  '[Posts] Fetch My Likes Request',
  '[Posts] Fetch My Likes Success',
  '[Posts] Fetch My Likes Failed'
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

export const toggleLikeAction = createAsyncAction(
  '[Posts] Toggle Like Request',
  '[Posts] Toggle Like Success',
  '[Posts] Toggle Like Failed'
)<
  { postId: string; isLiked: boolean },
  { postId: string; isNowLiked: boolean; newCount?: number },
  string
>();

export const fetchPostDetailsAction = createAsyncAction(
  '[Posts] Fetch Post Details Request',
  '[Posts] Fetch Post Details Success',
  '[Posts] Fetch Post Details Failed'
)<string, PostData, string>();

export const fetchRepliesAction = createAsyncAction(
  '[Posts] Fetch Replies Request',
  '[Posts] Fetch Replies Success',
  '[Posts] Fetch Replies Failed'
)<string, PostData[], string>();

export const createCommentAction = createAsyncAction(
  '[Posts] Create Comment Request',
  '[Posts] Create Comment Success',
  '[Posts] Create Comment Failed'
)<
  { content: string; replyTo: string; pageId: string; file?: File }, // Вернули pageId
  PostData,
  string
>();

export const fetchTagsAction = createAsyncAction(
  '[Explore] Fetch Tags Request',
  '[Explore] Fetch Tags Success',
  '[Explore] Fetch Tags Failed'
)<void, TagData[], string>();

export const fetchAllPagesAction = createAsyncAction(
  '[Explore] Fetch All Pages Request',
  '[Explore] Fetch All Pages Success',
  '[Explore] Fetch All Pages Failed'
)<{ tags?: string } | void, PageItemData[], string>();

export const createPageFormAction = createAsyncAction(
  '[Page] Create Page Form Request',
  '[Page] Create Page Form Success',
  '[Page] Create Page Form Failed'
)<
  { name: string; description: string; tag_names: string[]; file?: File; navigate: any },
  any,
  string
>();

export const editPageAction = createAsyncAction(
  '[Page] Edit Request',
  '[Page] Edit Success',
  '[Page] Edit Failed'
)<
  { pageId: string; name?: string; description?: string; tag_names?: string[]; file?: File },
  any,
  string
>();

export const deletePageAction = createAsyncAction(
  '[Page] Delete Request',
  '[Page] Delete Success',
  '[Page] Delete Failed'
)<{ pageId: string; navigate: any }, string, string>();

export const editPostAction = createAsyncAction(
  '[Post] Edit Request',
  '[Post] Edit Success',
  '[Post] Edit Failed'
)<{ postId: string; content?: string; file?: File }, PostData, string>();

export const deletePostAction = createAsyncAction(
  '[Post] Delete Request',
  '[Post] Delete Success',
  '[Post] Delete Failed'
)<string, string, string>();

export const blockPageAction = createAsyncAction(
  '[Page] Block Request',
  '[Page] Block Success',
  '[Page] Block Failed'
)<{ pageId: string; unblockDate: string }, string, string>();

export const createTagAction = createAsyncAction(
  '[Tag] Create Request',
  '[Tag] Create Success',
  '[Tag] Create Failed'
)<string, TagData, string>();

export type PostsActionUnion =
  | ActionType<typeof fetchPostsAction>
  | ActionType<typeof createPostAction>
  | ActionType<typeof fetchSubscriptionsAction>
  | ActionType<typeof toggleFollowAction>
  | ActionType<typeof toggleLikeAction>
  | ActionType<typeof fetchPageDetailsAction>
  | ActionType<typeof fetchMyLikesAction>
  | ActionType<typeof fetchPostDetailsAction>
  | ActionType<typeof fetchRepliesAction>
  | ActionType<typeof createCommentAction>
  | ActionType<typeof fetchTagsAction>
  | ActionType<typeof fetchAllPagesAction>
  | ActionType<typeof createPageFormAction>
  | ActionType<typeof editPageAction>
  | ActionType<typeof deletePageAction>
  | ActionType<typeof editPostAction>
  | ActionType<typeof deletePostAction>
  | ActionType<typeof blockPageAction>
  | ActionType<typeof createTagAction>;
