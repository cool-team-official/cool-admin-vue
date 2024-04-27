import type { Plugin } from "vite";
import { createEps } from "./eps";
import { createCtx } from "./ctx";

export async function virtual(): Promise<Plugin> {
	const virtualModuleIds: string[] = ["virtual:eps", "virtual:ctx"];

	return {
		name: "vite-cool-virtual",
		enforce: "pre",
		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				// 页面刷新时触发
				if (req.url == "/@vite/client") {
					// 重新加载虚拟模块
					virtualModuleIds.forEach((vm) => {
						const mod = server.moduleGraph.getModuleById(`\0${vm}`);

						if (mod) {
							server.moduleGraph.invalidateModule(mod);
						}
					});
				}

				next();
			});
		},
		handleHotUpdate({ file, server }) {
			// 文件修改时触发
			if (
				!["pages.json", "dist", "build/cool", "eps.json", "eps.d.ts"].some((e) =>
					file.includes(e),
				)
			) {
				createCtx();

				createEps().then((data) => {
					// 通知客户端刷新
					(server.hot || server.ws).send({
						type: "custom",
						event: "eps-update",
						data,
					});
				});
			}
		},
		resolveId(id) {
			if (virtualModuleIds.includes(id)) {
				return "\0" + id;
			}
		},
		async load(id) {
			if (id === "\0virtual:eps") {
				const eps = await createEps();

				return `
					export const eps = ${JSON.stringify(eps)}
				`;
			}
			if (id === "\0virtual:ctx") {
				const ctx = await createCtx();

				return `
					export const ctx = ${JSON.stringify(ctx)}
				`;
			}
		},
	};
}
