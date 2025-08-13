import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBestRoute } from '../../entities/routes/api/routes.api';
import {
	setInputAssetAmount,
	setInputAssetAddress,
	setOutputAssetAddress,
	setExchangeData,
	setError,
	resetSwapState,
	setLoading,
} from './slice';
import { FetchRouteParams } from './types';
import { RootState } from '../store';
import { selectSwapSettingsForApi } from '../settings/selectors';
import { selectWalletAddress } from '../wallet/selectors';
import { convertToUserFriendlyAddress } from '../../shared/utils/addressUtils';

export const fetchRoute = createAsyncThunk(
	'swapRoutes/fetchRoute',
	async (params: FetchRouteParams, { dispatch, getState }) => {
		try {
			dispatch(setLoading(true));
			dispatch(setError(null));

			const { inputAssetAmount, inputAssetAddress, outputAssetAddress, signal } = params;

			if (signal?.aborted) {
				return;
			}

			if (!inputAssetAddress || !outputAssetAddress) {
				return;
			}
			const state = getState() as RootState;
			const swapSettings = selectSwapSettingsForApi(state);
			const userAddress = selectWalletAddress(state);

			const routeResponse = await fetchBestRoute(
				inputAssetAmount,
				inputAssetAddress,
				outputAssetAddress,
				{
					signal,
					maxDepth: swapSettings.maxDepth,
					maxSplits: swapSettings.maxSplits,
					maxSlippage: swapSettings.maxSlippage,
					senderAddress: userAddress ? convertToUserFriendlyAddress(userAddress) : undefined
				}
			);

			if (signal?.aborted) {
				return;
			}

			if (routeResponse.success && routeResponse.data) {
				dispatch(setInputAssetAmount(inputAssetAmount));
				dispatch(setInputAssetAddress(inputAssetAddress));
				dispatch(setOutputAssetAddress(outputAssetAddress));
				dispatch(setExchangeData(routeResponse.data));
				return routeResponse.data;
			} else {
				console.warn('Route fetch failed, will retry:', routeResponse.error);
				dispatch(setError(routeResponse.error || 'Route fetch failed, retrying...'));
				return null;
			}
		} catch (error: any) {
			if (error.name === 'AbortError') {
				return;
			}
			console.error('Unexpected error in fetchRoute:', error);
			dispatch(setError('Unexpected error, retrying...'));
			return null;
		} finally {
			dispatch(setLoading(false));
		}
	}
);

export const resetSwap = createAsyncThunk('swapRoutes/resetSwap', async (_, { dispatch }) => {
	dispatch(resetSwapState());
});