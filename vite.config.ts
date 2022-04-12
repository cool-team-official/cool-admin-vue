import path from "path";
import { UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import viteCompression from "vite-plugin-compression";
import { svgBuilder } from "./build/svg";
import { cool } from "./build/cool";
import Components from "unplugin-vue-components/vite";
import Unocss from "unocss/vite";
import { presetUno } from "unocss";

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
			Unocss({
				presets: [presetUno()]
			}),
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
		server: {
			port: 9000,
			proxy,
			hmr: {
				overlay: true
			}
		},
		define: {
			__PROXY_LIST__: JSON.stringify(proxy),
			__SERVER_PORT__: 9000
		},
		build: {
			sourcemap: false,
			polyfillDynamicImport: false // 必须为false
		}
	};
};
