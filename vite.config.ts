// @ts-nocheck
import path from "path";
import type { UserConfig, ConfigEnv } from 'vite';
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { svgBuilder } from "./src/core/utils/svg";

function resolve(dir: string) {
	return path.resolve(__dirname, ".", dir);
}

// https://vitejs.dev/config/

export default ({ command, mode }: ConfigEnv): UserConfig => {
	return {
		base: "/",
		plugins: [vue(), vueJsx(), svgBuilder("./src/icons/svg/")],
		resolve: {
			alias: {
				"/@": resolve("src"),
				"/#": resolve("types")
			}
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: "@import './src/assets/css/common.scss';"
				}
			}
		},
		server: {
			port: 9000,
			hmr: {
				overlay: true,
			},
			proxy: {
				"/dev": {
					target: "http://127.0.0.1:8001",
					changeOrigin: true,
					rewrite: path => path.replace(/^\/dev/, "")
				},

				"/pro": {
					target: "https://show.cool-admin.com",
					changeOrigin: true,
					rewrite: path => path.replace(/^\/pro/, "/api")
				}
			}
		},

		optimizeDeps: {
			include: [
			],
			exclude: ['vue-demi'],
		},
	};
};
