import { createReducer } from 'typesafe-actions';
import {
  ProfileActionUnion,
  fetchProfileAction,
  updateProfileAction,
  uploadAvatarAction,
} from '../actions/profile.action';
import { AuthSuccessPayload } from '../actions/auth.action';

export interface ProfileState {
  data: AuthSuccessPayload | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  data: null,
  isLoading: false,
  isUpdating: false,
  error: null,
};

export const profileReducer = createReducer<ProfileState, ProfileActionUnion>(initialState)
  // Fetch
  .handleAction(fetchProfileAction.request, (state) => ({ ...state, isLoading: true, error: null }))
  .handleAction(fetchProfileAction.success, (state, action) => ({
    ...state,
    isLoading: false,
    data: action.payload,
  }))
  .handleAction(fetchProfileAction.failure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
  }))
  // Update
  .handleAction(updateProfileAction.request, (state) => ({
    ...state,
    isUpdating: true,
    error: null,
  }))
  .handleAction(updateProfileAction.success, (state, action) => ({
    ...state,
    isUpdating: false,
    data: action.payload,
  }))
  .handleAction(updateProfileAction.failure, (state, action) => ({
    ...state,
    isUpdating: false,
    error: action.payload,
  }))
  .handleAction(uploadAvatarAction.success, (state, action) => ({ // 👈 2. Добавь обработку загрузки аватарки!
    ...state,
    data: state.data ? { ...state.data, profile_image_url: action.payload } : null,
  }));
