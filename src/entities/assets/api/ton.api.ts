import { TONAPI_URL } from '../../../shared/api/config';

export interface JettonBalance {
	balance: string;
	wallet_address: {
		address: string;
		is_scam: boolean;
		is_wallet: boolean;
	};
	jetton: {
		address: string;
		name: string;
		symbol: string;
		decimals: number;
		image: string;
		verification: string;
		score: number;
	};
}

export interface JettonsResponse {
	balances: JettonBalance[];
}

export const fetchUserJettons = async (address: string): Promise<JettonsResponse> => {
	try {
		const response = await fetch(
			`${TONAPI_URL}/accounts/${address}/jettons?supported_extensions=custom_payload`,
			{
				headers: {
					'Accept': 'application/json',
				},
			}
		);

		if (!response.ok) {
			throw new Error('Failed to fetch user jettons');
		}

		return await response.json();
	} catch (error) {
		console.error('Error fetching user jettons:', error);
		throw error;
	}
}; 