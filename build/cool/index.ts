import { Plugin } from "vite";
import { createSvg } from "./svg";
import { createTag } from "./tag";
import { createEps } from "./eps";
import { createModule } from "./module";
import { createMenu } from "./menu";
import { parseJson } from "./utils";

export function cool(): Plugin {
	// 虚拟模块
	const virtualModuleIds = ["virtual:eps", "virtual:module"];

	return {
		name: "vite-cool",
		enforce: "pre",
		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				function done(data: any) {
					res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
					res.end(JSON.stringify(data));
				}

				if (req.url?.includes("__cool")) {
					const body = await parseJson(req);

					switch (req.url) {
						// 快速创建菜单
						case "/__cool_createMenu":
							await createMenu(body);
							break;

						// 创建描述文件
						case "/__cool_eps":
							await createEps(body);
							break;

						default:
							return done({
								code: 1001,
								message: "未知请求"
							});
					}

					done({
						code: 1000
					});
				} else {
					next();
				}
			});
		},
		transform(code, id) {
			return createTag(code, id);
		},
		transformIndexHtml(html) {
			return createSvg(html);
		},
		resolveId(id) {
			if (virtualModuleIds.includes(id)) {
				return "\0" + id;
			}
		},
		async load(id) {
			if (id === "\0virtual:eps") {
				return createEps();
			}

			if (id === "\0virtual:module") {
				return createModule();
			}
		}
	};
}
