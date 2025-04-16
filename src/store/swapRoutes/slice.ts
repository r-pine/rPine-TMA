import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExchangeData } from './types';

export interface SwapRoutesState {
	inputAssetAmount: string;
	inputAssetAddress: string | null;
	outputAssetAddress: string | null;
	exchangeRate: number | null;
	outputAssetAmount: string;
	inputAssetUsdAmount: number | null;
	outputAssetUsdAmount: number | null;
	route: ExchangeData | null;
	error: string | null;
	loading: boolean;
	forceRefresh: boolean;
	isIntervalActive: boolean;
}

const initialState: SwapRoutesState = {
	inputAssetAmount: '',
	inputAssetAddress: null,
	outputAssetAddress: null,
	exchangeRate: null,
	outputAssetAmount: '',
	inputAssetUsdAmount: null,
	outputAssetUsdAmount: null,
	route: null,
	error: null,
	loading: false,
	forceRefresh: false,
	isIntervalActive: false,
};

const swapRoutesSlice = createSlice({
	name: 'swapRoutes',
	initialState,
	reducers: {
		setInputAssetAmount: (state, action: PayloadAction<string>) => {
			state.inputAssetAmount = action.payload;
			state.error = null;
		},
		setInputAssetAddress: (state, action: PayloadAction<string | null>) => {
			state.inputAssetAddress = action.payload;
			state.error = null;
		},
		setOutputAssetAddress: (state, action: PayloadAction<string | null>) => {
			state.outputAssetAddress = action.payload;
			state.error = null;
		},
		setExchangeData: (state, action: PayloadAction<ExchangeData>) => {
			const bestData = action.payload.bestRouteSplitDex?.displayData || action.payload.displayData;
			if (!bestData) {
				state.error = 'No route data available';
				return;
			}

			state.exchangeRate = bestData.exchangeRate;
			state.outputAssetAmount = bestData.outputAssetAmount.toString();
			state.inputAssetUsdAmount = bestData.inputAssetUsdAmount;
			state.outputAssetUsdAmount = bestData.outputAssetUsdAmount;
			state.route = {
				displayData: bestData,
				swapMessages: action.payload.bestRouteSplitDex?.swapMessages || action.payload.swapMessages || [],
				messageCount: action.payload.bestRouteSplitDex?.messageCount || action.payload.messageCount || 0,
				route: action.payload.route,
				bestRouteSplitDex: action.payload.bestRouteSplitDex
			};
			state.error = null;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		resetOutputAmount: (state) => {
			state.outputAssetAmount = '';
			state.exchangeRate = null;
			state.inputAssetUsdAmount = null;
			state.outputAssetUsdAmount = null;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
		resetSwapState: (state) => {
			state.inputAssetAmount = '';
			state.inputAssetAddress = null;
			state.outputAssetAddress = null;
			state.exchangeRate = null;
			state.outputAssetAmount = '';
			state.inputAssetUsdAmount = null;
			state.outputAssetUsdAmount = null;
			state.route = null;
			state.error = null;
			state.loading = false;
			state.isIntervalActive = false;
		},
		setForceRefresh: (state, action: PayloadAction<boolean>) => {
			state.forceRefresh = action.payload;
		},
		setIntervalActive: (state, action: PayloadAction<boolean>) => {
			state.isIntervalActive = action.payload;
		},
		setRoute: (state, action: PayloadAction<ExchangeData | null>) => {
			state.route = action.payload;
		},
	},
});

export const {
	setInputAssetAmount,
	setInputAssetAddress,
	setOutputAssetAddress,
	setExchangeData,
	setLoading,
	resetOutputAmount,
	setError,
	resetSwapState,
	setForceRefresh,
	setIntervalActive,
	setRoute,
} = swapRoutesSlice.actions;

export default swapRoutesSlice.reducer;