import { takeLatest, call, put, Effect } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import axios from 'axios';

import {
  createAccountAction,
  loginAction,
  forgotPasswordAction,
  AuthSuccessPayload,
  TokenPayload,
} from '../actions/auth.action';
import { createAccount, login, forgotPassword } from '~/core/services/auth/auth.service';

const extractFastApiError = (error: unknown, defaultMsg: string): string => {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;

    if (typeof detail === 'string') {
      return detail;
    } else if (Array.isArray(detail) && detail.length > 0 && detail[0].msg) {
      return detail[0].msg;
    }
  } else if (error instanceof Error) {
    return error.message;
  }
  return defaultMsg;
};

export class AuthSagaWorker {
  static *createAccount({
    payload,
  }: ActionType<typeof createAccountAction.request>): Generator<Effect, void, AuthSuccessPayload> {
    const { values, navigate } = payload;

    try {
      const data = yield call(createAccount, values);
      yield put(createAccountAction.success(data));
      navigate('/login');
    } catch (error: unknown) {
      const errorMsg = extractFastApiError(error, 'Something went wrong.');
      yield put(createAccountAction.failure(errorMsg));
    }
  }

  static *login({
    payload,
  }: ActionType<typeof loginAction.request>): Generator<Effect, void, TokenPayload> {
    const { values, navigate } = payload;

    try {
      const data = yield call(login, values);

      localStorage.setItem('accessToken', data.access_token);
      if (values.rememberMe) {
        localStorage.setItem('refreshToken', data.refresh_token);
      } else {
        sessionStorage.setItem('refreshToken', data.refresh_token);
      }

      yield put(loginAction.success(data));

      navigate('/home');
    } catch (error: unknown) {
      const errorMsg = extractFastApiError(error, 'Invalid email or password.');
      yield put(loginAction.failure(errorMsg));
    }
  }

  static *forgotPassword({
    payload,
  }: ActionType<typeof forgotPasswordAction.request>): Generator<Effect, void, { detail: string }> {
    const { email, navigate } = payload;

    try {
      const data = yield call(forgotPassword, email);
      yield put(forgotPasswordAction.success(data));
      navigate('/login');
    } catch (error: unknown) {
      const errorMsg = extractFastApiError(error, 'Failed to send reset link.');
      yield put(forgotPasswordAction.failure(errorMsg));
    }
  }
}

export function* authSaga(): Generator<Effect, void> {
  yield takeLatest(createAccountAction.request, AuthSagaWorker.createAccount);
  yield takeLatest(loginAction.request, AuthSagaWorker.login);
  yield takeLatest(forgotPasswordAction.request, AuthSagaWorker.forgotPassword);
}
