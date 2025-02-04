import ReactModal from 'react-modal';
import { useTranslation, Trans } from 'react-i18next';
import styles from './NFTPage.module.css';
import useTonWalletAddress from '../../hooks/useWalletAddress.hook';
import AvailableNFT from '../UI/AvailableNFTAmount';
import TonWalletConnect from '../UI/TonWalletConnectButton/TonWalletConnect';
import WalletBalance from '../UI/WalletBalance';
import PopUpInfo from '../UI/popUpInfo/PopUpInfo';
import BuyNFTPopup from '../UI/popUpBuyNFT/BuyNFTPopUp';
import Footer from '../footer/Footer';

import TestTranslationButton from '../UI/TestTranslationButton';


ReactModal.setAppElement('#root');

const NFTPage = () => {
	const { t } = useTranslation();

	const { walletAddress } = useTonWalletAddress();

	return (
		<div>
			<div className={styles.container}>
					<div className={styles.header}>
					<h1>{t("header")}</h1>
							<svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M26.1409 12.6524L16.7659 4.13283C16.4202 3.81661 15.9687 3.64124 15.5002 3.64124C15.0318 3.64124 14.5803 3.81661 14.2346 4.13283L4.85963 12.6524C4.66768 12.828 4.51437 13.0416 4.40946 13.2797C4.30455 13.5177 4.25033 13.775 4.25025 14.0352V24.8281C4.24263 25.3009 4.40952 25.7598 4.719 26.1172C4.89465 26.3169 5.11103 26.4768 5.35359 26.5859C5.59615 26.6951 5.85926 26.751 6.12525 26.75H11.7503C11.9989 26.75 12.2373 26.6512 12.4132 26.4754C12.589 26.2996 12.6877 26.0612 12.6877 25.8125V20.1875C12.6877 19.9389 12.7865 19.7004 12.9623 19.5246C13.1382 19.3488 13.3766 19.25 13.6252 19.25H17.3752C17.6239 19.25 17.8623 19.3488 18.0382 19.5246C18.214 19.7004 18.3127 19.9389 18.3127 20.1875V25.8125C18.3127 26.0612 18.4115 26.2996 18.5873 26.4754C18.7632 26.6512 19.0016 26.75 19.2502 26.75H24.8752C25.1862 26.7528 25.4928 26.6761 25.7659 26.5274C26.0631 26.3655 26.3112 26.1267 26.4844 25.836C26.6576 25.5453 26.7494 25.2134 26.7502 24.875V14.0352C26.7502 13.775 26.6959 13.5177 26.591 13.2797C26.4861 13.0416 26.3328 12.828 26.1409 12.6524Z" fill="white" />
							</svg>
					</div>

					<div className={styles.balance_container}>
						<div className={styles.balance_statement}><WalletBalance /></div>
					</div>

					<div className={styles.main_container}>
						<div className={styles.img_wrapper}>
						<img src="./assets/img/main_img.png" alt="nft_img" className={styles.img} />
						</div>

						<div className={styles.container_element}>
							<div className={styles.container_element_left}>{t('availableNFT')}</div>
							<div className={styles.container_element_right} id='nft_available_amount'>
								<AvailableNFT />
							</div>
						</div>

						<div className={styles.container_element}>
							<div className={styles.container_element_left}>{t('info')}
								<div><PopUpInfo /></div>
							</div>

							<div className={styles.container_element_right}>
								<a href='https://rpine.notion.site/NFT-collection-3008875fed1d44ab9e7bff23e1e47946' className={styles.link}>rpine.notion.site</a>
							</div>
						</div>

						<h2 className={styles.header_paragraph}>{t('referral_program')}</h2>
						<p className={styles.paragraph}>
							<Trans
								i18nKey="referral_program_paragraph"
								components={{
									1: <a href="https://t.me/rpine_xyz_bot" className={styles.link} />,
								}}
							/>
						</p>

						<div className={styles.button_container}>
						<div className={styles.button_description}>{t('buy_NFT_header')}</div>
							<div className={styles.button_group}>
								{walletAddress && <BuyNFTPopup />}
								<TonWalletConnect />
							<button className={styles.button_help}>{t('help_button')}</button>
							</div>
						</div>

						<div className={styles.market}>
						<p className={styles.market_element_left}>{t('sec_market')}</p>
							<a className={styles.market_element_right} href='https://getgems.io/collection/EQAPkxIsDFz2sm1mQv6NIVghZD7HYmA_ld7wKtovtnMNZ9lq'>GetGems.io</a>
						</div>
					</div>
				<Footer />
				<TestTranslationButton />
				</div>
			</div>
	);
};

export default NFTPage;