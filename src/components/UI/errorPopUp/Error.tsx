import styles from './Error.module.css';
import { useTranslation } from 'react-i18next';

interface ErrorProps {
	errorMessage: string;
	onClose: () => void;
}

const Error: React.FC<ErrorProps> = ({ errorMessage, onClose }) => {
	const { t } = useTranslation();
	return (
		<div>
			<div className={styles.wrapper}>
				<div className={styles.container}>
					<h3 className={styles.header}>{errorMessage}</h3>
					<img src="./assets/img/pine_unhappy_svg.svg" alt="pine_unhappy" className={styles.img} />
					<button
						className={styles.close_button}
						onClick={onClose}>
						{t('back_button')}
					</button>
				</div>
			</div>
		</div>
	)
}

export default Error;