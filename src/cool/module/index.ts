import { App } from "vue";
import { isFunction, orderBy } from "lodash";
import { Module } from "../types";
import { filename } from "../utils";

// 扫描文件
const files: any = import.meta.glob("/src/modules/*/{config.ts,service/**,directives/**}", {
	eager: true
});

// @ts-ignore
const list: Module[] = window.__modules__ || (window.__modules__ = []);

// 模块
const module = {
	list,

	get(name: string): Module {
		// @ts-ignore
		return this.list.find((e) => e.name == name);
	},

	add(data: Module) {
		this.list.push(data);
	}
};

// 解析
for (const i in files) {
	// 分割
	const [, , , name, action] = i.split("/");

	// 文件名
	const fname = filename(i);

	// 文件内容
	const v = files[i]?.default;

	// 模块是否存在
	const m = module.get(name);

	// 数据
	const d = m || {
		name,
		value: null,
		services: [],
		directives: []
	};

	switch (action) {
		// 配置参数
		case "config.ts":
			d.value = v;
			break;

		// 请求服务
		case "service":
			const s = new v();

			if (s) {
				d.services?.push({
					path: s.namespace,
					value: s
				});
			}
			break;

		// 指令
		case "directives":
			d.directives?.push({ name: fname, value: v });
			break;
	}

	if (!m) {
		module.add(d);
	}
}

// 模块处理器
const modular = {
	install(app: App) {
		module.list.forEach((e) => {
			const d = isFunction(e.value) ? e.value(app) : e.value;

			if (d) {
				Object.assign(e, d);

				// 注册组件
				e.components?.forEach(async (c: any) => {
					const v = await (isFunction(c) ? c() : c);
					const n = v.default || v;
					app.component(n.name, n);
				});

				// 注册指令
				e.directives?.forEach((v) => {
					app.directive(v.name, v.value);
				});

				// 安装事件
				if (d.install) {
					d.install(app, d.options);
				}
			}
		});
	},
	async emit(name: "onLoad") {
		const list = orderBy(module.list, "order");
		const events = {};

		for (let i = 0; i < list.length; i++) {
			if (list[i][name]) {
				// @ts-ignore
				const e = await list[i][name](events);
				Object.assign(events, e);
			}
		}
	}
};

export { module, modular };
