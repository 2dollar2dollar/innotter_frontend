import { authClient } from '~/api/client';
import { SignupFormValues } from '~/components/forms/SignupForm/SignupForm';
import { LoginFormValues } from '~/components/forms/LoginForm/types';

export const createAccount = async (data: SignupFormValues) => {
  const payload = {
    ...data,
    group_name: 'default',
  };
  const response = await authClient.post('/signup', payload);
  return response.data;
};

export const login = async (data: LoginFormValues) => {
  const formData = new URLSearchParams();
  formData.append('username', data.email || '');
  formData.append('password', data.password || '');

  const response = await authClient.post('/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await authClient.post('/reset-password', { email });
  return response.data; // Returns { detail: "If the account exists..." }
};
