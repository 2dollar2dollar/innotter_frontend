import { usersClient } from '~/api/client';

export interface UpdateProfilePayload {
  name?: string;
  surname?: string;
  phone_number?: string;
}

export const getProfile = async () => {
  const response = await usersClient.get('/me');
  return response.data;
};

export const updateProfile = async (data: UpdateProfilePayload) => {
  const response = await usersClient.patch('/me', data);
  return response.data;
};

export const deleteProfile = async () => {
  const response = await usersClient.delete('/me');
  return response.data;
};

export const updateAvatar = async (payload: { image_extension: string }) => {
  const response = await usersClient.patch('/me', payload);
  return response.data;
};
