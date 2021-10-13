import path from "path";
import type { UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import viteCompression from "vite-plugin-compression";
import { svgBuilder } from "./src/core/utils/svg";
import Components from "unplugin-vue-components/vite";

function resolve(dir: string) {
	return path.resolve(__dirname, ".", dir);
}

// https://vitejs.dev/config/

export default (): UserConfig => {
	return {
		base: "/",
		plugins: [vue(), viteCompression(), Components(), vueJsx(), svgBuilder("./src/icons/svg/")],
		resolve: {
			alias: {
				"/@": resolve("src"),
				"/#": resolve("types"),
				"/$": resolve("src/cool/modules")
			}
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@use "./src/assets/css/element.scss" as *;`
				}
			}
		},
		server: {
			port: 9000,
			hmr: {
				overlay: true
			},
			proxy: {
				"/dev": {
					target: "http://127.0.0.1:8001",
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/dev/, "")
				},

				"/pro": {
					target: "https://show.cool-admin.com",
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/pro/, "/api")
				}
			}
		},
		build: {
			sourcemap: false,
			polyfillDynamicImport: false // 必须为false
		},
		optimizeDeps: {
			exclude: ["vue-demi"]
		}
	};
};
