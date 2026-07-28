import { takeLatest, call, put, Effect, all } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import axios from 'axios';

import {
  fetchPostsAction,
  createPostAction,
  fetchSubscriptionsAction,
  toggleFollowAction,
  toggleLikeAction,
  fetchPageDetailsAction,
  PostData,
  fetchMyLikesAction,
  fetchPostDetailsAction,
  fetchRepliesAction,
  createCommentAction,
  fetchTagsAction,
  fetchAllPagesAction,
  createPageFormAction,
  editPageAction,
  deletePageAction,
  editPostAction,
  deletePostAction,
  blockPageAction,
  createTagAction,
  TagData,
  PageItemData,
} from '../actions/posts.action';
import * as PostsService from '~/core/services/posts/posts.service';

interface UserData {
  id: string;
  username?: string;
  name?: string;
  surname?: string;
  email?: string;
  profile_image_url?: string | null;
}

interface FetchPostsResponse {
  results?: PostData[];
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
interface ToggleLikeResponse {
  likes_count: number;
}

function* fetchUserSafe(userId: string): Generator<Effect, UserData | null, unknown> {
  try {
    const data = (yield call(PostsService.getUserById, userId)) as UserData;
    return data;
  } catch (error: unknown) {
    return null;
  }
}

export class PostsSagaWorker {
  static *fetchPosts({
    payload,
  }: ActionType<typeof fetchPostsAction.request>): Generator<Effect, void, unknown> {
    try {
      const { feedType, pageId } = payload;
      let data;

      if (feedType === 'global') {
        data = (yield call(PostsService.getGlobalPosts)) as PostData[] | FetchPostsResponse;
      } else if (feedType === 'subscriptions') {
        data = (yield call(PostsService.getSubscriptionFeed)) as PostData[] | FetchPostsResponse;
      } else if (feedType === 'page' && pageId) {
        data = (yield call(PostsService.getPagePosts, pageId)) as PostData[] | FetchPostsResponse;
      } else {
        throw new Error('Unknown feed type or missing pageId');
      }

      const postsArray: PostData[] = Array.isArray(data) ? data : data?.results || [];

      const userIds = [
        ...new Set([
          ...postsArray.map((p) => p.page_details?.user_id).filter(Boolean),
          ...postsArray.map((p) => p.author_id).filter(Boolean),
        ]),
      ] as string[];

      const usersResponses = (yield all(
        userIds.map((id) => call(fetchUserSafe, id))
      )) as (UserData | null)[];

      const usersMap: Record<string, UserData> = {};
      usersResponses.forEach((u) => {
        if (u && u.id) {
          usersMap[u.id] = {
            id: u.id,
            username: u.username,
            name: u.name,
            surname: u.surname,
            profile_image_url: u.profile_image_url,
          };
        }
      });

      const enrichedPosts = postsArray.map((post) => ({
        ...post,
        author: post.author_id ? usersMap[post.author_id] : undefined,
        page_details: post.page_details
          ? {
              ...post.page_details,
              user: usersMap[post.page_details.user_id],
            }
          : undefined,
      }));

      yield put(fetchPostsAction.success(enrichedPosts));
    } catch (error: unknown) {
      let errorMsg = 'Failed to load posts';
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        errorMsg =
          typeof error.response.data.detail === 'string'
            ? error.response.data.detail
            : 'Error loading posts';
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      yield put(fetchPostsAction.failure(errorMsg));
    }
  }
}

function* createPostWorker({
  payload,
}: ReturnType<typeof createPostAction.request>): Generator<Effect, void, unknown> {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No auth token found');
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const userId = tokenPayload.id || tokenPayload.user_id || tokenPayload.sub;

    let targetPageId = payload.pageId;

    if (!targetPageId) {
      const pages = (yield call(PostsService.getUserPages, String(userId))) as
        | PagesResponse
        | PageItem[];
      targetPageId = Array.isArray(pages) ? pages[0]?.id : pages.results?.[0]?.id;
    }

    if (!targetPageId) throw new Error('You do not have any Pages yet. Create a Page first!');

    const postResponse = (yield call(PostsService.createPost, targetPageId, {
      content: payload.content,
      image_extension: payload.imageFile?.name.split('.').pop(),
    })) as CreatePostResponse;

    if (payload.imageFile && postResponse.upload_url) {
      yield call(PostsService.uploadImageToS3, postResponse.upload_url, payload.imageFile);
    }

    const user = yield call(fetchUserSafe, String(userId));
    if (user) {
      postResponse.author = user as UserData;
    }

    yield put(createPostAction.success(postResponse));
  } catch (error: unknown) {
    if (error instanceof Error) yield put(createPostAction.failure(error.message));
  }
}

function* fetchSubscriptionsWorker(): Generator<Effect, void, unknown> {
  try {
    const data = (yield call(PostsService.getMySubscriptions)) as PagesResponse | PageItem[];
    const pages = Array.isArray(data) ? data : data.results || [];
    yield put(fetchSubscriptionsAction.success(pages.map((p) => p.id)));
  } catch (error: unknown) {
    if (error instanceof Error) yield put(fetchSubscriptionsAction.failure(error.message));
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
    if (error instanceof Error) yield put(toggleFollowAction.failure(error.message));
  }
}

function* toggleLikeWorker({
  payload,
}: ReturnType<typeof toggleLikeAction.request>): Generator<Effect, void, unknown> {
  try {
    const response = (yield call(
      PostsService.toggleLikePost,
      payload.postId
    )) as ToggleLikeResponse;
    yield put(
      toggleLikeAction.success({
        postId: payload.postId,
        isNowLiked: !payload.isLiked,
        newCount: response?.likes_count,
      })
    );
  } catch (error: unknown) {
    if (error instanceof Error) yield put(toggleLikeAction.failure(error.message));
  }
}

function* fetchPageDetailsWorker({
  payload: pageId,
}: ReturnType<typeof fetchPageDetailsAction.request>): Generator<Effect, void, unknown> {
  try {
    const data = (yield call(PostsService.getPageById, pageId)) as Record<string, unknown>;

    if (data && typeof data.user_id === 'string') {
      const user = yield call(fetchUserSafe, data.user_id);
      if (user) {
        data.user = user;
      }
    }

    yield put(fetchPageDetailsAction.success(data));
  } catch (error: unknown) {
    if (error instanceof Error) yield put(fetchPageDetailsAction.failure(error.message));
  }
}

function* fetchMyLikesWorker(): Generator<Effect, void, unknown> {
  try {
    const data = (yield call(PostsService.getMyLikes)) as
      | { results?: { id: string }[] }
      | { id: string }[];
    const posts = Array.isArray(data) ? data : data.results || [];
    yield put(fetchMyLikesAction.success(posts.map((p) => p.id)));
  } catch (error: unknown) {
    if (error instanceof Error) yield put(fetchMyLikesAction.failure(error.message));
  }
}

function* fetchPostDetailsWorker({
  payload: postId,
}: ReturnType<typeof fetchPostDetailsAction.request>): Generator<Effect, void, unknown> {
  try {
    const post = (yield call(PostsService.getPostById, postId)) as PostData;

    const authorId = post.author_id || post.page_details?.user_id;
    if (authorId) {
      const user = yield call(fetchUserSafe, authorId);
      if (user) {
        if (post.author_id) post.author = user as UserData;
        else if (post.page_details) post.page_details.user = user as UserData;
      }
    }
    yield put(fetchPostDetailsAction.success(post));
  } catch (error: unknown) {
    if (error instanceof Error) yield put(fetchPostDetailsAction.failure(error.message));
  }
}

function* fetchRepliesWorker({
  payload: postId,
}: ReturnType<typeof fetchRepliesAction.request>): Generator<Effect, void, unknown> {
  try {
    const data = (yield call(PostsService.getPostReplies, postId)) as
      | FetchPostsResponse
      | PostData[];
    const repliesArray: PostData[] = Array.isArray(data) ? data : data?.results || [];

    const userIds = [
      ...new Set(repliesArray.map((p) => p.author_id || p.page_details?.user_id).filter(Boolean)),
    ] as string[];

    const usersResponses = (yield all(
      userIds.map((id) => call(fetchUserSafe, id))
    )) as (UserData | null)[];
    const usersMap: Record<string, UserData> = {};
    usersResponses.forEach((u) => {
      if (u && u.id) usersMap[u.id] = u;
    });

    const enrichedReplies = repliesArray.map((reply) => ({
      ...reply,
      author: reply.author_id ? usersMap[reply.author_id] : undefined,
      page_details: reply.page_details
        ? { ...reply.page_details, user: usersMap[reply.page_details.user_id] }
        : undefined,
    }));

    yield put(fetchRepliesAction.success(enrichedReplies));
  } catch (error: unknown) {
    if (error instanceof Error) yield put(fetchRepliesAction.failure(error.message));
  }
}

function* createCommentWorker({
  payload,
}: ReturnType<typeof createCommentAction.request>): Generator<Effect, void, unknown> {
  try {
    const requestPayload: Record<string, unknown> = {
      content: payload.content,
      reply_to: payload.replyTo,
    };

    if (payload.file) {
      requestPayload.image_extension = payload.file.name.split('.').pop();
    }

    const responseComment = (yield call(
      PostsService.createPost,
      payload.pageId,
      requestPayload as any
    )) as {
      data?: PostData & { upload_url?: string };
      upload_url?: string;
      author_id?: string;
    } & PostData;

    const newComment = responseComment.data || responseComment;

    if (newComment.upload_url && payload.file) {
      yield call(PostsService.uploadImageToS3, newComment.upload_url, payload.file);
    }

    if (newComment.author_id) {
      const user = yield call(fetchUserSafe, newComment.author_id);
      if (user) newComment.author = user as UserData;
    }

    yield put(createCommentAction.success(newComment));
  } catch (error: unknown) {
    let errorMsg = 'Failed to create comment';
    if (axios.isAxiosError(error) && error.response?.data?.detail) {
      errorMsg = String(error.response.data.detail);
    } else if (error instanceof Error) {
      errorMsg = error.message;
    }
    yield put(createCommentAction.failure(errorMsg));
  }
}

function* fetchTagsWorker(): Generator<Effect, void, unknown> {
  try {
    const data = (yield call(PostsService.getAllTags)) as TagData[] | { results: TagData[] };
    yield put(fetchTagsAction.success(Array.isArray(data) ? data : data.results || []));
  } catch (error: unknown) {
    if (error instanceof Error) yield put(fetchTagsAction.failure(error.message));
  }
}

function* fetchAllPagesWorker({
  payload,
}: ReturnType<typeof fetchAllPagesAction.request>): Generator<Effect, void, unknown> {
  try {
    const tags = payload ? payload.tags : undefined;
    const data = (yield call(PostsService.getAllPages, tags)) as
      | PageItemData[]
      | { results: PageItemData[] };
    const pagesArray = Array.isArray(data) ? data : data?.results || [];

    const userIds = [...new Set(pagesArray.map((p) => p.user_id).filter(Boolean))] as string[];
    const usersResponses = (yield all(
      userIds.map((id) => call(fetchUserSafe, id))
    )) as (UserData | null)[];

    const usersMap: Record<string, UserData> = {};
    usersResponses.forEach((u) => {
      if (u && u.id) usersMap[u.id] = u;
    });

    const enrichedPages = pagesArray.map((p) => ({
      ...p,
      user: p.user_id ? usersMap[p.user_id] : undefined,
    }));

    yield put(fetchAllPagesAction.success(enrichedPages as PageItemData[]));
  } catch (error: unknown) {
    if (error instanceof Error) yield put(fetchAllPagesAction.failure(error.message));
  }
}

function* createPageFormWorker({
  payload,
}: ReturnType<typeof createPageFormAction.request>): Generator<Effect, void, unknown> {
  try {
    const requestData: Record<string, unknown> = {
      name: payload.name,
      description: payload.description,
      tag_names: payload.tag_names,
    };

    if (payload.file) {
      requestData.image_extension = payload.file.name.split('.').pop();
    }

    const response = (yield call(PostsService.createNewPage, requestData)) as {
      data?: { id: string; upload_url?: string };
      id?: string;
      upload_url?: string;
    };
    const newPage = response.data || response;

    if (newPage.upload_url && payload.file) {
      yield call(axios.put, newPage.upload_url, payload.file, {
        headers: { 'Content-Type': payload.file.type },
      });
    }

    yield put(createPageFormAction.success(newPage));
    payload.navigate(`/page/${newPage.id}`);
  } catch (error: unknown) {
    let errorMsg = 'Failed to create page';
    if (axios.isAxiosError(error) && error.response?.data?.detail) {
      errorMsg = String(error.response.data.detail);
    } else if (error instanceof Error) {
      errorMsg = error.message;
    }
    yield put(createPageFormAction.failure(errorMsg));
  }
}

function* editPageWorker({
  payload,
}: ReturnType<typeof editPageAction.request>): Generator<Effect, void, unknown> {
  try {
    const requestData: Record<string, unknown> = {};
    if (payload.name) requestData.name = payload.name;
    if (payload.description !== undefined) requestData.description = payload.description;
    if (payload.tag_names) requestData.tag_names = payload.tag_names;

    if (payload.file) requestData.image_extension = payload.file.name.split('.').pop();

    const response = (yield call(PostsService.updatePage, payload.pageId, requestData)) as any;
    const updatedPage = { ...(response.data || response) };

    if (payload.file) {
      if (updatedPage.upload_url) {
        yield call(axios.put, updatedPage.upload_url, payload.file, {
          headers: { 'Content-Type': payload.file.type },
        });

        const newImageUrl = updatedPage.upload_url.split('?')[0];
        updatedPage.image_url = `${newImageUrl}?t=${Date.now()}`;
      } else {
        console.error(
          "❌ ОШИБКА: Файл выбран, но бэкенд НЕ вернул 'upload_url'! Метод partial_update на бэкенде игнорирует картинку."
        );
      }
    }

    yield put(editPageAction.success(updatedPage));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    yield put(editPageAction.failure(msg));
  }
}

function* deletePageWorker({
  payload,
}: ReturnType<typeof deletePageAction.request>): Generator<Effect, void, unknown> {
  try {
    yield call(PostsService.deletePage, payload.pageId);
    yield put(deletePageAction.success(payload.pageId));
    payload.navigate('/home');
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    yield put(deletePageAction.failure(msg));
  }
}

function* editPostWorker({
  payload,
}: ReturnType<typeof editPostAction.request>): Generator<Effect, void, unknown> {
  try {
    const requestData: Record<string, unknown> = {};
    if (payload.content !== undefined) requestData.content = payload.content;
    if (payload.file) requestData.image_extension = payload.file.name.split('.').pop();

    const response = (yield call(PostsService.updatePost, payload.postId, requestData)) as any;
    const updatedPost = { ...(response.data || response) };

    if (payload.file) {
      if (updatedPost.upload_url) {
        yield call(axios.put, updatedPost.upload_url, payload.file, {
          headers: { 'Content-Type': payload.file.type },
        });
        const newImageUrl = updatedPost.upload_url.split('?')[0];
        updatedPost.image_url = `${newImageUrl}?t=${Date.now()}`;
      } else {
        console.error("❌ ОШИБКА: Файл выбран, но бэкенд НЕ вернул 'upload_url' для поста!");
      }
    }

    yield put(editPostAction.success(updatedPost));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    yield put(editPostAction.failure(msg));
  }
}

function* deletePostWorker({
  payload,
}: ReturnType<typeof deletePostAction.request>): Generator<Effect, void, unknown> {
  try {
    yield call(PostsService.deletePost, payload);
    yield put(deletePostAction.success(payload));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    yield put(deletePostAction.failure(msg));
  }
}

function* blockPageWorker({
  payload,
}: ReturnType<typeof blockPageAction.request>): Generator<Effect, void, unknown> {
  try {
    yield call(PostsService.blockPage, payload.pageId, payload.unblockDate);
    yield put(blockPageAction.success(payload.pageId));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    yield put(blockPageAction.failure(msg));
  }
}

function* createTagWorker({
  payload,
}: ReturnType<typeof createTagAction.request>): Generator<Effect, void, unknown> {
  try {
    const data = (yield call(PostsService.createTag, payload)) as TagData;
    yield put(createTagAction.success(data));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    yield put(createTagAction.failure(msg));
  }
}

export function* postsSaga() {
  yield takeLatest(fetchPostsAction.request, PostsSagaWorker.fetchPosts);
  yield takeLatest(createPostAction.request, createPostWorker);
  yield takeLatest(fetchSubscriptionsAction.request, fetchSubscriptionsWorker);
  yield takeLatest(toggleFollowAction.request, toggleFollowWorker);
  yield takeLatest(toggleLikeAction.request, toggleLikeWorker);
  yield takeLatest(fetchPageDetailsAction.request, fetchPageDetailsWorker);
  yield takeLatest(fetchMyLikesAction.request, fetchMyLikesWorker);
  yield takeLatest(fetchPostDetailsAction.request, fetchPostDetailsWorker);
  yield takeLatest(fetchRepliesAction.request, fetchRepliesWorker);
  yield takeLatest(createCommentAction.request, createCommentWorker);
  yield takeLatest(fetchTagsAction.request, fetchTagsWorker);
  yield takeLatest(fetchAllPagesAction.request, fetchAllPagesWorker);
  yield takeLatest(createPageFormAction.request, createPageFormWorker);
  yield takeLatest(editPageAction.request, editPageWorker);
  yield takeLatest(deletePageAction.request, deletePageWorker);
  yield takeLatest(editPostAction.request, editPostWorker);
  yield takeLatest(deletePostAction.request, deletePostWorker);
  yield takeLatest(blockPageAction.request, blockPageWorker);
  yield takeLatest(createTagAction.request, createTagWorker);
}
