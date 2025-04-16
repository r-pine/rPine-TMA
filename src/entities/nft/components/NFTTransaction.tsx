import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import useNFTTransaction from '../hooks/useNFTTransactionHook';
import styles from './NFTTransaction.module.css';
import { useState } from 'react';
import Error from '../../../components/UI/errorPopUp/Error';
import { Message } from '../types';

interface NFTTransactionProps {
	onConfirm: () => void;
	onClick: () => void;
	messages: Message[] | null;
	isLoading: boolean;
	error: string | null;
}

const NFTTransaction: React.FC<NFTTransactionProps> = ({
	onConfirm,
	onClick,
	messages,
}) => {
	const { errorMessage, successMessage, isTransactionLoading, handleSendTransaction } = useNFTTransaction(onConfirm);
	const { t } = useTranslation();
	const [showError, setShowError] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);

	const handleClick = async () => {
		if (!messages) {
			setServerError('No transaction data');
			setShowError(true);
			return;
		}

		try {
			await handleSendTransaction(messages);
			onClick();
		} catch (error) {
			console.error('Error:', error);
			setServerError('Server is not responding');
			setShowError(true);
		}
	};

	const handleCloseError = () => {
		setShowError(false);
	};

	return (
		<div>
			{successMessage && <div className={styles.success_message}>{successMessage}</div>}
			{showError && serverError && <Error errorMessage={serverError} onClose={handleCloseError} />}
			{errorMessage && !showError && <div className={styles.error_message}>{errorMessage}</div>}
			<div className={styles.button_container}>
				{!isTransactionLoading && !successMessage && !errorMessage && !showError && messages && (
					<motion.button
						className={styles.buy_button}
						onClick={handleClick}
						whileHover={{ scale: 1.02 }}
						disabled={isTransactionLoading}
					>
						{t('yes_button')}
					</motion.button>
				)}
			</div>
		</div>
	);
};

export default NFTTransaction;