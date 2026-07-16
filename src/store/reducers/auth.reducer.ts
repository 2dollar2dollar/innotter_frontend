import { createReducer } from 'typesafe-actions';
import {
  AuthActionUnion,
  createAccountAction,
  loginAction,
  forgotPasswordAction,
} from '../actions/auth.action';

export interface AuthState {
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  isLoading: false,
  error: null,
  accessToken: null,
  refreshToken: null,
};

export const authReducer = createReducer<AuthState, AuthActionUnion>(initialState)
  // Signup
  .handleAction(createAccountAction.request, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  }))
  .handleAction(createAccountAction.success, (state) => ({
    ...state,
    isLoading: false,
  }))
  .handleAction(createAccountAction.failure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
  }))
  // Login
  .handleAction(loginAction.request, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  }))
  .handleAction(loginAction.success, (state, action) => ({
    ...state,
    isLoading: false,
    accessToken: action.payload.access_token,
    refreshToken: action.payload.refresh_token,
  }))
  .handleAction(loginAction.failure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
  }))
  // Forgot Password
  .handleAction(forgotPasswordAction.request, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  }))
  .handleAction(forgotPasswordAction.success, (state) => ({
    ...state,
    isLoading: false,
  }))
  .handleAction(forgotPasswordAction.failure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
  }));
