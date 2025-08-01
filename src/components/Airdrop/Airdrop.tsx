import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import useAirdropTransaction from '../../entities/airdrop/hooks/useAirdropTransactionHook';
import styles from './Airdrop.module.css';
import { useState } from 'react';
import { Message } from '../../entities/airdrop/types';

interface AirdropTransactionProps {
	onConfirm: () => void;
	onClick: () => void;
	messages: Message[] | null;
	isLoading: boolean;
	error: string | null;
}

const AirdropTransaction: React.FC<AirdropTransactionProps> = ({
	onConfirm,
	onClick,
	messages,
	error
}) => {
	const { errorMessage, successMessage, isTransactionLoading, handleSendTransaction } = useAirdropTransaction(onConfirm);
	const { t } = useTranslation();
	const [showError, setShowError] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);

	const handleClick = async () => {
		if (!messages) {
			setServerError('No fetching data');
			setShowError(true);
			return;
		}

		try {
			await handleSendTransaction(messages);
			onClick();
		} catch (error) {
			console.error('Error of sending transaction:', error);
			setServerError('Server error');
			setShowError(true);
		}
	};


	if (error) {
		return <div className={styles.error}>{error}</div>;
	}

	return (
		<div>
			{successMessage && <div className={styles.success_message}>{successMessage}</div>}
			{showError && serverError}
			{errorMessage && !showError && <div className={styles.error_message}>{errorMessage}</div>}
			<div className={styles.button_container}>
				{!isTransactionLoading && !successMessage && !errorMessage && !showError && messages && (
					<motion.button
						className={styles.buy_button}
						onClick={handleClick}
						whileHover={{ scale: 1.02 }}
						disabled={isTransactionLoading}
					>
						{t('get_airdrop_button')}
					</motion.button>
				)}
			</div>
		</div>
	);
};

export default AirdropTransaction;