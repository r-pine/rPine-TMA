import { ExchangeData } from '../swapRoutes/types';

export interface RouteHistoryEntry {
	inputAsset: string;
	outputAsset: string;
	route: ExchangeData;
	timestamp: number;
}

export interface RouteHistoryState {
	routes: Record<string, RouteHistoryEntry>;
	loading: boolean;
	error: string | null;
	lastUpdated: number | null;
} 