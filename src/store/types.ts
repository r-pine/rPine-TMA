export interface Currency {
	address: string;
	symbol: string;
	name: string;
	image: string;
	decimals: number;
	exchangeRate: number;
	balance?: number;
}

export interface DexInfo {
	address: string;
	name: string;
	image: string;
	type: 'DEX' | 'Aggregator';
}

export interface RouteStep {
	dex: DexInfo;
	input: Currency;
	output: Currency;
	amountIn: number;
	amountOut: number;
}

export interface SwapRoute {
	inputAmount: number;
	outputAmount: number;
	slippage: number;
	fee: {
		percent: number;
		usd: number;
	};
	steps: RouteStep[];
	timestamp: number;
}

export interface WalletState {
	address: string | null;
	balance: number;
	isConnected: boolean;
	loading: boolean;
	error: string | null;
}

export interface CurrenciesState {
	list: Currency[];
	popular: Currency[];
	lastUpdated: number;
	loading: boolean;
	error: string | null;
}

export interface SwapState {
	from: Currency | null;
	to: Currency | null;
	inputAmount: number;
	outputAmount: number;
	routes: Record<string, SwapRoute>;
	loading: boolean;
	error: string | null;
}

export interface SettingsState {
	slippage: number;
	lastUsedPairs: Array<{ from: string; to: string }>;
}

export interface RootState {
	wallet: WalletState;
	currencies: CurrenciesState;
	swap: SwapState;
	settings: SettingsState;
}

