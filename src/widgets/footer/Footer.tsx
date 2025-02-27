import styles from './Footer.module.css'
import { useTranslation } from 'react-i18next';

const Footer = () => {
	const { t } = useTranslation();
	return (
		<div>
			<footer>
				<div className={styles.footer}>{t('footer_text')} <span className={styles.footer_team}>RPine</span></div>
			</footer>
		</div>
	);
};

export default Footer;