import { Link } from 'react-router-dom';
import * as motion from 'motion/react-client';
import styles from './BuyNFTPromotion.module.css'
import Footer from '../../../widgets/footer/Footer';
import { useTranslation } from 'react-i18next';

const BuyNFTPromotion = () => {
	const { t } = useTranslation();

	return (
		<div>
			<div className={styles.container}>
				<div className={styles.flexContainer}>
					<div className={styles.info}>
						<div className={styles.text}>{t('NFT_promotion_text')}</div>
						<motion.button
							className={styles.button}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.95 }}
						>
							<Link to="/nft" className={styles.link}>{t('buy_NFT_button')}</Link>
						</motion.button>
					</div>
					<div>
						<img src='assets/img/main_img.png' alt='NFT' className={styles.image} />
					</div>
				</div>
				<Footer />
			</div>
		</div>
	)
}

export default BuyNFTPromotion;