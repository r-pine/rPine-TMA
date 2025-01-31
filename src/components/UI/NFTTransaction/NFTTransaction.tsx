import useTonWalletAddress from '../../../hooks/useWalletAddress.hook';
import styles from './NFTTransaction.module.css';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface PayloadData {
	messages: unknown[];
}

const NFTTransaction: React.FC<{ onConfirm: () => void }> = ({ onConfirm }) => {
	const { t } = useTranslation();

	const { walletAddress, formattedAddress } = useTonWalletAddress();

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const [isProcessing, setIsProcessing] = useState(false);
	
	const fetchPayloadForAmount = async () => {
		if (!walletAddress) {
			const message = 'Wallet address is not available';
			setErrorMessage(message);
			console.error(message);
			return [];
		}

		let queryString: string | null = null;
		let userId: string | null = null;

		if (window.Telegram?.WebApp?.initData) {
			queryString = decodeURI(window.Telegram.WebApp.initData);
			const params = new URLSearchParams(queryString);
			const userJson = params.get("user");

			if (userJson) {
				const user = JSON.parse(decodeURIComponent(userJson));
				userId = String(user.id);
			}
		}

		try {
			const response = await fetch('https://air-swap.rpine.xyz/api/nft', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					address: walletAddress,
					user_id: userId,
					query: queryString,
				}),
			});

			if (!response.ok) {
				const errorMessage = 'Network error';
				setErrorMessage(errorMessage);
				console.error(errorMessage);
				return [];
			}

			const payloadData: PayloadData = await response.json();
			return payloadData.messages;
		} catch (error) {
			if (error instanceof TypeError) {
				const message = 'Network error: Please check your internet connection.';
				setErrorMessage(message);
				console.error(message, error);
			} else {
				const message = 'Error fetching payload';
				setErrorMessage(message);
				console.error(message, error);
			}
			return [];
		}
	};

	const sendTransaction = async (messages: unknown[]) => {
		if (!messages || messages.length === 0) {
			const message = 'No transaction data available';
			setErrorMessage(message);
			console.error(message);
			return;
		}

		const transaction = {
			validUntil: Math.floor(Date.now() / 1000) + 60,
			messages: messages,
		};

		try {
			console.log('Sending transaction:', transaction);
			const message = `Transaction sent successfully for wallet: ${formattedAddress}`;
			setSuccessMessage(message);
			onConfirm();
		} catch (error) {
			let errorMessage = 'Error sending transaction';
			if (error instanceof Error) {
				errorMessage = error.message || errorMessage;
			}
			setErrorMessage(errorMessage);
			console.error(errorMessage, error);
		}
	};

	const handleButtonClick = async () => {
		if (isProcessing) return;
		setErrorMessage(null);
		setSuccessMessage(null);
		setIsProcessing(true);
		const messages = await fetchPayloadForAmount();
		if (messages.length > 0) {
			await sendTransaction(messages);
		}
		setIsProcessing(false);
	};
	return (
		<div>
			{errorMessage && <div className={styles.error_message}>{errorMessage}</div>}
			{successMessage && <div className={styles.success_message}>{successMessage}</div>}
			<div className={styles.button_container}>
				{!isProcessing && !errorMessage && !successMessage && (
					<button
						className={styles.buy_button}
						onClick={handleButtonClick}
						disabled={isProcessing}
					>
						{t('yes_button')}
					</button>
				)}
			</div>
		</div>
	);
};

export default NFTTransaction;