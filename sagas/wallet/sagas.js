/* eslint-disable */

import { all, call, put, select } from 'redux-saga/effects';
import _ from 'lodash';

import { sendMoneyFailed, sendMoneySuccess, walletsListUpdated, walletSyncFailed } from '../../actions/wallet';
import { getWallets, resolveBalance, sendMoney, syncWallet } from './serviceFunctions';
import { checkConnection } from '../connection';

export function* sendMoneySaga(action) {
  const state = yield select();
  const fromAddress = state.wallet.selectedWalletAddress;
  const toAddress = action.toEthAddress;
  const amount = action.amount;

  try {
    yield call(checkConnection);
    yield call(sendMoney, fromAddress, toAddress, amount);
    yield put(sendMoneySuccess());
  } catch (error) {
    console.log(error);
    yield put(sendMoneyFailed(error));
  }
}

function* resolveWalletBalance(walletWithoutBalance) {
  try {
    yield call(checkConnection);
    const wallet = yield call(resolveBalance, walletWithoutBalance);
    console.log(wallet);
    return wallet;
  } catch (error) {
    yield put(walletSyncFailed(walletWithoutBalance.ethAddress, error));
    throw error;
  }
}

export function* updateWalletList() {
  const walletsWithoutBalance = yield call(getWallets);
  yield put(walletsListUpdated(walletsWithoutBalance));
  // @todo Don't fail if only one fail
  try {
    const wallets = yield all(_.map(walletsWithoutBalance, wallet => call(resolveWalletBalance, wallet)));
    yield put(walletsListUpdated(wallets));
  } catch (error) {
    console.log(`Wallet list update failed with error: ${error.toString()}`);
  }
}

export function* updateWalletBalance(wallet) {
  try {
    yield call(checkConnection);
    yield call(syncWallet, wallet);
    yield updateWalletList();
  } catch (error) {
    console.log(`Wallet balance update failed with error: ${error.toString()}`);
  }
}

