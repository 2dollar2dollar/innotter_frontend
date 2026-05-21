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
