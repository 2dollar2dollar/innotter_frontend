import { all, fork } from 'redux-saga/effects';
import { authSaga } from './auth.saga';
import { profileSaga } from './profile.saga';
import { postsSaga } from './posts.saga';

export function* rootSaga() {
  yield all([fork(authSaga), fork(profileSaga), fork(postsSaga)]);
}
