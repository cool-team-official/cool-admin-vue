import type { Plugin } from "vite";
import { createEps } from "./eps";
import { createCtx } from "./ctx";

export async function virtual(): Promise<Plugin> {
	const virtualModuleIds: string[] = ["virtual:eps", "virtual:ctx"];

	const eps = await createEps();
	const ctx = await createCtx();

	return {
		name: "vite-cool-virtual",
		enforce: "pre",
		handleHotUpdate({ file, server }) {
			if (!["pages.json", "dist"].some((e) => file.includes(e))) {
				createCtx();

				createEps().then((data) => {
					// 通知客户端刷新
					server.ws.send({
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
		load(id) {
			if (id === "\0virtual:eps") {
				return `
					export const eps = ${JSON.stringify(eps)}
				`;
			}
			if (id === "\0virtual:ctx") {
				return `
					export const ctx = ${JSON.stringify(ctx)}
				`;
			}
		},
	};
}
