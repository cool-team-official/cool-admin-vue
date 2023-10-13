import type { Plugin, ViteDevServer } from "vite";
import { createEps } from "./eps";
import { createModule } from "./module";

export function virtual(): Plugin {
	const virtualModuleIds = ["virtual:eps", "virtual:module"];

	// 使虚拟模块失效，重新加载
	function buildEps(server: ViteDevServer) {
		virtualModuleIds.forEach((vm) => {
			const mod = server.moduleGraph.getModuleById(`\0${vm}`);

			if (mod) {
				server.moduleGraph.invalidateModule(mod);
			}
		});
	}

	return {
		name: "vite-cool-virtual",
		enforce: "pre",
		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				// 页面刷新时触发 eps 刷新
				if (req.url == "/@vite/client") {
					buildEps(server);
				}

				next();
			});
		},
		handleHotUpdate({ file, server }) {
			// 代码保存时触发 eps 刷新
			if (!file.includes("build/cool/dist")) {
				buildEps(server);
			}
		},
		resolveId(id) {
			if (virtualModuleIds.includes(id)) {
				return "\0" + id;
			}
		},
		async load(id) {
			if (id === "\0virtual:eps") {
				const { service, list } = await createEps();

				return `
					export const eps = ${JSON.stringify({ service, list })}
				`;
			}

			if (id === "\0virtual:module") {
				const { dirs } = createModule();

				return `
					export const dirs = ${JSON.stringify(dirs)}
				`;
			}
		}
	};
}
