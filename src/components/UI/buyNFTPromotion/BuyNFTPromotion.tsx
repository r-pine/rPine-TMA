import { Link } from 'react-router-dom';
import * as motion from 'motion/react-client';
import styles from './BuyNFTPromotion.module.css'
import { useTranslation } from 'react-i18next';

const BuyNFTPromotion = () => {
	const { t } = useTranslation();

	return (
		<div>
			<div className={styles.container}>
				<div className={styles.flexContainer}>
					<div className={styles.info}>
						<div className={styles.text}>{t('NFT_promotion_text')}</div>
						
						<Link to="/nft" className={styles.link}>
							<motion.button
								className={styles.button}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.95 }}
							>
								{t('buy_NFT_button')}
							</motion.button>
						</Link>
					</div>
					<div>
						<img src='assets/img/main_img.png' alt='NFT' className={styles.image} />
					</div>
				</div>
			</div>
		</div>
	)
}

export default BuyNFTPromotion;