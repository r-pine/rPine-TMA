export interface WalletBalances {
	data: {
		[key: string]: string;
	};
	isLoading: boolean;
	error: string | null;
}

export interface WalletState {
	address: string | null;
	isConnected: boolean;
	error: string | null;
	balances: {
		data: Record<string, string>;
		isLoading: boolean;
		error: string | null;
	};
	opineBalance: string;
	apineBalance: string;
	tonBalance: string;
	telegramData: {
		queryString: string | null;
		userId: string | null;
	};
}

export interface ConnectWalletPayload {
	address: string;
	balance: number;
}