import { useState } from 'react';
import ReactModal from 'react-modal';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'motion/react';
import * as motion from "motion/react-client"
import styles from './BuyNFTPopUp.module.css';
import NFTTransaction from '../NFTTransaction/NFTTransaction';

const BuyNFTPopup = () => {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);
	const [isConfirmed, setIsConfirmed] = useState(false);

	const openModal = () => setIsOpen(true);
	const closeModal = () => {
		setIsConfirmed(false);
		setIsOpen(false);
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
			<AnimatePresence>
				{isOpen && (
					<ReactModal
					isOpen={isOpen}
					onRequestClose={closeModal}
					overlayClassName={styles.overlay}
					className={styles.content}
				>
					{isOpen && (
					<motion.div
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.5 }}
						transition={{ duration: 0.2 }}
					>
					<div className={styles.popup_buy_container}>
						{!isConfirmed && <p className={styles.paragraph}>{t('buy_NFT_confirmation')}</p>}
						<img src="./assets/img/pine_happy_svg.svg" alt="happypine_img" className={styles.img} />
						<NFTTransaction onConfirm={() => {}} onClick={() => setIsConfirmed(true)} />
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