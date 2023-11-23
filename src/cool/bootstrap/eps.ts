import { cloneDeep, merge } from "lodash-es";
import { BaseService, service } from "../service";
import { Module } from "../types";
import { path2Obj } from "../utils";
import { config, isDev } from "/@/config";
import { eps } from "virtual:eps";
import { hmr } from "../hook";
import { module } from "../module";

// 更新事件
function onUpdate() {
	// 设置 request 方法
	function set(d: any) {
		if (d.namespace) {
			const a = new BaseService(d.namespace);

			for (const i in d) {
				const { path, method = "get" } = d[i];

				if (path) {
					a.request = a.request;

					a[i] = function (data?: any) {
						return this.request({
							url: path,
							method,
							[method.toLocaleLowerCase() == "post" ? "data" : "params"]: data
						});
					};
				}
			}

			for (const i in a) {
				d[i] = a[i];
			}
		} else {
			for (const i in d) {
				set(d[i]);
			}
		}
	}

	// 遍历每一个方法
	set(eps.service);

	// 合并[eps]
	merge(service, eps.service);

	// 合并[local]
	merge(
		service,
		cloneDeep(
			path2Obj(
				module.list.reduce((a, b) => {
					return a.concat(...((b.services as any[]) || []));
				}, [])
			)
		)
	);

	// 热更新处理
	hmr.setData("service", service);

	// 提示
	if (isDev) {
		console.log("[eps] update");
	}
}

export function createEps(modules: Module[]) {
	// 更新 eps
	onUpdate();

	// 开发环境下，生成本地 service 的类型描述文件
	if (isDev && config.test.eps) {
		const list: any[] = [];

		// 模拟 eps 数据
		modules.forEach((m) => {
			m.services?.forEach((s) => {
				const api = Array.from(
					new Set([
						...Object.getOwnPropertyNames(s.value.constructor.prototype),
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
							path: `/${e}`
						};
					});

				list.push({
					api,
					module: m.name,
					name: s.value.constructor.name + "Entity",
					prefix: `/admin/${s.path}`,
					isLocal: true
				});
			});
		});

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

// 监听 vite 触发事件
if (import.meta.hot) {
	import.meta.hot.on("eps-update", ({ service }) => {
		if (service) {
			eps.service = service;
		}
		onUpdate();
	});
}
