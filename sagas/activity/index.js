/* eslint-disable */

import { all, takeEvery } from 'redux-saga/effects';

import { ADD_DUMMY_MESSAGE, START_FETCH_MESSAGES } from '../../actions/activity';
import { addDummyMessageSaga, fetchMessagesSaga, watchNewMessages } from './sagas';

function* watchStartFetchMessages() {
  yield takeEvery(START_FETCH_MESSAGES, fetchMessagesSaga);
}

function* watchAddDummyMessage() {
  yield takeEvery(ADD_DUMMY_MESSAGE, addDummyMessageSaga);
}

export default function* rootSaga() {
  yield all([
    watchStartFetchMessages(),
    watchNewMessages(),
    watchAddDummyMessage(),
  ]);
}
