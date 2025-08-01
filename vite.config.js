import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		proxy: {
			"/api": {
				// target: "https://apiservice.com",
				target: "https://2.teamplace.finneg.com",
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/api/, "")
			}
		}
	},

	plugins: [vue()]
});
