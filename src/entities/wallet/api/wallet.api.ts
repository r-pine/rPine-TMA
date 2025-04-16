import { API_BASE_URL, API_CONFIG } from '../../../shared/api/config';

export const fetchWalletData = async (walletAddress: string) => {
	const response = await fetch(`${API_BASE_URL}/wallet`, {
		method: 'POST',
		headers: API_CONFIG.DEFAULT_HEADERS,
		body: JSON.stringify({ address: walletAddress }),
	});
	return response.json();
};