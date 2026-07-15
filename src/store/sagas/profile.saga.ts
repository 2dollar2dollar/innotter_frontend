import { takeLatest, call, put, Effect } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import axios from 'axios';

import {
  fetchProfileAction,
  updateProfileAction,
  deleteProfileAction,
  uploadAvatarAction,
} from '../actions/profile.action';
import { AuthSuccessPayload } from '../actions/auth.action';

const API_URL =
  (import.meta as unknown as { env: { AUTH_API_URL?: string } }).env.AUTH_API_URL ||
  'http://localhost:8000/api/v1';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
});

const extractError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail) && detail.length > 0 && detail[0].msg) return detail[0].msg;
  } else if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong.';
};

export class ProfileSagaWorker {
  static *fetchProfile(): Generator<Effect, void, any> {
    try {
      const response = yield call(axios.get, `${API_URL}/users/me`, { headers: getAuthHeaders() });
      yield put(fetchProfileAction.success(response.data as AuthSuccessPayload));
    } catch (error: unknown) {
      yield put(fetchProfileAction.failure(extractError(error)));
    }
  }

  static *updateProfile({
    payload,
  }: ActionType<typeof updateProfileAction.request>): Generator<Effect, void, any> {
    try {
      // Отправляем патч на множественное число: users/me
      const response = yield call(axios.patch, `${API_URL}/users/me`, payload, {
        headers: getAuthHeaders(),
      });
      yield put(updateProfileAction.success(response.data as AuthSuccessPayload));
    } catch (error: unknown) {
      yield put(updateProfileAction.failure(extractError(error)));
    }
  }
}

function* deleteProfileWorker({
  payload,
}: ReturnType<typeof deleteProfileAction.request>): Generator<Effect, void, unknown> {
  try {
    // Удаляем из правильного эндпоинта
    yield call(axios.delete, `${API_URL}/users/me`, { headers: getAuthHeaders() });
    yield put(deleteProfileAction.success());
    localStorage.clear();
    payload.navigate('/login');
  } catch (error: unknown) {
    yield put(deleteProfileAction.failure(extractError(error)));
  }
}

function* uploadAvatarWorker({
  payload,
}: ReturnType<typeof uploadAvatarAction.request>): Generator<Effect, void, unknown> {
  try {
    // Бэкенд ждет multipart/form-data
    const formData = new FormData();
    formData.append('file', payload);

    const response = (yield call(axios.post, `${API_URL}/users/me/image`, formData, {
      headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' },
    })) as any;

    yield put(uploadAvatarAction.success(response.data.profile_image_url || ''));
    yield put(fetchProfileAction.request());
  } catch (error: unknown) {
    yield put(uploadAvatarAction.failure(extractError(error)));
  }
}

export function* profileSaga(): Generator<Effect, void> {
  yield takeLatest(fetchProfileAction.request, ProfileSagaWorker.fetchProfile);
  yield takeLatest(updateProfileAction.request, ProfileSagaWorker.updateProfile);
  yield takeLatest(deleteProfileAction.request, deleteProfileWorker);
  yield takeLatest(uploadAvatarAction.request, uploadAvatarWorker);
}
