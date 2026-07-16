import { ActionType, createAsyncAction } from 'typesafe-actions';
import { NavigateFunction } from 'react-router-dom';
import { SignupFormValues } from '~/components/forms/SignupForm/SignupForm';
import { LoginFormValues } from '~/components/forms/LoginForm/types';

export enum AuthTypes {
  CreateAccount = '[AuthTypes] CreateAccount',
  CreateAccountSuccess = '[AuthTypes] CreateAccountSuccess',
  CreateAccountFailed = '[AuthTypes] CreateAccountFailed',

  Login = '[AuthTypes] Login',
  LoginSuccess = '[AuthTypes] LoginSuccess',
  LoginFailed = '[AuthTypes] LoginFailed',

  ForgotPassword = '[AuthTypes] ForgotPassword',
  ForgotPasswordSuccess = '[AuthTypes] ForgotPasswordSuccess',
  ForgotPasswordFailed = '[AuthTypes] ForgotPasswordFailed',
}

export interface AuthSuccessPayload {
  id: string;
  email: string;
  username: string;
  name: string;
  surname: string;
  role: string;
  is_blocked: boolean;
  phone_number?: string | null;
  profile_image_url?: string | null;
}

export interface TokenPayload {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export const createAccountAction = createAsyncAction(
  AuthTypes.CreateAccount,
  AuthTypes.CreateAccountSuccess,
  AuthTypes.CreateAccountFailed
)<{ values: SignupFormValues; navigate: NavigateFunction }, AuthSuccessPayload, string>();

export const loginAction = createAsyncAction(
  AuthTypes.Login,
  AuthTypes.LoginSuccess,
  AuthTypes.LoginFailed
)<{ values: LoginFormValues; navigate: NavigateFunction }, TokenPayload, string>();

export const forgotPasswordAction = createAsyncAction(
  AuthTypes.ForgotPassword,
  AuthTypes.ForgotPasswordSuccess,
  AuthTypes.ForgotPasswordFailed
)<{ email: string; navigate: NavigateFunction }, { detail: string }, string>();

export type AuthActionUnion =
  | ActionType<typeof createAccountAction>
  | ActionType<typeof loginAction>
  | ActionType<typeof forgotPasswordAction>;
