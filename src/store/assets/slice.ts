import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Asset } from './types';
import { initialState } from './initialState';

const assetsSlice = createSlice({
	name: 'assets',
	initialState,
	reducers: {
		setAssets: (state, action: PayloadAction<Asset[]>) => {
			state.assets = action.payload;
			state.error = null;
		},
		setUserAssets: (state, action: PayloadAction<Asset[]>) => {
			state.userAssets = action.payload;
			state.error = null;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
		resetAssetsState: () => initialState,
	},
});

export const { setAssets, setUserAssets, setLoading, setError, resetAssetsState } = assetsSlice.actions;
export default assetsSlice.reducer; 