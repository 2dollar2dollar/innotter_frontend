import { takeLatest, call, put, Effect } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import axios from 'axios';

import {
  fetchPostsAction,
  createPostAction,
  fetchSubscriptionsAction,
  toggleFollowAction,
  PostData,
} from '../actions/posts.action';
import { getGlobalPosts, getSubscriptionFeed } from '~/core/services/posts/posts.service';
import * as PostsService from '~/core/services/posts/posts.service';

export class PostsSagaWorker {
  static *fetchPosts({
    payload,
  }: ActionType<typeof fetchPostsAction.request>): Generator<
    Effect,
    void,
    PostData[] | { results: PostData[] }
  > {
    try {
      const { feedType } = payload;
      const data = yield call(feedType === 'global' ? getGlobalPosts : getSubscriptionFeed);
      const postsArray = Array.isArray(data) ? data : data.results || [];
      yield put(fetchPostsAction.success(postsArray));
    } catch (error: unknown) {
      let errorMsg = 'Failed to load posts';
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        errorMsg =
          typeof error.response.data.detail === 'string'
            ? error.response.data.detail
            : 'Error loading posts';
      }
      yield put(fetchPostsAction.failure(errorMsg));
    }
  }
}

interface PageItem {
  id: string;
}
interface PagesResponse {
  results?: PageItem[];
}
interface CreatePostResponse extends PostData {
  upload_url?: string;
}

function* createPostWorker({
  payload,
}: ReturnType<typeof createPostAction.request>): Generator<Effect, void, unknown> {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No auth token found');

    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const userId = tokenPayload.id || tokenPayload.user_id || tokenPayload.sub;

    if (!userId) throw new Error('Cannot extract user ID from token');

    const pages = (yield call(PostsService.getUserPages, String(userId))) as
      | PagesResponse
      | PageItem[];
    const pageId = Array.isArray(pages) ? pages[0]?.id : pages.results?.[0]?.id;

    if (!pageId) {
      throw new Error('You do not have any Pages yet. Create a Page first!');
    }

    const postResponse = (yield call(PostsService.createPost, pageId, {
      content: payload.content,
      image_extension: payload.imageFile?.name.split('.').pop(),
    })) as CreatePostResponse;

    if (payload.imageFile && postResponse.upload_url) {
      yield call(PostsService.uploadImageToS3, postResponse.upload_url, payload.imageFile);
    }

    yield put(createPostAction.success(postResponse));
    yield put(fetchPostsAction.request({ feedType: 'global' }));
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(createPostAction.failure(error.message));
    } else {
      yield put(createPostAction.failure('An unknown error occurred'));
    }
  }
}

function* fetchSubscriptionsWorker(): Generator<Effect, void, unknown> {
  try {
    const data = (yield call(PostsService.getMySubscriptions)) as PagesResponse | PageItem[];
    const pages = Array.isArray(data) ? data : data.results || [];
    const pageIds = pages.map((p) => p.id);
    yield put(fetchSubscriptionsAction.success(pageIds));
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(fetchSubscriptionsAction.failure(error.message));
    }
  }
}

function* toggleFollowWorker({
  payload,
}: ReturnType<typeof toggleFollowAction.request>): Generator<Effect, void, unknown> {
  try {
    if (payload.isCurrentlyFollowed) {
      yield call(PostsService.unfollowPage, payload.pageId);
      yield put(toggleFollowAction.success({ pageId: payload.pageId, isNowFollowed: false }));
    } else {
      yield call(PostsService.followPage, payload.pageId);
      yield put(toggleFollowAction.success({ pageId: payload.pageId, isNowFollowed: true }));
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(toggleFollowAction.failure(error.message));
    }
  }
}

export function* postsSaga() {
  yield takeLatest(fetchPostsAction.request, PostsSagaWorker.fetchPosts);
  yield takeLatest(createPostAction.request, createPostWorker);
  yield takeLatest(fetchSubscriptionsAction.request, fetchSubscriptionsWorker);
  yield takeLatest(toggleFollowAction.request, toggleFollowWorker);
}
