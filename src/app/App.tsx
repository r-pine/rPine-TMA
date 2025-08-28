import { HashRouter } from 'react-router-dom'
import { TonConnectUIProvider, THEME } from '@tonconnect/ui-react'
import { AppRoutes } from './Routes'
import './providers/i18n'

function App() {
	return (
		<TonConnectUIProvider
			manifestUrl="https://api.rpine.xyz/static/json/tonconnect-manifest-nft.json"
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
				<AppRoutes />
			</HashRouter>
		</TonConnectUIProvider>
	)
}

export default App