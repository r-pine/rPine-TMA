import { Route, Routes, useLocation } from 'react-router-dom'
import * as motion from 'motion/react-client';
import { AnimatePresence } from 'motion/react';
import Home from '../pages/home/Home'
import NFTPage from '../pages/nft/NFTPage'
import { ModalOutlet } from '../components/modals/ModalOutlet'
import { AirswapPage } from '../pages/airswap/AirswapPage'
import { AirdropPage } from '../pages/airdrop/AirdropPage'


export const AppRoutes = () => {
	const location = useLocation();

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={location.pathname}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.3 }}
			>
				<Routes location={location}>
					<Route path="/" element={<Home />} />
					<Route path="/nft" element={<NFTPage />} />
					<Route element={<ModalOutlet />}>
						<Route path="/airswap" element={<AirswapPage />} />
						<Route path="/airdrop" element={<AirdropPage />} />
					</Route>
				</Routes>
			</motion.div>
		</AnimatePresence>
	)
}