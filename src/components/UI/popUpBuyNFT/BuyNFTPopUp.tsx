import { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'motion/react';
import * as motion from "motion/react-client"
import styles from './BuyNFTPopUp.module.css';
import NFTTransaction from '../../../entities/nft/components/NFTTransaction';
import { fetchNFTTransactionData } from '../../../entities/nft/api/nft.api';
import { Message } from '../../../entities/nft/types';
import { useWallet } from '../../../store/wallet/hooks';

const BuyNFTPopup = () => {
	const { t } = useTranslation();
	const { isConnected } = useWallet();
	const [isOpen, setIsOpen] = useState(false);
	const [isConfirmed, setIsConfirmed] = useState(false);
	const [messages, setMessages] = useState<Message[] | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadData = async () => {
			if (!isOpen || !isConnected) return;
			try {
				setIsLoading(true);
				setError(null);
				const payloadData = await fetchNFTTransactionData();
				setMessages(payloadData.messages);
			} catch (error) {
				setError('fetching data is not possible now');
				console.error('Error:', error);
			} finally {
				setIsLoading(false);
			}
		};
		loadData();
	}, [isOpen, isConnected]);

	const openModal = () => setIsOpen(true);
	const closeModal = () => {
		setIsConfirmed(false);
		setIsOpen(false);
		setMessages(null);
		setError(null);
	};

	return (
		<div>
			<motion.button
				className={styles.button_buy}
				onClick={openModal}
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.95 }}>
				{t('buy_NFT_button')}
			</motion.button>
			<AnimatePresence mode="wait">
				{isOpen && (
					<ReactModal
						isOpen={isOpen}
						onRequestClose={closeModal}
						overlayClassName={styles.overlay}
						className={styles.content}
					>
						{isOpen && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.3 }}
							>
								<div className={styles.popup_buy_container}>
									{!isConfirmed && <p className={styles.paragraph}>{t('buy_NFT_confirmation')}</p>}
									<img src="./assets/img/pine_happy_svg.svg" alt="happypine_img" className={styles.img} />
									{isLoading ? (
										<div className={styles.loading}>{t('loading_state')}</div>
									) : error ? (
										<div className={styles.error}>{error}</div>
									) : (
										<NFTTransaction
											onConfirm={() => { }}
											onClick={() => setIsConfirmed(true)}
											messages={messages}
											isLoading={isLoading}
											error={error}
										/>
									)}
									<motion.button
										className={styles.close_button}
										onClick={closeModal}
										whileHover={{ scale: 1.02 }}>
										{t('back_button')}
									</motion.button>
								</div>
							</motion.div>
						)}
					</ReactModal>
				)}
			</AnimatePresence>
		</div>
	);
};

export default BuyNFTPopup;