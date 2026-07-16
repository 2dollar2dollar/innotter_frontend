import { combineReducers } from 'redux';
import { authReducer } from './auth.reducer';
import { profileReducer } from './profile.reducer';
import { postsReducer } from './posts.reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  posts: postsReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;
