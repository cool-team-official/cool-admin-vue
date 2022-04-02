import path from "path";
import { UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import viteCompression from "vite-plugin-compression";
import { svgBuilder } from "./build/svg";
import { cool } from "./build/cool";
import Components from "unplugin-vue-components/vite";

function resolve(dir: string) {
	return path.resolve(__dirname, ".", dir);
}

// https://vitejs.dev/config/

export default (): UserConfig => {
	// 请求代理地址
	const proxy = {
		"/dev": {
			target: "http://127.0.0.1:8001",
			changeOrigin: true,
			rewrite: (path: string) => path.replace(/^\/dev/, "")
		},

		"/ap": {
			target: "http://dev.frp.cool-js.cloud",
			changeOrigin: true,
			rewrite: (path: string) => path.replace(/^\/ap/, "")
		},

		"/pro": {
			target: "https://show.cool-admin.com",
			changeOrigin: true,
			rewrite: (path: string) => path.replace(/^\/pro/, "/api")
		}
	};

	return {
		base: "/",
		plugins: [
			vue(),
			viteCompression(),
			Components(),
			vueJsx(),
			svgBuilder("./src/icons/svg/"),
			cool()
		],
		resolve: {
			alias: {
				"/@": resolve("src"),
				"/#": resolve("types"),
				"/$": resolve("src/modules")
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
			port: 9100,
			proxy,
			hmr: {
				overlay: true
			}
		},
		define: {
			__PROXY_LIST__: JSON.stringify(proxy),
			__SERVER_PORT__: 9100
		},
		build: {
			sourcemap: false,
			polyfillDynamicImport: false // 必须为false
		}
	};
};
