import { fetchTransactionData, getTransactionBody } from '../../../shared/api/transactionUtils';
import { AirdropPayload } from '../types'

export const fetchAirdropTransactionData = async (): Promise<AirdropPayload> => {
	const body = getTransactionBody();
	return fetchTransactionData<AirdropPayload>('drop-pine', body);
};