export interface RouteStep {
	dex: {
		type: string;
		address: string;
		name: string;
		image: string;
	};
	inputAsset: {
		address: string;
		symbol: string;
		name: string;
		image: string;
	};
	outputAsset: {
		address: string;
		symbol: string;
		name: string;
		image: string;
	};
}

export interface Route {
	inputPercent: number;
	inputAmount: number;
	routeSteps: RouteStep[];
}

export interface DisplayData {
	inputAssetAmount: number;
	inputAssetUsdAmount: number;
	outputAssetAmount: number;
	outputAssetUsdAmount: number;
	minOutputAssetAmount: number;
	exchangeRate: number;
	maxSlippage: number;
	routingFeePercent: number;
	priceImprovementPercent: number;
	roughGasFee: number;
	roughGasUsdFee: number;
	routes: Route[];
}

export interface SwapMessage {
	address: string;
	amount: string;
	payload: string;
}

export interface ExchangeData {
	displayData: DisplayData;
	swapMessages: SwapMessage[];
	messageCount: number;
	bestRouteSplitDex: {
		displayData: DisplayData;
		swapMessages: SwapMessage[];
		messageCount: number;
	};
	route: any | null;
}

export interface FetchRouteParams {
	inputAssetAmount: string;
	inputAssetAddress: string | null;
	outputAssetAddress: string | null;
	signal?: AbortSignal;
}

export interface SwapRoutesState {
	inputAssetAmount: string;
	inputAssetAddress: string | null;
	outputAssetAddress: string | null;
	exchangeRate: number | null;
	outputAssetAmount: string;
	inputAssetUsdAmount: number | null;
	outputAssetUsdAmount: number | null;
	route: ExchangeData | null;
	loading: boolean;
	error: string | null;
	forceRefresh: boolean;
} 