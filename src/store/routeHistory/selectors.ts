import { RootState } from '../store';

export const selectRouteHistory = (state: RootState) => state.routeHistory.routes;

export const selectRouteHistoryLoading = (state: RootState) => state.routeHistory.loading;

export const selectRouteHistoryError = (state: RootState) => state.routeHistory.error;

export const selectRouteHistoryLastUpdated = (state: RootState) => state.routeHistory.lastUpdated;

export const selectRouteByAssets = (state: RootState, inputAsset: string, outputAsset: string) => {
	const key = `${inputAsset}-${outputAsset}`;
	return state.routeHistory.routes[key];
};

export const selectIsRouteCached = (state: RootState, inputAsset: string, outputAsset: string) => {
	const key = `${inputAsset}-${outputAsset}`;
	return !!state.routeHistory.routes[key];
}; 