import { RootState } from '../store';
import { createSelector } from '@reduxjs/toolkit';
import { convertToUserFriendlyAddress } from '../../shared/utils/addressUtils';

const selectWalletState = (state: RootState) => state.wallet;
const selectBalancesState = (state: RootState) => state.wallet.balances;

export const selectWalletAddress = (state: RootState) => state.wallet.address;

export const selectFormattedAddress = (state: RootState) => {
	const address = state.wallet.address;
	return address ? `${convertToUserFriendlyAddress(address).slice(0, 4)}...${convertToUserFriendlyAddress(address).slice(-4)}` : '';
};


export const selectIsWalletConnected = (state: RootState) => state.wallet.isConnected;
export const selectTelegramData = (state: RootState) => state.wallet.telegramData;

export const selectBalances = createSelector(
	[selectBalancesState],
	(balances) => balances?.data || {}
);

export const selectBalanceByAddress = createSelector(
	[selectBalances, (_, address: string) => address],
	(balances, address) => balances[address] || '0'
);

export const selectBalancesLoading = createSelector(
	[selectBalancesState],
	(balances) => balances?.isLoading || false
);

export const selectBalancesError = createSelector(
	[selectBalancesState],
	(balances) => balances?.error || null
);

export const selectWalletError = createSelector(
	[selectWalletState],
	(wallet) => wallet.error
);

export const selectTonBalance = (state: RootState) => state.wallet.tonBalance;

