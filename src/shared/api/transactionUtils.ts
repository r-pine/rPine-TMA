import { API_BASE_URL, API_CONFIG } from './config';
import { store } from '../../store/store';
import { selectWalletAddress, selectTelegramData } from '../../store/wallet/selectors';

export const getTelegramData = () => {
	let queryString: string | null = null;
	let userId: string | null = null;

	if (window.Telegram?.WebApp?.initData) {
		queryString = decodeURI(window.Telegram.WebApp.initData);
		const params = new URLSearchParams(queryString);
		const userJson = params.get('user');

		if (userJson) {
			const user = JSON.parse(decodeURIComponent(userJson));
			userId = String(user.id);
		}
	}

	return { queryString, userId };
};

export const getTransactionBody = () => {
	const walletAddress = selectWalletAddress(store.getState());
	const { queryString, userId } = selectTelegramData(store.getState());

	if (!walletAddress) {
		throw new Error('Wallet address is not available');
	}

	return {
		address: walletAddress,
		user_id: userId,
		query: queryString,
	};
};

export const fetchTransactionData = async <T>(endpoint: string, body: unknown): Promise<T> => {
	const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
		method: 'POST',
		headers: API_CONFIG.DEFAULT_HEADERS,
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		throw new Error('Network error');
	}

	return response.json();
};