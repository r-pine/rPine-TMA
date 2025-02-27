import { HashRouter, Route, Routes } from 'react-router-dom';
import { TonConnectUIProvider, THEME } from '@tonconnect/ui-react';
import Home from '../pages/home/Home';
import NFTPage from '../pages/nft/NFTPage';
import './providers/i18n';

function App() {
	return (
		<TonConnectUIProvider manifestUrl="https://api.rpine.xyz/static/json/tonconnect-manifest.json"
			uiPreferences={{
				theme: THEME.DARK,
				colorsSet: {
					[THEME.DARK]: {
						connectButton: {
							background: '#0C9BE9',
						}
					},
				},
			}}>
			<HashRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/nft" element={<NFTPage />} />
				</Routes>
			</HashRouter>
		</TonConnectUIProvider>
	);
}

export default App;