import { RootState } from '../store';

export const selectInputAssetAmount = (state: RootState) => state.swapRoutes.inputAssetAmount;

export const selectInputAssetAddress = (state: RootState) => state.swapRoutes.inputAssetAddress;

export const selectOutputAssetAddress = (state: RootState) => state.swapRoutes.outputAssetAddress;

export const selectExchangeRate = (state: RootState) => state.swapRoutes.exchangeRate;

export const selectOutputAssetAmount = (state: RootState) => state.swapRoutes.outputAssetAmount;

export const selectRoute = (state: RootState) => state.swapRoutes.route;

export const selectSwapRoutesLoading = (state: RootState) => state.swapRoutes.loading;

export const selectSwapRoutesError = (state: RootState) => state.swapRoutes.error;

export const selectIsSwapReady = (state: RootState) =>
	!!state.swapRoutes.inputAssetAmount &&
	!!state.swapRoutes.inputAssetAddress &&
	!!state.swapRoutes.outputAssetAddress &&
	!!state.swapRoutes.route;

export const selectInputAssetUsdAmount = (state: RootState) => state.swapRoutes.inputAssetUsdAmount;

export const selectOutputAssetUsdAmount = (state: RootState) => state.swapRoutes.outputAssetUsdAmount;

export const selectForceRefresh = (state: RootState) => state.swapRoutes.forceRefresh;

export const selectIsIntervalActive = (state: RootState) => state.swapRoutes.isIntervalActive; 