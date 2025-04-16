import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { AppDispatch, store } from '../store';
import {
	selectWalletAddress,
	selectIsWalletConnected,
	selectBalances,
	selectBalanceByAddress,
	selectBalancesLoading,
	selectBalancesError
} from './selectors';
import { connectWallet, fetchBalancesThunk } from './thunks';
import { setWalletAddress, setIsConnected, clearTelegramData } from './slice';

export const useWallet = () => {
	const dispatch = useDispatch<AppDispatch>();

	const address = useSelector(selectWalletAddress);
	const isConnected = useSelector(selectIsWalletConnected);
	const balances = useSelector(selectBalances);
	const isLoading = useSelector(selectBalancesLoading);
	const error = useSelector(selectBalancesError);

	const connect = (newAddress: string) => {
		dispatch(setWalletAddress(newAddress));
		dispatch(connectWallet());
	};

	const disconnect = () => {
		dispatch(setWalletAddress(null));
		dispatch(setIsConnected(false));
		dispatch(clearTelegramData());
	};

	const getBalance = useCallback((assetAddress: string) => {
		return selectBalanceByAddress(store.getState(), assetAddress);
	}, []);

	const refreshBalances = () => {
		if (address) {
			dispatch(fetchBalancesThunk(address));
		}
	};

	return {
		address,
		isConnected,
		balances,
		isLoading,
		error,
		connect,
		disconnect,
		getBalance,
		refreshBalances
	};
}; 