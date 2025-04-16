import { ThunkAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchBalance } from '../../entities/wallet/api/balance.api';
import { TonConnectUI } from '@tonconnect/ui-react';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserJettons } from '../../entities/assets/api/ton.api';
import {
	setBalances,
	setBalancesLoading,
	setBalancesError,
	setTonBalance,
	setWalletAddress,
	setIsConnected,
	setError,
	clearTelegramData
} from './slice';

const setupWalletListeners = (
	tonConnectUI: TonConnectUI,
	currentAddress: string,
	dispatch: any
) => {
	const interval = setInterval(async () => {
		try {
			const latestWallet = tonConnectUI.wallet;
			if (latestWallet?.account.address === currentAddress) {
				const jettons = await fetchUserJettons(currentAddress);
				const balances = jettons.balances.reduce((acc: { [key: string]: string }, jetton) => {
					acc[jetton.jetton.address] = jetton.balance;
					return acc;
				}, {});
				dispatch(setBalances(balances));
			}
		} catch (error) {
			console.error('Ошибка при обновлении баланса:', error);
		}
	}, 30000);

	const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
		if (!wallet || wallet.account.address !== currentAddress) {
			clearInterval(interval);
			unsubscribe();
			dispatch(setWalletAddress(null));
			dispatch(setIsConnected(false));
			dispatch(setError(null));
			dispatch(setBalances({}));
			dispatch(setBalancesLoading(false));
			dispatch(setBalancesError(null));
			dispatch(setTonBalance('0'));
			dispatch(clearTelegramData());
		}
	});

	return () => {
		clearInterval(interval);
		unsubscribe();
	};
};

const getBalancesWithTon = async (address: string, dispatch: any) => {
	try {
		const [jettons, tonBalance] = await Promise.all([
			fetchUserJettons(address),
			fetchBalance(address)
		]);

		dispatch(setTonBalance(tonBalance?.toString() || '0'));

		const balances = jettons.balances.reduce((acc: { [key: string]: string }, jetton) => {
			acc[jetton.jetton.address] = jetton.balance;
			return acc;
		}, {});

		if (tonBalance !== null) {
			balances['ton'] = tonBalance.toString();
		}

		return balances;
	} catch (error) {
		console.error('Error in getBalancesWithTon:', error);
		throw error;
	}
};

export const connectWallet = createAsyncThunk(
	'wallet/connect',
	async (_, { dispatch, getState }) => {
		try {
			const state = getState() as RootState;
			const address = state.wallet.address;

			if (!address) {
				throw new Error('Wallet address is not set');
			}

			const balances = await getBalancesWithTon(address, dispatch);
			dispatch(setBalances(balances));
			dispatch(setIsConnected(true));
			dispatch(setError(null));
		} catch (error) {
			dispatch(setError(error instanceof Error ? error.message : 'Failed to connect wallet'));
			dispatch(setIsConnected(false));
			throw error;
		}
	}
);

export const connectWalletWithTonConnect = (
	tonConnectUI: TonConnectUI
): ThunkAction<void, RootState, unknown, any> => {
	return async (dispatch) => {
		try {
			if (tonConnectUI.wallet) {
				const wallet = tonConnectUI.wallet;
				const currentAddress = wallet.account.address;
				dispatch(setWalletAddress(currentAddress));
				dispatch(setIsConnected(tonConnectUI.connected));
				dispatch(connectWallet());
				setupWalletListeners(tonConnectUI, currentAddress, dispatch);
				return;
			}

			await tonConnectUI.openModal();

			const unsubscribe = tonConnectUI.onStatusChange(async (wallet) => {
				if (!wallet) {
					dispatch(setWalletAddress(null));
					dispatch(setIsConnected(false));
					dispatch(clearTelegramData());
					unsubscribe();
					return;
				}

				const currentAddress = wallet.account.address;
				dispatch(setWalletAddress(currentAddress));
				dispatch(setIsConnected(tonConnectUI.connected));
				dispatch(connectWallet());
				setupWalletListeners(tonConnectUI, currentAddress, dispatch);
			});
		} catch (error) {
			console.error('Ошибка при подключении:', error);
			dispatch(setBalancesError(error instanceof Error ? error.message : 'Unknown error'));
		}
	};
};

export const disconnectWallet = createAsyncThunk(
	'wallet/disconnect',
	async (_, { dispatch }) => {
		try {
			dispatch(setWalletAddress(null));
			dispatch(setIsConnected(false));
			dispatch(setError(null));
			dispatch(setBalances({}));
			dispatch(setBalancesLoading(false));
			dispatch(setBalancesError(null));
			dispatch(setTonBalance('0'));
			dispatch(clearTelegramData());
		} catch (error) {
			dispatch(setError(error instanceof Error ? error.message : 'Failed to disconnect wallet'));
			throw error;
		}
	}
);

export const fetchBalancesThunk = createAsyncThunk(
	'wallet/fetchBalances',
	async (address: string, { dispatch }) => {
		try {
			dispatch(setBalancesLoading(true));
			const balances = await getBalancesWithTon(address, dispatch);
			dispatch(setBalances(balances));
			return balances;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Failed to fetch balances';
			dispatch(setBalancesError(errorMessage));
			throw error;
		}
	}
);