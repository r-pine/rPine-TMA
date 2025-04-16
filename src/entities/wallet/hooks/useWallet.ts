import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

export const useWallet = () => {
	const isConnected = useSelector((state: RootState) => state.wallet.isConnected);
	const address = useSelector((state: RootState) => state.wallet.address);
	const balances = useSelector((state: RootState) => state.wallet.balances);

	return {
		isConnected,
		address,
		balances,
	};
}; 