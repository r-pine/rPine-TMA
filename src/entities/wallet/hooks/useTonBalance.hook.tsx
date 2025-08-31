import { useEffect, useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { fetchBalance } from '../api/balance.api';
import { useDispatch } from 'react-redux';
import { setTonBalance } from '../../../store/wallet/slice';

const useTonBalance = () => {
	const [balance, setLocalBalance] = useState<string>('0');
	const [tonConnectUI] = useTonConnectUI();
	const dispatch = useDispatch();

	useEffect(() => {
		let isMounted = true;
		const timeout: ReturnType<typeof setTimeout> | null = null;

		const updateBalance = async () => {
			if (!tonConnectUI.wallet) {
				if (isMounted) {
					setLocalBalance('0');
					dispatch(setTonBalance('0'));
				}
				return;
			}

			const account = tonConnectUI.wallet.account;

			try {
				const balance = await fetchBalance(account.address);
				if (isMounted) {
					const balanceString = balance?.toString() || '0';
					setLocalBalance(balanceString);
					dispatch(setTonBalance(balanceString));
				}
			} catch (error) {
				console.error('Error fetching balance:', error);
				if (isMounted) {
					setLocalBalance('0');
					dispatch(setTonBalance('0'));
				}
			}
		};

		const unsubscribe = tonConnectUI.onStatusChange(updateBalance);
		updateBalance();

		return () => {
			isMounted = false;
			if (timeout) clearTimeout(timeout);
			unsubscribe();
		};
	}, [tonConnectUI, dispatch]);

	return balance;
};

export default useTonBalance;
