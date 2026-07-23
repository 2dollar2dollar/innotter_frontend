import { takeLatest, call, put, Effect } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import axios from 'axios';

import { usersClient, resizerClient } from '~/api/client';

import {
  fetchProfileAction,
  updateProfileAction,
  deleteProfileAction,
  uploadAvatarAction,
} from '../actions/profile.action';
import { AuthSuccessPayload } from '../actions/auth.action';

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
  // static *fetchProfile(): Generator<Effect, void, any> {
  //   try {
  //     const response = yield call(usersClient.get, '/me');
  //     yield put(fetchProfileAction.success(response.data as AuthSuccessPayload));
  //   } catch (error: unknown) {
  //     yield put(fetchProfileAction.failure(extractError(error)));
  //   }
  // }
  static *fetchProfile(): Generator<Effect, void, any> {
    try {
      const response = yield call(usersClient.get, '/me');
      const profileData = response.data as AuthSuccessPayload;

      if (profileData && profileData.id) {
        try {
          const urlResponse = (yield call(
            resizerClient.get,
            `/presigned-url?object_key=cropped/${profileData.id}.jpg`
          )) as any;

          if (urlResponse.data?.presigned_url) {
            profileData.profile_image_url = `${urlResponse.data.presigned_url}&t=${Date.now()}`;
            // profileData.profile_image_url = `${urlResponse.data.presigned_url}`;
          }
        } catch {
          // Ignore if avatar does not exist in resizer-service yet
        }
      }

      yield put(fetchProfileAction.success(profileData));
    } catch (error: unknown) {
      yield put(fetchProfileAction.failure(extractError(error)));
    }
  }

  static *updateProfile({
    payload,
  }: ActionType<typeof updateProfileAction.request>): Generator<Effect, void, any> {
    try {
      const response = yield call(usersClient.patch, '/me', payload);
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
    yield call(usersClient.delete, '/me');
    yield put(deleteProfileAction.success());
    localStorage.clear();
    payload.navigate('/login');
  } catch (error: unknown) {
    yield put(deleteProfileAction.failure(extractError(error)));
  }
}
//
// function* uploadAvatarWorker({
//  payload,
// }: ReturnType<typeof uploadAvatarAction.request>): Generator<Effect, void, unknown> {
//  try {
//    const formData = new FormData();
//    formData.append('file', payload);
//
//    const response = (yield call(usersClient.post, '/me/image', formData, {
//      headers: { 'Content-Type': 'multipart/form-data' },
//    })) as any;
//
//    yield put(uploadAvatarAction.success(response.data.profile_image_url || ''));
//    yield put(fetchProfileAction.request());
//  } catch (error: unknown) {
//    yield put(uploadAvatarAction.failure(extractError(error)));
//  }
// }

function* uploadAvatarWorker({
  payload,
}: ReturnType<typeof uploadAvatarAction.request>): Generator<Effect, void, unknown> {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No access token');
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const userId = tokenPayload.id || tokenPayload.user_id || tokenPayload.sub;

    const formData = new FormData();
    formData.append('file', payload);

    const resizerResponse = (yield call(resizerClient.post, `/upload?user_id=${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })) as any;

    const objectKey = resizerResponse.data.object_key;

    const urlResponse = (yield call(
      resizerClient.get,
      `/presigned-url?object_key=${objectKey}`
    )) as any;

    const finalUrl = urlResponse.data.presigned_url;

    yield put(uploadAvatarAction.success(finalUrl));
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
