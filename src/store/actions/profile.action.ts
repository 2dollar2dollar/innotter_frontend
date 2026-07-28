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

export const deleteProfileAction = createAsyncAction(
  '[Profile] Delete Request',
  '[Profile] Delete Success',
  '[Profile] Delete Failed'
)<{ navigate: (path: string) => void }, void, string>();

export const uploadAvatarAction = createAsyncAction(
  '[Profile] Upload Avatar Request',
  '[Profile] Upload Avatar Success',
  '[Profile] Upload Avatar Failed'
)<File, string, string>();

export type ProfileActionUnion =
  | ActionType<typeof fetchProfileAction>
  | ActionType<typeof updateProfileAction>
  | ActionType<typeof deleteProfileAction>
  | ActionType<typeof uploadAvatarAction>;
