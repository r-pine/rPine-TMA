import styles from './swapHeader.module.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectOptionModal } from '../modals/selectOptionModal/SelectOptionModal'

const SwapHeader = () => {
	const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);

	const { t } = useTranslation();

	const handleOpenOptionModal = () => {
		setIsOptionModalOpen(true);
	};

	const handleCloseOptionModal = () => {
		setIsOptionModalOpen(false);
	};

	return (
		<div>
			<div className={styles.container}>
				<div className={styles.wrapper}>
					<div className={styles.header_container}>
						<img src="../assets/icons/pine_icon_swap.svg" alt="pine_icon" className={styles.icon} />
						<h1 className={styles.header}>{t('swap_to_TON')}</h1>
					</div>
				</div>
				<div className={styles.wrapper}>
					<button className={styles.openMoreButton} onClick={handleOpenOptionModal}>
						<div className={styles.open_more_container}>
							<div className={styles.circle}></div>
							<div className={styles.circle}></div>
							<div className={styles.circle}></div>
						</div>
					</button>
				</div>
			</div>
			<SelectOptionModal
				isOpen={isOptionModalOpen}
				onClose={handleCloseOptionModal}
			/>
		</div>
	);
};

export default SwapHeader;