import styles from './Footer.module.css'
import { useTranslation } from 'react-i18next';

const Footer = ({ className }: { className?: string }) => {
	const { t } = useTranslation();
	return (
		<div className={className}>
			<footer>
				<div className={styles.footer}>{t('footer_text')} <span className={styles.footer_team}>RPine</span></div>
			</footer>
		</div>
	);
};

export default Footer;