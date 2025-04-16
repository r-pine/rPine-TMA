import { useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useTranslation } from 'react-i18next';
import { useWallet } from '../../../store/wallet/hooks';
import { sendTransaction } from '../../../entities/transactions/api/transactions.api';
import { Message, SendTransactionRequest } from '../types';

const useNFTTransaction = (onConfirm: () => void) => {
	const { t } = useTranslation();
	const { address, isConnected } = useWallet();
	const [tonConnectUI] = useTonConnectUI();

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [isTransactionLoading, setIsTransactionLoading] = useState(false);

	const createTransaction = (messages: Message[]): SendTransactionRequest => {
		if (!messages || messages.length === 0) {
			throw new Error(t('error_transaction_data'));
		}

		return {
			validUntil: Math.floor(Date.now() / 1000) + 60,
			messages: messages.map(msg => ({
				address: msg.recipient,
				amount: msg.amount.toString(),
				stateInit: msg.stateInit,
				payload: msg.payload,
			})),
		};
	};

	const handleSendTransaction = async (messages: Message[]) => {
		if (!isConnected || !address) {
			setErrorMessage(t('error_wallet_not_connected'));
			return;
		}

		try {
			setIsTransactionLoading(true);
			setErrorMessage(null);
			setSuccessMessage(null);

			if (!messages || messages.length === 0) {
				setErrorMessage(t('error_transaction_data'));
				return;
			}

			const transaction = createTransaction(messages);
			await sendTransaction(tonConnectUI, transaction);
			setSuccessMessage(t('success_transaction', { address }));
			onConfirm();
		} catch (error) {
			setErrorMessage(t('error_global'));
			console.error('Error:', error);
		} finally {
			setIsTransactionLoading(false);
		}
	};

	return {
		errorMessage,
		successMessage,
		isTransactionLoading,
		handleSendTransaction,
	};
};

export default useNFTTransaction;
