import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { SwapDepthType } from './types';

export const settingsSlice = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		setMaxDepth: (state, action: PayloadAction<SwapDepthType>) => {
			state.swap.maxDepth = action.payload;
		},
		setMaxSplits: (state, action: PayloadAction<number>) => {
			state.swap.maxSplits = action.payload;
		},
		setMaxSlippage: (state, action: PayloadAction<number>) => {
			state.swap.maxSlippage = action.payload;
		},
		resetSwapSettings: (state) => {
			state.swap = initialState.swap;
		}
	}
});

export const { setMaxDepth, setMaxSplits, setMaxSlippage, resetSwapSettings } = settingsSlice.actions;

export default settingsSlice.reducer; 