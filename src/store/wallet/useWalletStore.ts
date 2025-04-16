import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { TonConnectUI } from '@tonconnect/ui-react';
import { connectWalletWithTonConnect, disconnectWallet } from './thunks';
import { selectWalletAddress, selectIsWalletConnected, selectBalances, selectTonBalance, selectFormattedAddress } from './selectors';
import {
	setBalances,
	setTonBalance,
	setWalletAddress,
	setIsConnected,
	setError,
	setTelegramData
} from './slice';
import { useEffect } from 'react';

const getTelegramData = () => {
	let queryString: string | null = null;
	let userId: string | null = null;

	if (window.Telegram?.WebApp?.initData) {
		queryString = decodeURI(window.Telegram.WebApp.initData);
		const params = new URLSearchParams(queryString);
		const userJson = params.get('user');

		if (userJson) {
			const user = JSON.parse(decodeURIComponent(userJson));
			userId = String(user.id);
		}
	}

	return { queryString, userId };
};

export const useWalletStore = (tonConnectUI: TonConnectUI) => {
	const dispatch = useDispatch<AppDispatch>();

	const address = useSelector(selectWalletAddress);
	const isConnected = useSelector(selectIsWalletConnected);
	const formattedAddress = useSelector(selectFormattedAddress);
	const balances = useSelector(selectBalances);
	const tonBalance = useSelector(selectTonBalance);

	useEffect(() => {
		const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
			if (wallet) {
				const address = wallet.account.address;
				dispatch(setWalletAddress(address));
				dispatch(setIsConnected(true));
			} else {
				dispatch(setWalletAddress(null));
				dispatch(setIsConnected(false));
			}
		});

		return () => {
			unsubscribe();
		};
	}, [tonConnectUI, dispatch]);

	const connect = async () => {
		try {
			const wallet = await tonConnectUI.connectWallet();
			if (wallet) {
				const address = wallet.account.address;
				dispatch(setWalletAddress(address));
				dispatch(setIsConnected(true));

				const telegramData = getTelegramData();
				dispatch(setTelegramData(telegramData));

				dispatch(connectWalletWithTonConnect(tonConnectUI));
			}
		} catch (error) {
			dispatch(setError(error instanceof Error ? error.message : 'Unknown error'));
		}
	};

	const disconnect = async () => {
		try {
			await tonConnectUI.disconnect();
			dispatch(disconnectWallet());
		} catch (error) {
			dispatch(setError(error instanceof Error ? error.message : 'Unknown error'));
		}
	};

	const updateBalances = (newBalances: Record<string, string>) => {
		dispatch(setBalances(newBalances));
	};

	const updateTonBalance = (newBalance: number | null) => {
		dispatch(setTonBalance(newBalance?.toString() || '0'));
	};

	return {
		address,
		formattedAddress,
		isConnected,
		connect,
		disconnect,
		balances,
		tonBalance,
		updateBalances,
		updateTonBalance
	};
}; 