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
	tonBalance: '0',
	telegramData: {
		queryString: null,
		userId: null,
	},
}; 