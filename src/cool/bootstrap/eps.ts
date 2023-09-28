import { merge } from "lodash-es";
import { service } from "../service";
import { Module } from "../types";
import { path2Obj } from "../utils";
import { config, isDev } from "/@/config";

export function createEps(modules: Module[]) {
	// 本地模块的数据
	const s = path2Obj(
		modules.reduce((a, b) => {
			return a.concat(...((b.services as any[]) || []));
		}, [])
	);

	// 合并数据
	merge(service, s);

	// 开发环境下，生成本地 service 的类型文件
	if (isDev && config.test.eps) {
		const list: any[] = [];

		// 模拟 eps 数据
		function deep(s: any) {
			if (s.namespace) {
				const api = Array.from(
					new Set([
						...Object.getOwnPropertyNames(s.constructor.prototype),
						"page",
						"list",
						"info",
						"delete",
						"update",
						"add"
					])
				)
					.filter((e) => !["constructor", "namespace"].includes(e))
					.map((e) => {
						return {
							path: e
						};
					});

				list.push({
					api,
					module: s.namespace.split("/")[0],
					name: s.constructor.name,
					prefix: s.namespace
				});
			} else {
				for (const i in s) {
					deep(s[i]);
				}
			}
		}

		deep(s);

		// 生成文件
		service.request({
			url: "/__cool_eps",
			method: "POST",
			proxy: false,
			data: {
				list
			}
		});
	}
}
