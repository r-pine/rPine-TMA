import { useTonConnectUI } from '@tonconnect/ui-react';

export interface SendTransactionRequest {
	validUntil: number;
	messages: {
		address: string;
		amount: string;
		stateInit?: string;
		payload?: string;
	}[];
}

export const sendTransaction = async (
	tonConnectUI: ReturnType<typeof useTonConnectUI>[0],
	transaction: SendTransactionRequest
) => {
	await tonConnectUI.sendTransaction(transaction);
};