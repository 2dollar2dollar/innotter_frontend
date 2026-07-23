import axios from 'axios';
import { postsClient, usersClient } from '~/api/client';

export const getGlobalPosts = async () => {
  const response = await postsClient.get('/post/');
  return response.data;
};

export const getSubscriptionFeed = async () => {
  const response = await postsClient.get('/feed/');
  return response.data;
};

export const getUserPages = async (userId: string) => {
  const response = await postsClient.get(`/page/?user_id=${userId}`);
  return response.data;
};

export const createPost = async (
  pageId: string,
  payload: { content: string; image_extension?: string; reply_to?: string | null } // <-- Добавили reply_to
) => {
  const response = await postsClient.post(`/page/${pageId}/post/`, payload);
  return response.data;
};

export const uploadImageToS3 = async (url: string, file: File) => {
  return axios.put(url, file, {
    headers: { 'Content-Type': file.type },
  });
};

export const getMySubscriptions = async () => {
  const response = await postsClient.get('/page/my-subscriptions/');
  return response.data;
};

export const followPage = async (pageId: string) => {
  const response = await postsClient.patch(`/page/${pageId}/follow/`);
  return response.data;
};

export const unfollowPage = async (pageId: string) => {
  const response = await postsClient.patch(`/page/${pageId}/unfollow/`);
  return response.data;
};

export const getUserById = async (userId: string) => {
  const response = await usersClient.get(`/${userId}`);
  return response.data;
};

export const toggleLikePost = async (postId: string) => {
  const response = await postsClient.post(`/post/${postId}/toggle-like/`);
  return response.data;
};

export const getPageById = async (pageId: string) => {
  const response = await postsClient.get(`/page/${pageId}/`);
  return response.data;
};

export const getPagePosts = async (pageId: string) => {
  const response = await postsClient.get(`/page/${pageId}/post/`);
  return response.data;
};

export const getMyLikes = async () => {
  const response = await postsClient.get('/post/my-likes/');
  return response.data;
};

export const getPostById = async (postId: string) => {
  const response = await postsClient.get(`/post/${postId}/`);
  return response.data;
};

export const getPostReplies = async (postId: string) => {
  const response = await postsClient.get(`/post/${postId}/replies/`);
  return response.data;
};

export const getAllTags = async () => {
  const response = await postsClient.get('/tags/');
  return response.data;
};

export const getAllPages = async (tags?: string) => {
  const url = tags ? `/page/?tags=${tags}` : '/page/';
  const response = await postsClient.get(url);
  return response.data;
};

export const createNewPage = async (pageData: any) => {
  const response = await postsClient.post('/page/', pageData);
  return response.data;
};

export const updatePage = async (pageId: string, payload: any) => {
  const response = await postsClient.patch(`/page/${pageId}/`, payload);
  return response.data;
};

export const deletePage = async (pageId: string) => {
  const response = await postsClient.delete(`/page/${pageId}/`);
  return response.data;
};

export const updatePost = async (postId: string, payload: any) => {
  const response = await postsClient.patch(`/post/${postId}/`, payload);
  return response.data;
};

export const deletePost = async (postId: string) => {
  const response = await postsClient.delete(`/post/${postId}/`);
  return response.data;
};

export const blockPage = async (pageId: string, unblockDate: string) => {
  const response = await postsClient.patch(`/page/${pageId}/block/`, { unblock_date: unblockDate });
  return response.data;
};

export const createTag = async (name: string) => {
  const response = await postsClient.post('/tags/', { name });
  return response.data;
};
