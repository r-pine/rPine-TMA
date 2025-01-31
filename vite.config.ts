import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
	server: {
		https: true,
		cors: true,
	},
  plugins: [react(),
	 	 basicSsl()
  ],
})
