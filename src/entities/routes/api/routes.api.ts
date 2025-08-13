import { SWAP_ROUTE_URL } from '../../../shared/api/config';
import { RouteStep, ExchangeData } from '../../../store/swapRoutes/types';

export interface Route {
	inputPercent: number;
	inputAmount: number;
	routeSteps: RouteStep[];
}

export interface RouteRequestOptions {
	signal?: AbortSignal;
	maxDepth?: string;
	maxSplits?: string;
	maxSlippage?: string;
	senderAddress?: string;
}

export const fetchBestRoute = async (
	inputAssetAmount: string,
	inputAssetAddress: string,
	outputAssetAddress: string,
	options?: RouteRequestOptions
): Promise<ExchangeData> => {
	try {
		if (!inputAssetAmount || !inputAssetAddress || !outputAssetAddress) {
			throw new Error('Missing required parameters for route request');
		}
		const url = `${SWAP_ROUTE_URL}/best-route?inputAssetAmount=${inputAssetAmount}&inputAssetAddress=${inputAssetAddress}&outputAssetAddress=${outputAssetAddress}${options?.maxDepth ? `&maxDepth=${options.maxDepth}` : ''}${options?.maxSplits ? `&maxSplits=${options.maxSplits}` : ''}${options?.maxSlippage ? `&maxSlippage=${options.maxSlippage}` : ''}${options?.senderAddress ? `&senderAddress=${options.senderAddress}` : ''}`;
		const response = await fetch(url, {
			signal: options?.signal,
		});

		if (!response.ok) {
			throw new Error('Failed to fetch best route');
		}
		const data = await response.json();
		return data;
	} catch (error: any) {
		if (error.name === 'AbortError') {
			console.log('Request aborted');
			return Promise.reject(error);
		}
		console.error('Error fetching best route:', error);
		throw error;
	}
};
