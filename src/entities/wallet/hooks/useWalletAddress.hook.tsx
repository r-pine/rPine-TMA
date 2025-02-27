import { useEffect, useState } from 'react';
import { useTonConnectUI, Wallet } from '@tonconnect/ui-react';

const useTonWalletAddress = () => {
	const [walletAddress, setWalletAddress] = useState<string | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [tonConnectUI] = useTonConnectUI();

	useEffect(() => {
		const handleWalletChange = (wallet: Wallet | null) => {
			if (wallet) {
				setWalletAddress(wallet.account.address);
				setIsConnected(true);
			} else {
				setWalletAddress(null);
				setIsConnected(false);
			}
		};

		if (tonConnectUI.wallet) {
			handleWalletChange(tonConnectUI.wallet);
		}

		const unsubscribe = tonConnectUI.onStatusChange(handleWalletChange);

		return () => unsubscribe();
	}, [tonConnectUI]);

	const connectWallet = async () => {
		try {
			await tonConnectUI.openModal();
		} catch (error) {
			console.error('Error connecting wallet:', error);
		}
	};

	const disconnectWallet = async () => {
		try {
			await tonConnectUI.disconnect();
		} catch (error) {
			console.error('Error disconnecting wallet:', error);
		}
	};

	const formatAddress = (address: string | null) => {
		if (!address) return '';
		return `${address.slice(0, 4)}...${address.slice(-4)}`;
	};

	return {
		walletAddress,
		formattedAddress: walletAddress ? formatAddress(walletAddress) : null,
		isConnected,
		connectWallet,
		disconnectWallet,
	};
};

export default useTonWalletAddress;