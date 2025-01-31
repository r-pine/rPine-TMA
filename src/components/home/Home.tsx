import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TonWalletConnect from '../UI/TonWalletConnectButton/TonWalletConnect';

const Home = () => {

	return (
		<div>
			<h1>Welcome to the Home Page!</h1>
			<p>This is your main page.</p>
			<Link to="/nft">Go to NFT Page</Link>
			<h2>TON Wallet Connection</h2>
			<TonWalletConnect />
		</div>
	);
};

export default Home;