import path from "path";
import { UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import compression from "vite-plugin-compression";
import { proxy } from "./src/cool/config/proxy";
import { cool } from "./build/cool";

function resolve(dir: string) {
	return path.resolve(__dirname, ".", dir);
}

// https://vitejs.dev/config

export default (): UserConfig => {
	return {
		base: "/",
		plugins: [vue(), compression(), vueJsx(), cool()],
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
			minify: "terser",
			terserOptions: {
				compress: {
					drop_console: true,
					drop_debugger: true
				}
			},
			sourcemap: false,
			rollupOptions: {
				output: {
					chunkFileNames: "static/js/[name]-[hash].js",
					entryFileNames: "static/js/[name]-[hash].js",
					assetFileNames: "static/[ext]/[name]-[hash].[ext]",
					manualChunks(id) {
						if (id.includes("node_modules")) {
							if (
								!["@cool-vue/crud", "@cool-vue/admin"].find((e) => id.includes(e))
							) {
								let str = id.toString().split("node_modules/")[1];

								if (str[0] == "@") {
									str = str.replace("/", ".");
								}

								return str.split("/")[0].toString();
							}
						}
					}
				}
			}
		}
	};
};
