import useTonBalance from '../../hooks/useTonBalance.hook';
import { useTranslation } from 'react-i18next';


const WalletBalance = () => {
	const { t } = useTranslation();
	const balance = useTonBalance();

	return (
		<div>
			<p>
				{t('balance')} {balance !== null ? balance : '0'}
			</p>
		</div>
	);
};

export default WalletBalance;