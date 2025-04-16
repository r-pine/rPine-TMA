import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import useAirswapTransaction from '../hooks/useAirswapTransactionHook';
import styles from './Airswap.module.css';
import { useState } from 'react';
import { Message } from '../types';

interface AirswapTransactionProps {
	onConfirm: () => void;
	onClick: () => void;
	messages: Message[] | null;
	isLoading: boolean;
	error: string | null;
}

const AirswapTransaction: React.FC<AirswapTransactionProps> = ({
	onConfirm,
	onClick,
	messages,
	error
}) => {
	const { errorMessage, successMessage, isTransactionLoading, handleSendTransaction } = useAirswapTransaction(onConfirm, messages);
	const { t } = useTranslation();
	const [showError, setShowError] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);

	const handleClick = async () => {
		try {
			await handleSendTransaction();
			onClick();
		} catch (error) {
			console.error('Ошибка отправки транзакции:', error);
			setServerError('Server error');
			setShowError(true);
		}
	};


	if (error) {
		return <div className={styles.error_message}>{error}</div>;
	}

	return (
		<div>
			{successMessage && <div className={styles.success_message}>{successMessage}</div>}
			{showError && serverError}
			{errorMessage && !showError && <div className={styles.error_message}>{errorMessage}</div>}
			<div className={styles.button_container}>
				{!isTransactionLoading && !successMessage && !errorMessage && !showError && (
					<motion.button
						className={styles.confirmButton}
						onClick={handleClick}
						whileHover={{ scale: 1.02 }}
						disabled={isTransactionLoading || !messages || messages.length === 0}
					>
						{t('airswap_exchange_button')}
					</motion.button>
				)}
			</div>
		</div>
	);
};

export default AirswapTransaction;