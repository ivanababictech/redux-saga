/* eslint-disable */

import { all } from 'redux-saga/effects';

import wallet from './wallet';
import key from './key';
import profile from './profile';
import nations from './nations';
import activity from './activity';
import modifyNation from './modifyNation';
import transactions from './transactions';

export default function* rootSaga() {
  yield all([
    wallet(),
    profile(),
    nations(),
    key(),
    activity(),
    modifyNation(),
    transactions(),
  ]);
}
