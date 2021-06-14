import cool from "/@/cool";
import store from "/@/store";
import router from "/@/router";
import { deepMerge, isFunction, isObject } from "../utils";
import { deepFiles } from "../service";

// 模块列表
const modules: any[] = [];

function useModule(app: any) {
	// 安装模块
	function install(mod: any) {
		const { store: _store, service, directives, components, pages, views, name } = mod;

		try {
			// 注册vuex模块
			if (_store) {
				for (const i in _store) {
					store.registerModule(`${name}-${i}`, _store[i]);
				}
			}

			// 注册请求服务
			if (service) {
				// @ts-ignore
				deepMerge(store.service, service);
			}

			// 注册组件
			if (components) {
				components.forEach((e: any) => {
					if (e.name) {
						if (e.cool?.global || e.name.indexOf("cl-") === 0) {
							app.component(e.name, e);
						}
					}
				});
			}

			// 注册指令
			if (directives) {
				for (const i in directives) {
					app.directive(i, directives[i]);
				}
			}

			// 注册页面
			if (pages) {
				pages.forEach((e: any) => {
					router.addRoute(e);
				});
			}

			// 注册视图
			if (views) {
				views.forEach((e: any) => {
					if (!e.meta) {
						e.meta = {};
					}

					if (e.path) {
						router.$plugin?.addViews([e]);
					} else {
						console.error(`[${name}-views]：缺少 path 参数`);
					}
				});
			}
		} catch (e) {
			console.error(`模块 ${name} 异常`, e);
		}
	}

	const files = import.meta.globEager("/src/cool/modules/**/*");

	for (const i in files) {
		const [, , , , name, fn, cname] = i.split("/");
		const value: any = files[i].default;
		const fname: string = (cname || "").split(".")[0];

		function next(d: any) {
			switch (fn) {
				case "service":
					d._services.push({
						path: i.replace(`/src/cool/modules/${name}/service`, `${name}`),
						value: new value()
					});
					break;

				case "pages":
				case "views":
					if (value.cool) {
						d[fn].push({
							...value.cool.route,
							component: value
						});
					}
					break;

				case "components":
					d.components.push(value);
					break;

				case "store":
					d.store[fname] = value;
					break;

				case "directives":
					d.directives[fname] = value;
					break;

				case "config.ts":
					if (value) {
						d.options = value;
					}
					break;
			}

			return d;
		}

		const item: any = modules.find((e) => e.name === name);

		if (item) {
			next(item);
		} else {
			modules.push(
				next({
					name,
					options: {},
					directives: {},
					components: [],
					pages: [],
					views: [],
					store: {},
					_services: []
				})
			);
		}
	}

	// 本地模块
	modules.forEach((e) => {
		e.service = deepFiles(e._services);
		install(e);
	});

	// npm模块
	cool.modules.forEach((e: any) => {
		const d: any = e;

		if (isObject(e.value)) {
			if (isFunction(e.value.install)) {
				Object.assign(d, e.value.install(app, e.options));
			} else {
				Object.assign(d, e.value);
			}
		}

		install(d);
	});

	// 缓存模块
	store.commit("SET_MODULE", modules);
}

export { useModule };
