import { createReducer } from 'typesafe-actions';
import {
  PostsActionUnion,
  fetchPostsAction,
  fetchSubscriptionsAction,
  toggleFollowAction,
  PostData,
} from '../actions/posts.action';

export interface PostsState {
  items: PostData[];
  subscribedPageIds: string[];
  isLoading: boolean;
  error: string | null;
  feedType: 'global' | 'subscriptions';
}

const initialState: PostsState = {
  items: [],
  subscribedPageIds: [],
  isLoading: false,
  error: null,
  feedType: 'global',
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
    return {
      ...state,
      subscribedPageIds: isNowFollowed
        ? [...state.subscribedPageIds, pageId]
        : state.subscribedPageIds.filter((id) => id !== pageId),
    };
  });
