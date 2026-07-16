import { authClient } from '~/api/client';

export interface UpdateProfilePayload {
  name?: string;
  surname?: string;
  phone_number?: string;
}

export const getProfile = async () => {
  const response = await authClient.get('/users/me');
  return response.data;
};

export const updateProfile = async (data: UpdateProfilePayload) => {
  const response = await authClient.patch('/users/me', data);
  return response.data;
};

// Предполагаем, что у тебя есть клиент для микросервиса пользователей (UMS)
export const deleteProfile = async () => {
  const response = await authClient.delete('/user/me');
  return response.data;
};

export const updateAvatar = async (payload: { image_extension: string }) => {
  const response = await authClient.patch('/user/me', payload);
  return response.data; // Ожидаем преподписанную upload_url от бэкенда
};
