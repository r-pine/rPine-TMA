import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAssetsList } from '../../entities/assets/api/assets.api';
import { fetchUserJettons } from '../../entities/assets/api/ton.api';
import { setAssets, setUserAssets, setLoading, setError } from './slice';
import { Asset } from './types';
import { RootState } from '../store';

export const fetchAssets = createAsyncThunk(
	'assets/fetchAssets',
	async (_, { dispatch, getState }) => {
		try {
			// Получаем текущее состояние
			const state = getState() as RootState;

			// Если активы уже загружены, не делаем запрос повторно
			if (state.assets.assets && state.assets.assets.length > 0) {
				console.log('Assets уже загружены, пропускаем запрос');
				return state.assets.assets;
			}

			dispatch(setLoading(true));
			const response = await fetchAssetsList();
			if (!response || !response.assets) {
				throw new Error('Invalid response format from assets API');
			}
			const assetsWithWarning = response.assets.map(asset => ({
				...asset,
				showWarning: asset.verification !== "whitelist"
			}));
			dispatch(setAssets(assetsWithWarning));
			return assetsWithWarning;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Failed to fetch assets';
			console.error('Error in fetchAssets thunk:', error);
			dispatch(setError(errorMessage));
			throw error;
		} finally {
			dispatch(setLoading(false));
		}
	}
);

export const updateUserAssets = createAsyncThunk(
	'assets/updateUserAssets',
	async (address: string, { dispatch }) => {
		try {
			dispatch(setLoading(true));
			const response = await fetchUserJettons(address);

			const userAssets: Asset[] = response.balances.map(balance => ({
				type: 'jetton',
				address: balance.jetton.address,
				name: balance.jetton.name,
				symbol: balance.jetton.symbol,
				image: balance.jetton.image,
				decimals: balance.jetton.decimals,
				verification: balance.jetton.verification,
				isScam: balance.wallet_address.is_scam,
				isWallet: balance.wallet_address.is_wallet,
				balance: balance.balance,
				showWarning: balance.jetton.verification !== "whitelist"
			}));

			dispatch(setUserAssets(userAssets));
			return userAssets;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Failed to update user assets';
			dispatch(setError(errorMessage));
			throw error;
		} finally {
			dispatch(setLoading(false));
		}
	}
); 