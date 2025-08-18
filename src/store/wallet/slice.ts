import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WalletState } from './types';

const initialState: WalletState = {
	address: null,
	isConnected: false,
	error: null,
	balances: {
		data: {},
		isLoading: false,
		error: null
	},
	tonBalance: '0',
	telegramData: {
		queryString: null,
		userId: null
	}
};

const walletSlice = createSlice({
	name: 'wallet',
	initialState,
	reducers: {
		setWalletAddress: (state, action: PayloadAction<string | null>) => {
			state.address = action.payload;
		},
		setIsConnected: (state, action: PayloadAction<boolean>) => {
			state.isConnected = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
		setBalances: (state, action: PayloadAction<Record<string, string>>) => {
			state.balances.data = action.payload;
		},
		setBalancesLoading: (state, action: PayloadAction<boolean>) => {
			state.balances.isLoading = action.payload;
		},
		setBalancesError: (state, action: PayloadAction<string | null>) => {
			state.balances.error = action.payload;
		},
		setTonBalance: (state, action: PayloadAction<string>) => {
			state.tonBalance = action.payload;
		},
		setTelegramData: (state, action: PayloadAction<{ queryString: string | null; userId: string | null }>) => {
			state.telegramData = action.payload;
		},
		clearTelegramData: (state) => {
			state.telegramData = {
				queryString: null,
				userId: null
			};
		}
	}
});

export const {
	setWalletAddress,
	setIsConnected,
	setError,
	setBalances,
	setBalancesLoading,
	setBalancesError,
	setTonBalance,
	setTelegramData,
	clearTelegramData
} = walletSlice.actions;

export default walletSlice.reducer;