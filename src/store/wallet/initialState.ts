import { WalletState } from './types';

export const initialState: WalletState = {
	address: null,
	isConnected: false,
	error: null,
	balances: {
		data: {},
		isLoading: false,
		error: null,
	},
	opineBalance: '0',
	apineBalance: '0',
	tonBalance: '0',
	telegramData: {
		queryString: null,
		userId: null,
	},
}; 