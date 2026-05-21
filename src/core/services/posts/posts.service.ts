import axios from 'axios';
import { postsClient } from '~/api/client';

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
  payload: { content: string; image_extension?: string }
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
