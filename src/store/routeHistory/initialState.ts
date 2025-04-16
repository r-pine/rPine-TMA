import { RouteHistoryState } from './types';

export const initialState: RouteHistoryState = {
	routes: {},
	loading: false,
	error: null,
	lastUpdated: null,
}; 