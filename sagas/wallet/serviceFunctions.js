/* eslint-disable */

import containerPromise from '../../services/container';
import { convertWallets } from '../../utils/wallet';
import { BALANCE_EXPIRATION_INTERVAL } from '../../global/Constants';

export async function getWallets() {
  const container = await containerPromise;
  const walletsObject = await container.eth.utils.allKeyPairs();
  return convertWallets(walletsObject);
}

export async function syncWallet(wallet) {
  const container = await containerPromise;
  return await container.eth.wallet.ethSync(wallet.ethAddress);
}

export async function resolveBalance(wallet) {
  const container = await containerPromise;
  const walletObject = await container.eth.wallet.ethBalance(wallet.ethAddress);

  if (walletObject === null ||
    (new Date()).getTime() - walletObject.synced_at.getTime() > BALANCE_EXPIRATION_INTERVAL) {
    try {
      await syncWallet(wallet);
      return await resolveBalance(wallet);
    } catch (error) {
      throw error;
    }
  }

  return { ...wallet, balance: walletObject.amount };
}

export async function sendMoney(fromAddress, toAddress, amount) {
  const container = await containerPromise;
  return await container.eth.wallet.ethSend(fromAddress, toAddress, amount);
}
