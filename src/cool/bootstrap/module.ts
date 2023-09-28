import { App } from "vue";
import { isFunction, orderBy } from "lodash-es";
import { filename } from "../utils";
import { module } from "../module";
import { hmr } from "../hook";

// 扫描文件
const files: any = import.meta.glob("/src/modules/*/{config.ts,service/**,directives/**}", {
	eager: true
});

// 模块列表
module.list = hmr.getData("modules", []);

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

// 创建
export function createModule(app: App) {
	// 模块加载
	const list = orderBy(module.list, "order").map((e) => {
		const d = isFunction(e.value) ? e.value(app) : e.value;

		if (d) {
			Object.assign(e, d);
		}

		// 安装事件
		e.install?.(app, d.options);

		// 注册组件
		e.components?.forEach(async (c: any) => {
			const v = await (isFunction(c) ? c() : c);
			const n = v.default || v;
			app.component(n.name, n);
		});

		// 注册指令
		e.directives?.forEach((v: any) => {
			app.directive(v.name, v.value);
		});

		return e;
	});

	return {
		// 模块列表
		list,
		// 事件加载
		async eventLoop() {
			const events: any = {};

			for (let i = 0; i < list.length; i++) {
				if (list[i].onLoad) {
					Object.assign(events, await list[i]?.onLoad?.(events));
				}
			}
		}
	};
}
