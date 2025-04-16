import { SWAP_ROUTE_URL } from '../../../shared/api/config';
import { Asset } from '../../../store/assets/types';

export interface AssetsResponse {
	assets: Asset[];
}

export const fetchAssetsList = async (): Promise<AssetsResponse> => {
	try {
		console.log('API: Запрос fetchAssetsList');
		const response = await fetch(`${SWAP_ROUTE_URL}/assets-list`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				searchValue: "",
				userAssets: ["",
					""
				]
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('API Error Response:', {
				status: response.status,
				statusText: response.statusText,
				body: errorText,
			});
			throw new Error(`Failed to fetch assets list: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		console.log('API: Получен ответ fetchAssetsList, assets:', data.assets.length);
		return data;
	} catch (error) {
		console.error('Error fetching assets list:', error);
		console.log('Implementing mock UI');
		return {
			assets: Array(110).fill(null).map((_, index) => ({
				type: 'jetton',
				address: `EQAddress${index}`,
				name: `Jetton ${index}`,
				symbol: `JET${index}`,
				image: `https://example.com/img-${index}.png`,
				decimals: 9,
				verification: 'none',
				isScam: false,
				isWallet: true
			}))
		};
	}
};

interface SearchAssetsRequest {
	searchValue: string;
	userAssets: string[];
}

export const searchAssets = async (
	params: SearchAssetsRequest & { signal?: AbortSignal }
): Promise<AssetsResponse> => {
	try {
		console.log('API: Запрос searchAssets с параметрами:', params.searchValue);
		const response = await fetch(`${SWAP_ROUTE_URL}/assets-list`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				searchValue: params.searchValue,
				userAssets: params.userAssets
			}),
			signal: params.signal
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('API Error Response:', {
				status: response.status,
				statusText: response.statusText,
				body: errorText,
			});
			throw new Error(`Failed to search assets: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		console.log('API: Получен ответ searchAssets, assets:', data.assets.length);
		return {
			assets: data.assets.map((asset: Asset) => ({
				...asset,
				showWarning: asset.verification !== "whitelist"
			}))
		};
	} catch (error) {
		if (error instanceof DOMException && error.name === 'AbortError') {
			console.log('API: Search request was canceled');
			throw error;
		}

		console.error('Error searching assets:', error);

		console.log('Используем моковые данные для поиска:', params.searchValue);
		return {
			assets: Array(40).fill(null).map((_, index) => ({
				type: 'jetton',
				address: `EQAddress${index}Search${params.searchValue}`,
				name: `Jetton ${index} ${params.searchValue}`,
				symbol: `JET${index}${params.searchValue.toUpperCase()}`,
				image: `https://example.com/img-${index}-${params.searchValue}.png`,
				decimals: 9,
				verification: 'none',
				isScam: false,
				isWallet: true
			}))
		};
	}
};