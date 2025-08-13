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

export interface RouteResponse {
	success: boolean;
	data?: ExchangeData;
	error?: string;
	statusCode?: number;
}

export const fetchBestRoute = async (
	inputAssetAmount: string,
	inputAssetAddress: string,
	outputAssetAddress: string,
	options?: RouteRequestOptions
): Promise<RouteResponse> => {
	try {
		if (!inputAssetAmount || !inputAssetAddress || !outputAssetAddress) {
			return {
				success: false,
				error: 'Missing required parameters for route request'
			};
		}

		const url = `${SWAP_ROUTE_URL}/best-route?inputAssetAmount=${inputAssetAmount}&inputAssetAddress=${inputAssetAddress}&outputAssetAddress=${outputAssetAddress}${options?.maxDepth ? `&maxDepth=${options.maxDepth}` : ''}${options?.maxSplits ? `&maxSplits=${options.maxSplits}` : ''}${options?.maxSlippage ? `&maxSlippage=${options.maxSlippage}` : ''}${options?.senderAddress ? `&senderAddress=${options.senderAddress}` : ''}`;

		const response = await fetch(url, {
			signal: options?.signal,
		});

		if (!response.ok) {
			return {
				success: false,
				error: `Server error: ${response.status} ${response.statusText}`,
				statusCode: response.status
			};
		}

		const data = await response.json();
		return {
			success: true,
			data: data
		};
	} catch (error: any) {
		if (error.name === 'AbortError') {
			console.log('Request aborted');
			return {
				success: false,
				error: 'Request aborted'
			};
		}

		console.error('Error fetching best route:', error);
		return {
			success: false,
			error: error.message || 'Network error occurred'
		};
	}
};
