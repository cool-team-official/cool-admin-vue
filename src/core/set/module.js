import Vue from "vue";
import cool from "@/cool";
import store from "@/store";
import router from "@/router";
import { deepMerge, isFunction, isObject, isString } from "../utils";

// 模块列表
let modules = [];

export default function () {
	const files = require.context("@/cool/modules", true, /index.js$/);

	// 本地模块
	const local = files
		.keys()
		.map(e => {
			let [, name, , error] = e.split("/");

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
	function install(mod) {
		const { store: _store, components, service, directives, filters, pages, views, name } = mod;

		try {
			// 注册vuex模块
			if (_store) {
				for (let i in _store) {
					store.registerModule(`${name}-${i}`, _store[i]);
				}
			}

			// 注册组件
			if (components) {
				for (let i in components) {
					Vue.component(components[i].name, components[i]);
				}
			}

			// 注册请求服务
			if (service) {
				deepMerge(store.$service, service);
			}

			// 注册指令
			if (directives) {
				for (let i in directives) {
					Vue.directive(i, directives[i]);
				}
			}

			// 注册过滤器
			if (filters) {
				for (let i in filters) {
					Vue.filter(i, filters[i]);
				}
			}

			// 注册页面
			if (pages) {
				pages.forEach(e => {
					router.addRoute(e);
				});
			}

			// 注册视图
			if (views) {
				views.forEach(e => {
					if (!e.meta) {
						e.meta = {};
					}

					if (e.path) {
						router.$plugin.addViews([e], {
							ignore404: true
						});
					} else {
						console.error(`[${name}-views]：path in null`);
					}
				});
			}
		} catch (e) {
			console.error(`模块 ${name} 异常`, e);
		}
	}

	// 解析模块
	cool.modules.map(e => {
		if (!e) {
			return null;
		}

		let mod = null;

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
				mod.value = mod.value.install(Vue, mod.options);
			}
		} else {
			const item = local.find(m => m.name === mod.name);

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
				options: mod.options,
				...mod.value
			};

			modules.push(mod);
			install(mod);
		}
	});

	// 缓存模块
	store.commit("SET_MODULE", modules);
}
