import { fetchTransactionData, getTransactionBody } from '../../../shared/api/transactionUtils';
import { AirswapPayload } from '../types'

export const fetchAirswapTransactionData = async (): Promise<AirswapPayload> => {
	const body = getTransactionBody();
	return fetchTransactionData<AirswapPayload>('swap-pine', body);
};

export const fetchOpineBalance = async (): Promise<string> => {
	const body = getTransactionBody();
	const response = await fetchTransactionData<{ available_amount: string }>('swap-pine', body);
	return response.available_amount;
};

