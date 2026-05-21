import { takeLatest, call, put, Effect } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import axios from 'axios';

import { fetchProfileAction, updateProfileAction } from '../actions/profile.action';
import { AuthSuccessPayload } from '../actions/auth.action';
import { getProfile, updateProfile } from '~/core/services/profile/profile.service';

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
  static *fetchProfile(): Generator<Effect, void, AuthSuccessPayload> {
    try {
      const data = yield call(getProfile);
      yield put(fetchProfileAction.success(data));
    } catch (error: unknown) {
      yield put(fetchProfileAction.failure(extractError(error)));
    }
  }

  static *updateProfile({
    payload,
  }: ActionType<typeof updateProfileAction.request>): Generator<Effect, void, AuthSuccessPayload> {
    try {
      const data = yield call(updateProfile, payload);
      yield put(updateProfileAction.success(data));
    } catch (error: unknown) {
      yield put(updateProfileAction.failure(extractError(error)));
    }
  }
}

export function* profileSaga(): Generator<Effect, void> {
  yield takeLatest(fetchProfileAction.request, ProfileSagaWorker.fetchProfile);
  yield takeLatest(updateProfileAction.request, ProfileSagaWorker.updateProfile);
}
