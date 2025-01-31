import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { TonConnectUIProvider, THEME } from '@tonconnect/ui-react';
import Home from './components/home/Home';
import NFTPage from './components/nftpage/NFTPage';
import './i18n';

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
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/nft" element={<NFTPage />} />
				</Routes>
			</BrowserRouter>
		</TonConnectUIProvider>
	);
}

export default App;