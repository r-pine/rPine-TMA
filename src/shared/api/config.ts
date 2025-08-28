export const API_BASE_URL = 'https://air-swap.rpine.xyz/api';
export const TON_API_URL = 'https://toncenter.com/api/v2';
export const TONAPI_URL = 'https://tonapi.io/v2';
export const SWAP_ROUTE_URL = 'https://demo2.rpine.xyz/api';

export const TON_CONNECT_CONFIG = {
	manifestUrl: 'https://api.rpine.xyz/static/json/tonconnect-manifest-nft.json',
	uiPreferences: {
		theme: 'DARK' as const,
		colorsSet: {
			DARK: {
				connectButton: {
					background: '#0C9BE9',
				},
			},
		},
	},
};

export const API_CONFIG = {
	DEFAULT_HEADERS: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	},
	TIMEOUT: 10000,
};

export const buildApiUrl = (base: string, endpoint: string) => `${base}/${endpoint}`;