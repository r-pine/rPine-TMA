import { Link } from 'react-router-dom';
import styles from './Home.module.css'
import TonWalletConnect from '../../components/UI/TonWalletConnectButton/TonWalletConnect';

const Home = () => {

	return (
		<div>
			<div className={styles.container}>
				<h1 className={styles.header}>Oops! This page is building...</h1>
				<img src="./assets/img/pine_happy_svg.svg" alt="happypine_img" className={styles.img} />
				<p className={styles.container_element}>There will be a swap page soon!</p>
				<p className={styles.container_element}>But you can check our NFT Page:</p>
				<Link to="/nft">Go to NFT Page</Link>
				<h2 className={styles.header}>and connect your TON Wallet:</h2>
				<TonWalletConnect />
			</div>
		</div>
	);
};

export default Home;