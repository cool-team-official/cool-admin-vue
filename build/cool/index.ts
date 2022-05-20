import { Plugin } from "vite";
import { parseJson } from "./utils";
import { getModules } from "./lib/modules";
import { createEps, getEps } from "./lib/eps";
import { createMenu } from "./lib/menu";

export const cool = (): Plugin | null => {
	return {
		name: "vite-cool",
		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				function done(data: any) {
					res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
					res.end(JSON.stringify(data));
				}

				// 自定义
				if (req.url.includes("__cool")) {
					const body = await parseJson(req);
					let next: any = null;

					switch (req.url) {
						// 快速创建菜单
						case "/__cool_createMenu":
							next = createMenu(body);
							break;

						// 获取模块列表
						case "/__cool_modules":
							next = getModules();
							break;

						// 创建描述文件
						case "/__cool_eps":
							next = createEps(body);
							break;
					}

					if (next) {
						next.then((data: any) => {
							done({
								code: 1000,
								data
							});
						}).catch((message: string) => {
							done({
								code: 1001,
								message
							});
						});
					}
				} else {
					next();
				}
			});
		},
		config() {
			return {
				define: {
					__EPS__: getEps()
				}
			};
		}
	};
};
