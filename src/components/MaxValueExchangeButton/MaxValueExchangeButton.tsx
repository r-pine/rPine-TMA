import styles from './MaxValueExchangeButton.module.css';

interface MaxValueExchangeButtonProps {
	onMaxClick: () => void;
}

export const MaxValueExchangeButton: React.FC<MaxValueExchangeButtonProps> = ({ onMaxClick }) => {
	return (
		<button
			className={styles.maxAmountButton}
			onClick={onMaxClick}
			type="button"
		>
			MAX
		</button>
	);
};
