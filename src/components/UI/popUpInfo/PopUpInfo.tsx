import ReactModal from 'react-modal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'motion/react';
import * as motion from "motion/react-client"
import styles from './PopUpInfo.module.css'
import Footer from '../../../widgets/footer/Footer';

ReactModal.setAppElement('#root');

const PopUpInfo = () => {
	const { t } = useTranslation();

	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	return (<div>
		<motion.svg
			className={styles.openIcon}
			onClick={openModal}
			whileHover={{ scale: 1.4 }}
			width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M5.99935 0.166504C2.7846 0.166504 0.166016 2.78509 0.166016 5.99984C0.166016 9.21459 2.7846 11.8332 5.99935 11.8332C9.2141 11.8332 11.8327 9.21459 11.8327 5.99984C11.8327 2.78509 9.2141 0.166504 5.99935 0.166504ZM5.99935 1.33317C8.58359 1.33317 10.666 3.4156 10.666 5.99984C10.666 8.58408 8.58359 10.6665 5.99935 10.6665C3.41511 10.6665 1.33268 8.58408 1.33268 5.99984C1.33268 3.4156 3.41511 1.33317 5.99935 1.33317ZM5.99935 2.49984C4.71018 2.49984 3.66602 3.54401 3.66602 4.83317H4.83268C4.83268 4.19151 5.35768 3.66651 5.99935 3.66651C6.64102 3.66651 7.16602 4.19151 7.16602 4.83317C7.16602 5.99984 5.41602 6.21392 5.41602 7.74984H6.58268C6.58268 6.78676 8.33269 6.29151 8.33269 4.83317C8.33269 3.54401 7.28852 2.49984 5.99935 2.49984ZM5.41602 8.33317V9.49984H6.58268V8.33317H5.41602Z" fill="#B9B9B9" />
		</motion.svg>

		<AnimatePresence>
			{isOpen && (
				<ReactModal
					isOpen={isOpen}
					onRequestClose={closeModal}
					overlayClassName={styles.overlay_modal}
					className={styles.modal_content}
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.5 }}
						transition={{ duration: 0.2 }}
					>
				<div>
					<div className={styles.popup_header}>
						<h2 className={styles.popup_title}>{t('utilities_main_header')}</h2>
						<div className={styles.closeIcon} onClick={closeModal}>
							<svg width="22" height="22" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M13 0.8125C10.5895 0.8125 8.23322 1.52728 6.22899 2.86646C4.22477 4.20564 2.66267 6.10907 1.74022 8.33604C0.817781 10.563 0.576428 13.0135 1.04668 15.3777C1.51694 17.7418 2.67769 19.9134 4.38214 21.6179C6.08659 23.3223 8.2582 24.4831 10.6223 24.9533C12.9865 25.4236 15.437 25.1822 17.664 24.2598C19.8909 23.3373 21.7944 21.7752 23.1335 19.771C24.4727 17.7668 25.1875 15.4105 25.1875 13C25.1813 9.76958 23.8953 6.67324 21.611 4.38898C19.3268 2.10472 16.2304 0.818694 13 0.8125V0.8125ZM17.418 16.082C17.594 16.2598 17.6928 16.4998 17.6928 16.75C17.6928 17.0002 17.594 17.2402 17.418 17.418C17.2388 17.5912 16.9993 17.6881 16.75 17.6881C16.5007 17.6881 16.2612 17.5912 16.082 17.418L13 14.3242L9.91797 17.418C9.73878 17.5912 9.49927 17.6881 9.25 17.6881C9.00074 17.6881 8.76123 17.5912 8.58204 17.418C8.40599 17.2402 8.30723 17.0002 8.30723 16.75C8.30723 16.4998 8.40599 16.2598 8.58204 16.082L11.6758 13L8.58204 9.91797C8.43254 9.73582 8.35614 9.50457 8.3677 9.26921C8.37926 9.03385 8.47795 8.8112 8.64458 8.64457C8.8112 8.47795 9.03385 8.37925 9.26921 8.36769C9.50457 8.35614 9.73582 8.43253 9.91797 8.58203L13 11.6758L16.082 8.58203C16.2642 8.43253 16.4954 8.35614 16.7308 8.36769C16.9662 8.37925 17.1888 8.47795 17.3554 8.64457C17.5221 8.8112 17.6208 9.03385 17.6323 9.26921C17.6439 9.50457 17.5675 9.73582 17.418 9.91797L14.3242 13L17.418 16.082Z" fill="#ECECEC" />
							</svg>
						</div>
					</div>

					<div className={styles.popup_container}>
						<div>
							<div className={styles.p_header}>{t('utilities_header_one')}</div>
							<div className={styles.paragraph}>{t('utilities_p_one')}</div>
						</div>
						<div>
							<div className={styles.p_header}>{t('utilities_header_two')}</div>
							<div className={styles.paragraph}>{t('utilities_p_two')}</div>
						</div>
						<div>
							<div className={styles.p_header}>{t('utilities_header_three')}</div>
							<div className={styles.paragraph}>{t('utilities_p_three')}</div>
						</div>
						<div>
							<div className={styles.p_header}>{t('utilities_header_four')}</div>
							<div className={styles.paragraph}>{t('utilities_p_four')}</div>
						</div>
						<div>
							<div className={styles.p_header}>{t('utilities_header_five')}</div>
							<div className={styles.paragraph}>{t('utilities_p_five')}</div>
						</div>
						<div>
							<div className={styles.p_header}>{t('utilities_header_six')}</div>
							<div className={styles.paragraph}>{t('utilities_p_six')}</div>
						</div>
					</div>

					<Footer />

				</div>
				</motion.div>
			</ReactModal>
			)}
		</AnimatePresence>
	</div>
	)
}

export default PopUpInfo;