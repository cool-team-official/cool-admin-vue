import Vue from "vue";
import Cool from "cool";
import store from '@/store'
import router from '@/router'
import { deepMerge, isFunction, isObject } from "../utils";

export default function (options = {}) {
	if (!options.events) {
		options.events = {};
	}

	// 组件模块
	let componentModules = [];

	// 组件列表
	let components = [];

	// 安装组件
	function install(comp) {
		let { store: _store, components, service, directives, filters, pages, views, name } = comp;
		let { onInstall, onSuccess, onFail } = options.events[name] || {};

		try {
			const next = () => {
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
					pages.forEach((e) => {
						router.addRoute(e);
					});
				}

				// 注册视图
				if (views) {
					views.forEach((e) => {
						if (!e.meta) {
							e.meta = {};
						}

						if (e.moduleName) {
							componentModules.push(e);
						} else {
							e.meta.label = e.label;

							if (e.path) {
								router.$plugin.addViews([e], {
									ignore404: true
								});
							} else {
								console.error(`[${name}-views]：path in null`);
							}
						}
					});
				}

				// 包安装成功
				if (onSuccess) onSuccess(comp);
			};

			// 安装前
			if (onInstall) {
				onInstall(comp, { next });
			} else {
				next();
			}
		} catch (e) {
			console.error(e);

			// 安装失败
			if (onFail) onFail(comp, e);
		}
	}

	// 解析组件
	Cool.components.map((e) => {
		if (!e) {
			return null;
		}

		let comp = null;

		if (isObject(e)) {
			comp = e;
		} else {
			comp = {
				name: e[0],
				value: e[1],
				options: e[2]
			};
		}

		if (comp.value) {
			if (isFunction(comp.value.install)) {
				comp.value = comp.value.install(Vue, comp.options);
			}
		}

		// 是否开启
		if (comp.options && comp.options.enable === false) {
			return null;
		}

		if (comp) {
			comp = {
				name: comp.name,
				options: comp.options,
				...comp.value
			};

			components.push(comp);
			install(comp);
		}
	});

	// 设置缓存
	store.commit("SET_COMPONENT_MODULES", componentModules);
	store.commit("SET_COMPONENT", components);
}
