import path from "path";
import { ConfigEnv, UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
import { proxy } from "./src/config/proxy";
import { cool } from "./build/cool";

function resolve(dir: string) {
	return path.resolve(__dirname, ".", dir);
}

function isDev(mode: string | undefined): boolean {
	return mode === "development";
}

// https://vitejs.dev/config
export default ({ mode }: ConfigEnv): UserConfig => {
	return {
		plugins: [
			vue(),
			compression(),
			vueJsx(),
			cool(false), // 是否测试模式
			visualizer({
				open: false,
				gzipSize: true,
				brotliSize: true
			})
		],
		base: "/",
		server: {
			port: 9000,
			proxy,
			hmr: {
				overlay: true
			}
		},
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
				"/$": resolve("src/modules"),
				"/#": resolve("types"),
				"/~": resolve("packages")
			}
		},
		esbuild: {
			drop: isDev(mode) ? [] : ["console", "debugger"]
		},
		build: {
			minify: "esbuild",
			// terserOptions: {
			// 	compress: {
			// 		drop_console: true,
			// 		drop_debugger: true
			// 	}
			// },
			sourcemap: isDev(mode),
			rollupOptions: {
				output: {
					chunkFileNames: "static/js/[name]-[hash].js",
					entryFileNames: "static/js/[name]-[hash].js",
					assetFileNames: "static/[ext]/[name]-[hash].[ext]",
					manualChunks(id) {
						if (id.includes("node_modules")) {
							if (!["@cool-vue/crud"].find((e) => id.includes(e))) {
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
