import { SwapRoutesState } from './types';

export const initialState: SwapRoutesState = {
	inputAssetAmount: '',
	inputAssetAddress: null,
	outputAssetAddress: null,
	exchangeRate: null,
	outputAssetAmount: '',
	inputAssetUsdAmount: null,
	outputAssetUsdAmount: null,
	route: null,
	loading: false,
	error: null,
	forceRefresh: false,
}; 