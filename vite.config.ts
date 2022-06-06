import path from "path";
import { UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import viteCompression from "vite-plugin-compression";
import Components from "unplugin-vue-components/vite";
import Unocss from "unocss/vite";
import { presetUno } from "unocss";
import { proxy } from "./src/cool/config/proxy";
import { cool } from "./build/cool";
import { svgBuilder, findSvgFolders } from "./build/svg";

function resolve(dir: string) {
	return path.resolve(__dirname, ".", dir);
}

// https://vitejs.dev/config/

export default (): UserConfig => {
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
			svgBuilder(["./src/icons/svg/",...findSvgFolders("./src/modules/")]),
			cool()
		],
		css: {
			preprocessorOptions: {
				scss: {
					charset: false
				}
			}
		},
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
		build: {
			sourcemap: false,
			polyfillDynamicImport: false, // 必须为false
			rollupOptions: {
				output: {
					// manualChunks(id) {
					// 	if (id.includes("node_modules")) {
					// 		return id.toString().split("node_modules/")[1].split("/")[0].toString();
					// 	}
					// }
				}
			}
		}
	};
};
