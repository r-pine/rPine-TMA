import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RouteHistoryEntry } from './types';
import { initialState } from './initialState';

const routeHistorySlice = createSlice({
	name: 'routeHistory',
	initialState,
	reducers: {
		addRoute: (state, action: PayloadAction<RouteHistoryEntry>) => {
			const key = `${action.payload.inputAsset}-${action.payload.outputAsset}`;
			state.routes[key] = action.payload;
			state.lastUpdated = Date.now();
			state.error = null;
		},
		clearRoute: (state, action: PayloadAction<{ inputAsset: string; outputAsset: string }>) => {
			const key = `${action.payload.inputAsset}-${action.payload.outputAsset}`;
			delete state.routes[key];
		},
		clearAllRoutes: (state) => {
			state.routes = {};
			state.lastUpdated = null;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
	},
});

export const { addRoute, clearRoute, clearAllRoutes, setLoading, setError } = routeHistorySlice.actions;

export default routeHistorySlice.reducer; 