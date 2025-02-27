import useTonWalletAddress from '../../../entities/wallet/hooks/useWalletAddress.hook';
import styles from './NFTTransaction.module.css';
import * as motion from "motion/react-client"
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';

interface Message {
	id: string;
	amount: number;
	recipient: string;
	stateInit?: string;
	payload?: string;
}

interface PayloadData {
	messages: Message[];
}

interface SendTransactionRequest {
	validUntil: number;
	messages: {
		address: string;
		amount: string;
		stateInit?: string;
		payload?: string;
	}[];
}

const NFTTransaction: React.FC<{ onConfirm: () => void; onClick: () => void }> = ({ onConfirm, onClick }) => {
	const { t } = useTranslation();
	const { walletAddress, formattedAddress, isConnected } = useTonWalletAddress();
	const [tonConnectUI] = useTonConnectUI();

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);

	useEffect(() => {
		if (!isConnected || !walletAddress) return;

		const fetchPayloadForAmount = async () => {
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

			try {
				const response = await fetch('https://air-swap.rpine.xyz/api/nft', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						address: walletAddress,
						user_id: userId,
						query: queryString,
					}),
				});

				if (!response.ok) {
					throw new Error('Network error');
				}

				const payloadData: PayloadData = await response.json();
				setMessages(payloadData.messages);
			} catch (error) {
				setErrorMessage('Error fetching payload');
				console.error('Error fetching payload:', error);
			}
		};

		fetchPayloadForAmount();
	}, [isConnected, walletAddress]);

	const sendTransaction = async () => {
		if (!messages || messages.length === 0) {
			setErrorMessage('No transaction data available');
			return;
		}

		const transaction: SendTransactionRequest = {
			validUntil: Math.floor(Date.now() / 1000) + 60,
			messages: messages.map(msg => ({
				address: msg.recipient,
				amount: msg.amount.toString(),
				stateInit: msg.stateInit,
				payload: msg.payload,
			})),
		};

		try {
			setIsProcessing(true);
			await tonConnectUI.sendTransaction(transaction);
			setSuccessMessage(`Transaction sent successfully for wallet: ${formattedAddress}`);
			onConfirm();
		} catch (error) {
			setErrorMessage('Oops! Something went wrong! Please try again later');
			console.error('Error sending transaction:', error);
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<div>
			{errorMessage && <div className={styles.error_message}>{errorMessage}</div>}
			{successMessage && <div className={styles.success_message}>{successMessage}</div>}
			<div className={styles.button_container}>
				{!isProcessing && !errorMessage && !successMessage && (
					<motion.button
						className={styles.buy_button}
						onClick={() => {
							onClick();
							sendTransaction();
						}}
						whileHover={{ scale: 1.02 }}
						disabled={isProcessing || !isConnected || messages.length === 0}
					>
						{t('yes_button')}
					</motion.button>
				)}
			</div>
		</div>
	);
};

export default NFTTransaction;