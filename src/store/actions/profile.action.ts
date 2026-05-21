import { ActionType, createAsyncAction } from 'typesafe-actions';
import { AuthSuccessPayload } from './auth.action';

export enum ProfileTypes {
  FetchProfile = '[ProfileTypes] FetchProfile',
  FetchProfileSuccess = '[ProfileTypes] FetchProfileSuccess',
  FetchProfileFailed = '[ProfileTypes] FetchProfileFailed',

  UpdateProfile = '[ProfileTypes] UpdateProfile',
  UpdateProfileSuccess = '[ProfileTypes] UpdateProfileSuccess',
  UpdateProfileFailed = '[ProfileTypes] UpdateProfileFailed',
}

export const fetchProfileAction = createAsyncAction(
  ProfileTypes.FetchProfile,
  ProfileTypes.FetchProfileSuccess,
  ProfileTypes.FetchProfileFailed
)<void, AuthSuccessPayload, string>();

export const updateProfileAction = createAsyncAction(
  ProfileTypes.UpdateProfile,
  ProfileTypes.UpdateProfileSuccess,
  ProfileTypes.UpdateProfileFailed
)<{ name: string; surname: string; phone_number: string }, AuthSuccessPayload, string>();

export type ProfileActionUnion =
  | ActionType<typeof fetchProfileAction>
  | ActionType<typeof updateProfileAction>;
