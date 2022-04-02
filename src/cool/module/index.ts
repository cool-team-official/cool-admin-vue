import modules from "/@/modules";
import { router, addViews } from "../router";
import { isFunction, isObject, filename } from "../utils";
import { App } from "vue";
import module from "../utils/module";

// 扫描文件
const files = import.meta.globEager("/src/modules/**/*");

// 模块列表
const list: any[] = [...modules];

function main() {
	for (const i in files) {
		// 模块名
		const [, , , name, action] = i.split("/");

		if (name == "index.ts") {
			continue;
		}

		// 文件内容
		let value: any = null;

		try {
			value = files[i].default;
		} catch (err) {
			console.error(err, i);
			value = files[i];
		}

		if (!value) {
			continue;
		}

		// 文件名
		const fname: string = filename(i);

		// 配置参数
		function next(d: any) {
			// 配置参数入口
			if (action == "config.ts") {
				d.options = value || {};
			}

			// 其他功能
			switch (action) {
				case "service":
					const s = new value();

					d.service.push({
						path: s.namespace,
						value: s
					});
					break;

				case "pages":
				case "views":
					if (value.cool) {
						d[action].push({
							...value.cool.route,
							component: value
						});
					}
					break;

				case "components":
					d.components[value.name] = value;
					break;

				case "directives":
					d.directives[fname] = value;
					break;
			}

			return d;
		}

		// 是否存在
		const item: any = list.find((e) => e.name === name);

		if (item) {
			if (!item.isLoaded) {
				next(item);
			}
		} else {
			list.push(
				next({
					name,
					options: {},
					directives: {},
					components: {},
					pages: [],
					views: [],
					service: []
				})
			);
		}
	}

	module.set(list);
}

main();

export function useModule(app: App) {
	// 模块安装
	list.forEach((e: any) => {
		if (isObject(e.value)) {
			if (isFunction(e.value.install)) {
				Object.assign(e, e.value.install(app, e.options));
			} else {
				Object.assign(e, e.value);
			}
		}

		try {
			// 注册组件
			if (e.components) {
				for (const i in e.components) {
					if (e.components[i]) {
						if (e.components[i].cool?.global || i.indexOf("cl-") === 0) {
							app.component(e.components[i].name, e.components[i]);
						}
					}
				}
			}

			// 注册指令
			if (e.directives) {
				for (const i in e.directives) {
					app.directive(i, e.directives[i]);
				}
			}

			// 注册页面
			if (e.pages) {
				e.pages.forEach((e: any) => {
					router.addRoute(e);
				});
			}

			// 注册视图
			if (e.views) {
				e.views.forEach((e: any) => {
					if (!e.meta) {
						e.meta = {};
					}

					if (e.path) {
						addViews([e]);
					} else {
						console.error(`[${name}-views]：缺少 path 参数`);
					}
				});
			}
		} catch (err) {
			console.error(`模块 ${name} 异常`, err);
		}
	});
}
