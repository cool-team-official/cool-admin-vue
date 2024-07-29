import { fileURLToPath, URL } from "node:url";
import { ConfigEnv, UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueDevTools from "vite-plugin-vue-devtools";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
import { proxy } from "./src/config/proxy";
import { cool } from "@cool-vue/vite-plugin";

function toPath(dir: string) {
	return fileURLToPath(new URL(dir, import.meta.url));
}

// https://vitejs.dev/config
export default ({ mode }: ConfigEnv): UserConfig => {
	const isDev = mode === "development";

	return {
		plugins: [
			vue(),
			compression(),
			vueJsx(),
			// vueDevTools(),
			cool({
				type: "admin",
				proxy
			}),
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
				"/@": toPath("./src"),
				"/$": toPath("./src/modules"),
				"/#": toPath("./src/plugins"),
				"/~": toPath("./packages")
			}
		},
		esbuild: {
			// drop: isDev ? [] : ["console", "debugger"]
		},
		build: {
			minify: "esbuild",
			// terserOptions: {
			// 	compress: {
			// 		drop_console: true,
			// 		drop_debugger: true
			// 	}
			// },
			sourcemap: isDev,
			rollupOptions: {
				output: {
					chunkFileNames: "static/js/[name]-[hash].js",
					entryFileNames: "static/js/[name]-[hash].js",
					assetFileNames: "static/[ext]/[name]-[hash].[ext]",
					manualChunks(id) {
						if (id.includes("node_modules")) {
							if (!["@cool-vue/crud"].find((e) => id.includes(e))) {
								if (id.includes("prettier")) {
									return;
								}

								return id
									.toString()
									.split("node_modules/")[1]
									.replace(".pnpm/", "")
									.split("/")[0];
							} else {
								return "comm";
							}
						}
					}
				}
			}
		}
	};
};
