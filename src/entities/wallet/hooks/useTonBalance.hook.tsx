import { useEffect, useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';

const useTonBalance = () => {
	const [balance, setBalance] = useState<number | null>(null);
	const [tonConnectUI] = useTonConnectUI();

	useEffect(() => {
		const fetchBalance = async () => {
			if (!tonConnectUI.wallet) return;
			const account = tonConnectUI.wallet.account;
			const response = await fetch(
				`https://toncenter.com/api/v2/getAddressBalance?address=${account.address}`
			);
			const data = await response.json();
			setBalance(parseFloat((data.result / 10 ** 9).toFixed(2)));
		};

		fetchBalance();

		const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
			if (wallet) {
				fetchBalance();
			} else {
				setBalance(null);
			}
		});

		return () => {
			unsubscribe();
		};
	}, [tonConnectUI]);

	return balance;
};

export default useTonBalance;