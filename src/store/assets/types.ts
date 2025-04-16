export interface Asset {
	type: 'native' | 'jetton';
	address: string;
	name: string;
	symbol: string;
	image: string;
	decimals: number;
	verification: string;
	isScam: boolean;
	isWallet: boolean;
	balance?: string;
	showWarning?: boolean;
}

export interface AssetsState {
	assets: Asset[];
	userAssets: Asset[];
	loading: boolean;
	error: string | null;
}

export interface AssetsResponse {
	assets: Asset[];
}
