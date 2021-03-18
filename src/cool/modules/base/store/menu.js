import { Message } from "element-ui";
import { deepTree, revDeepTree, isArray, isEmpty } from "cl-admin/utils";
import { revisePath } from "../utils";
import router from "@/router";
import { menuList } from "@/config/env";
import store from "store";

export default {
	state: {
		// 视图路由，type=1
		routes: store.get("viewRoutes") || [],
		// 树形菜单
		group: store.get("menuGroup") || [],
		// showAMenu 模式下，顶级菜单的序号
		index: 0,
		// 左侧菜单
		menu: [],
		// 权限列表
		permission: []
	},
	getters: {
		// 树形菜单列表
		menuGroup: state => state.group,
		// 左侧菜单
		menuList: state => state.menu,
		// 视图路由
		routes: state => state.routes,
		// 权限列表
		permission: state => state.permission
	},
	actions: {
		// 设置菜单、权限
		permMenu({ commit, state, getters }) {
			return new Promise((resolve, reject) => {
				const next = res => {
					if (!isArray(res.menus)) {
						res.menus = [];
					}

					if (!isArray(res.perms)) {
						res.perms = [];
					}

					const routes = res.menus
						.filter(e => e.type != 2)
						.map(e => {
							return {
								moduleName: e.moduleName,
								id: e.id,
								parentId: e.parentId,
								path: revisePath(e.router || e.id),
								viewPath: e.viewPath,
								type: e.type,
								name: e.name,
								icon: e.icon,
								orderNum: e.orderNum,
								isShow: isEmpty(e.isShow) ? true : e.isShow,
								meta: {
									label: e.name,
									keepAlive: e.keepAlive
								},
								children: []
							};
						});

					// 转成树形菜单
					const menuGroup = deepTree(routes);

					// 设置权限
					commit("SET_PERMIESSION", res.perms);
					// 设置菜单组
					commit("SET_MENU_GROUP", menuGroup);
					// 设置视图路由
					commit(
						"SET_VIEW_ROUTES",
						routes.filter(e => e.type == 1)
					);
					// 设置菜单
					commit("SET_MENU_LIST", state.index);

					resolve(menuGroup);
				};

				// 监测自定义菜单
				if (!getters.app.conf.customMenu) {
					this.$service.common
						.permMenu()
						.then(res => {
							next(res);
						})
						.catch(err => {
							Message.error("菜单加载异常");
							console.error(err);
							reject(err);
						});
				} else {
					next({
						menus: revDeepTree(menuList)
					});
				}
			});
		}
	},
	mutations: {
		// 设置树形菜单列表
		SET_MENU_GROUP(state, list) {
			state.group = list;
			store.set("menuGroup", list);
		},

		// 设置视图路由
		SET_VIEW_ROUTES(state, list) {
			router.$plugin.addViews(list);

			state.routes = list;
			store.set("viewRoutes", list);
		},

		// 设置左侧菜单
		SET_MENU_LIST(state, index) {
			const { showAMenu } = this.getters.app.conf;

			if (isEmpty(index)) {
				index = state.index;
			}

			if (showAMenu) {
				const { children = [] } = state.group[index] || {};

				state.index = index;
				state.menu = children;
			} else {
				state.menu = state.group;
			}
		},

		// 设置权限
		SET_PERMIESSION(state, list) {
			state.permission = list;
			store.set("permission", list);
		}
	}
};
