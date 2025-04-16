import { TON_API_URL } from '../../../shared/api/config';

export const fetchBalance = async (address: string): Promise<number> => {
	const response = await fetch(
		`${TON_API_URL}/getAddressBalance?address=${address}`
	);

	if (!response.ok) {
		throw new Error('Failed to fetch balance');
	}

	const data = await response.json();
	const balance = parseFloat((data.result / 10 ** 9).toFixed(2));
	return balance;
};