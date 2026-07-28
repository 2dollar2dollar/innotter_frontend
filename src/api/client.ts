import axios, { AxiosInstance } from 'axios';

const AUTH_API_URL = process.env.REACT_APP_AUTH_API_URL || '/api/v1/auth';
const POSTS_API_URL = process.env.REACT_APP_POSTS_API_URL || '/api/v1/posts';
const USERS_API_URL = process.env.REACT_APP_USERS_API_URL || '/api/v1/users';

const attachInterceptors = (client: AxiosInstance) => {
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes('/auth/login') &&
        !originalRequest.url?.includes('/auth/refresh-token')
      ) {
        originalRequest._retry = true;

        try {
          const refreshToken =
            localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');

          if (!refreshToken) throw new Error('No refresh token');

          const response = await axios.post(`${AUTH_API_URL}/refresh-token`, {
            refresh_token: refreshToken,
          });

          const { access_token, refresh_token } = response.data;
          localStorage.setItem('accessToken', access_token);

          if (localStorage.getItem('refreshToken')) {
            localStorage.setItem('refreshToken', refresh_token);
          } else {
            sessionStorage.setItem('refreshToken', refresh_token);
          }

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return client(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          sessionStorage.removeItem('refreshToken');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const authClient = attachInterceptors(axios.create({ baseURL: AUTH_API_URL }));
export const postsClient = attachInterceptors(axios.create({ baseURL: POSTS_API_URL }));
export const usersClient = attachInterceptors(axios.create({ baseURL: USERS_API_URL }));
