import { createReducer } from 'typesafe-actions';
import {
  PostsActionUnion,
  fetchPostsAction,
  fetchSubscriptionsAction,
  toggleFollowAction,
  createPostAction,
  toggleLikeAction,
  fetchPageDetailsAction,
  PostData,
  fetchMyLikesAction,
  fetchPostDetailsAction,
  fetchRepliesAction,
  createCommentAction,
  fetchTagsAction,
  fetchAllPagesAction,
  TagData,
  PageItemData,
  editPageAction,
  deletePostAction,
  editPostAction,
  createTagAction,
} from '../actions/posts.action';

export interface CurrentPageDetails extends PageItemData {
  tags?: TagData[];
  user?: Record<string, unknown>;
  posts_count?: number;
  owner_group_name?: string;
  [key: string]: unknown;
}

export interface PostsState {
  items: PostData[];
  subscribedPageIds: string[];
  likedPostIds: string[];
  isLoading: boolean;
  error: string | null;
  feedType: 'global' | 'subscriptions' | 'page';
  currentPageDetails: CurrentPageDetails | null;
  currentPost: PostData | null;
  replies: PostData[];
  tags: TagData[];
  allPages: PageItemData[];
}

const initialState: PostsState = {
  items: [],
  subscribedPageIds: [],
  likedPostIds: [],
  isLoading: false,
  error: null,
  feedType: 'global',
  currentPageDetails: null,
  currentPost: null,
  replies: [],
  tags: [],
  allPages: [],
};

export const postsReducer = createReducer<PostsState, PostsActionUnion>(initialState)
  .handleAction(fetchPostsAction.request, (state, action) => ({
    ...state,
    isLoading: true,
    error: null,
    feedType: action.payload.feedType,
  }))
  .handleAction(fetchPostsAction.success, (state, action) => {
    const payload = action.payload as PostData[] | { results: PostData[] };
    const items = Array.isArray(payload) ? payload : payload.results || [];
    return { ...state, isLoading: false, items };
  })
  .handleAction(fetchPostsAction.failure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
  }))
  .handleAction(fetchSubscriptionsAction.success, (state, action) => ({
    ...state,
    subscribedPageIds: action.payload,
  }))
  .handleAction(toggleFollowAction.success, (state, action) => {
    const { pageId, isNowFollowed } = action.payload;

    const newSubscribed = isNowFollowed
      ? [...state.subscribedPageIds, pageId]
      : state.subscribedPageIds.filter((id) => id !== pageId);

    let newPageDetails = state.currentPageDetails;
    if (newPageDetails && newPageDetails.id === pageId) {
      const currentCount = newPageDetails.followers_count || 0;
      newPageDetails = {
        ...newPageDetails,
        followers_count: isNowFollowed ? currentCount + 1 : Math.max(0, currentCount - 1),
      };
    }

    return {
      ...state,
      subscribedPageIds: newSubscribed,
      currentPageDetails: newPageDetails,
    };
  })
  .handleAction(createPostAction.success, (state, action) => ({
    ...state,
    items: [action.payload, ...state.items],
  }))
  .handleAction(fetchMyLikesAction.success, (state, action) => ({
    ...state,
    likedPostIds: action.payload,
  }))
  .handleAction(toggleLikeAction.success, (state, action) => {
    const { postId, isNowLiked, newCount } = action.payload;

    const updateLikeCount = (post: PostData) => {
      if (post.id === postId) {
        const currentCount = post.likes_count || 0;
        return {
          ...post,
          is_liked: isNowLiked,
          likes_count:
            newCount !== undefined
              ? newCount
              : isNowLiked
                ? currentCount + 1
                : Math.max(0, currentCount - 1),
        };
      }
      return post;
    };

    return {
      ...state,
      likedPostIds: isNowLiked
        ? [...state.likedPostIds, postId]
        : state.likedPostIds.filter((id) => id !== postId),
      items: state.items.map(updateLikeCount),
      currentPost: state.currentPost ? updateLikeCount(state.currentPost) : null,
      replies: state.replies.map(updateLikeCount),
    };
  })
  .handleAction(fetchPageDetailsAction.request, (state) => ({
    ...state,
    currentPageDetails: null,
  }))
  .handleAction(fetchPageDetailsAction.success, (state, action) => ({
    ...state,
    currentPageDetails: action.payload as CurrentPageDetails,
  }))
  .handleAction(fetchPostDetailsAction.request, (state) => ({
    ...state,
    isLoading: true,
    currentPost: null,
    replies: [],
  }))
  .handleAction(fetchPostDetailsAction.success, (state, action) => ({
    ...state,
    isLoading: false,
    currentPost: action.payload,
  }))
  .handleAction(fetchRepliesAction.success, (state, action) => {
    const payload = action.payload as PostData[] | { results: PostData[] };
    const items = Array.isArray(payload) ? payload : payload.results || [];
    return { ...state, replies: items };
  })
  .handleAction(createCommentAction.success, (state, action) => ({
    ...state,
    replies: [...state.replies, action.payload],
    currentPageDetails: state.currentPageDetails
      ? {
          ...state.currentPageDetails,
          posts_count: (state.currentPageDetails.posts_count || 0) + 1,
        }
      : null,
  }))
  .handleAction(fetchTagsAction.success, (state, action) => {
    const payload = action.payload as unknown as TagData[] | { results: TagData[] };
    const tags = Array.isArray(payload) ? payload : payload.results || [];
    return { ...state, tags };
  })
  .handleAction(fetchAllPagesAction.success, (state, action) => {
    const payload = action.payload as unknown as PageItemData[] | { results: PageItemData[] };
    const pages = Array.isArray(payload) ? payload : payload.results || [];
    return { ...state, allPages: pages };
  })
  .handleAction(editPageAction.success, (state, action) => ({
    ...state,
    currentPageDetails: state.currentPageDetails
      ? { ...state.currentPageDetails, ...(action.payload as Record<string, unknown>) }
      : null,
  }))
  .handleAction(deletePostAction.success, (state, action) => {
    const deletedPostId = action.payload;
    return {
      ...state,
      items: state.items.filter((p) => p.id !== deletedPostId),
      replies: state.replies.filter((p) => p.id !== deletedPostId),
      currentPageDetails: state.currentPageDetails
        ? {
            ...state.currentPageDetails,
            posts_count: Math.max(0, (state.currentPageDetails.posts_count || 0) - 1),
          }
        : null,
    };
  })
  .handleAction(createTagAction.success, (state, action) => ({
    ...state,
    tags: [...state.tags, action.payload],
  }))
  .handleAction(editPostAction.success, (state, action) => {
    const updatedPost = action.payload;
    const mapPost = (p: PostData) => (p.id === updatedPost.id ? { ...p, ...updatedPost } : p);
    return {
      ...state,
      items: state.items.map(mapPost),
      replies: state.replies.map(mapPost),
      currentPost:
        state.currentPost?.id === updatedPost.id
          ? { ...state.currentPost, ...updatedPost }
          : state.currentPost,
    };
  });
