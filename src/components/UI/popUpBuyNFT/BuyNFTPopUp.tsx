import { useState } from 'react';
import ReactModal from 'react-modal';
import { useTranslation } from 'react-i18next';
import styles from './BuyNFTPopUp.module.css';
import NFTTransaction from '../NFTTransaction/NFTTransaction';



const BuyNFTPopup = () => {
	const { t } = useTranslation();

	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	return (
		<div>
			<button className={styles.button_buy} onClick={openModal}>{t('buy_NFT_button')}</button>

			<ReactModal
				isOpen={isOpen}
				onRequestClose={closeModal}
				overlayClassName={styles.overlay}
				className={styles.content}
			>
				<div className={styles.popup_buy_container}>
					<p className={styles.paragraph}>{t('buy_NFT_confirmation')}</p>
					<img src="./assets/img/pine_happy_img.png" alt="happypine_img" className={styles.img}/>
					<NFTTransaction onConfirm={() => console.log('Transaction confirmed!')} />
					<button className={styles.close_button} onClick={closeModal}>{t('back_button')}</button>
				</div>
			</ReactModal>
		</div>
	);
};

export default BuyNFTPopup;