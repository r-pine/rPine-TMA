import { fetchTransactionData, getTransactionBody } from '../../../shared/api/transactionUtils';
import { NFTPayload } from '../types';

export const fetchNFTTransactionData = async (): Promise<NFTPayload> => {
	const body = getTransactionBody();
	return fetchTransactionData<NFTPayload>('nft', body);
};