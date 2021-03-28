import cool from "@/cool";
import store from "@/store";
import router from "@/router";
import { deepMerge, isFunction, isArray, isObject, isString } from "../utils";

// 模块列表
const modules: any[] = [];

export default function(app: any) {
	const files = require.context("@/cool/modules", true, /index.ts$/);

	// 本地模块
	const local = files
		.keys()
		.map(e => {
			const [, name, , error] = e.split("/");

			if (!error) {
				return {
					name,
					value: files(e).default
				};
			} else {
				return null;
			}
		})
		.filter(Boolean);

	// 安装模块
	function install(mod: any) {
		const { store: _store, components, service, directives, pages, views, name } = mod;

		try {
			// 注册vuex模块
			if (_store) {
				for (const i in _store) {
					store.registerModule(`${name}-${i}`, _store[i]);
				}
			}

			// 注册组件
			if (components) {
				for (const i in components) {
					if (components[i].name) {
						app.component(components[i].name, components[i]);
					} else {
						console.error(`组件 ${i} 缺少 name 参数`);
					}
				}
			}

			// 注册请求服务
			if (service) {
				// @ts-ignore
				deepMerge(store.$service, service);
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
						router.$plugin.addViews([e]);
					} else {
						console.error(`[${name}-views]：缺少 path 参数`);
					}
				});
			}
		} catch (e) {
			console.error(`模块 ${name} 异常`, e);
		}
	}

	// 解析模块
	cool.modules.map((e: any) => {
		if (!e) {
			return null;
		}

		let mod: any = null;

		// Parse
		if (isString(e)) {
			mod = {
				name: e
			};
		} else if (isObject(e)) {
			mod = e;
		} else if (isArray(e)) {
			mod = {
				name: e[0],
				value: e[1],
				options: e[2]
			};
		} else {
			console.error(e, "格式错误");
		}

		// Set
		if (mod.value) {
			if (isFunction(mod.value.install)) {
				mod.value = mod.value.install(app, mod.options);
			}
		} else {
			const item = local.find((m: any) => m.name === mod.name);

			if (item) {
				mod.value = item.value;
			}
		}

		if (!mod.value) {
			console.error(mod.name, "不是一个有效的模块");
		}

		// 是否开启
		if (mod.options && mod.options.enable === false) {
			return null;
		}

		if (mod) {
			mod = {
				name: mod.name,
				options: mod.options || {},
				...mod.value
			};

			modules.push(mod);
			install(mod);
		}
	});

	// 缓存模块
	store.commit("SET_MODULE", modules);
}
