import { useEffect, useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';

const useTonWalletAddress = () => {
	const [walletAddress, setWalletAddress] = useState<string | null>(null);
	const [tonConnectUI] = useTonConnectUI();

	useEffect(() => {
		if (tonConnectUI.wallet) {
			setWalletAddress(tonConnectUI.wallet.account.address);
		}

		const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
			setWalletAddress(wallet ? wallet.account.address : null);
		});

		return () => unsubscribe();
	}, [tonConnectUI]);

	const connectWallet = async () => {
		await tonConnectUI.openModal();
	};

	const disconnectWallet = async () => {
		await tonConnectUI.disconnect();
	};

	const formatAddress = (address: string | null) => {
		if (!address) return '';
		const tempAddress = address.toString();
		return `${tempAddress.slice(0, 4)}...${tempAddress.slice(-4)}`;
	};

	return {
		walletAddress,
		formattedAddress: walletAddress ? formatAddress(walletAddress) : null,
		connectWallet,
		disconnectWallet,
	};
};

export default useTonWalletAddress;