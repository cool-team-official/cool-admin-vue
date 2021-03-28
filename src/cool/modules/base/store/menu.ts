import { ElMessage } from "element-plus";
import storage from "store";
import store from "@/store";
import router from "@/router";
import { deepTree, revDeepTree, isArray, isEmpty } from "@/core/utils";
import { menuList } from "@/config/env";
import { revisePath } from "../utils";
import { MenuItem } from "../types";

const state = {
	// 视图路由，type=1
	routes: storage.get("viewRoutes") || [],
	// 树形菜单
	group: storage.get("menuGroup") || [],
	// showAMenu 模式下，顶级菜单的序号
	index: 0,
	// 左侧菜单
	menu: [],
	// 权限列表
	permission: storage.get("permission") || []
};

const getters = {
	// 树形菜单列表
	menuGroup: (state: any) => state.group,
	// 左侧菜单
	menuList: (state: any) => state.menu,
	// 视图路由
	routes: (state: any) => state.routes,
	// 权限列表
	permission: (state: any) => state.permission
};

const actions = {
	// 设置菜单、权限
	permMenu({ commit, state, getters }: any) {
		return new Promise((resolve, reject) => {
			const next = (res: any) => {
				if (!isArray(res.menus)) {
					res.menus = [];
				}

				if (!isArray(res.perms)) {
					res.perms = [];
				}

				const routes = res.menus
					.filter((e: MenuItem) => e.type != 2)
					.map((e: MenuItem) => {
						return {
							id: e.id,
							parentId: e.parentId,
							path: revisePath(e.router || String(e.id)),
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
					routes.filter((e: MenuItem) => e.type == 1)
				);
				// 设置菜单
				commit("SET_MENU_LIST", state.index);

				resolve(menuGroup);
			};

			// 监测自定义菜单
			if (!getters.app.conf.customMenu) {
				store.$service.common
					.permMenu()
					.then((res: any) => {
						next(res);
					})
					.catch((err: string) => {
						ElMessage.error("菜单加载异常");
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
};

const mutations = {
	// 设置树形菜单列表
	SET_MENU_GROUP(state: any, list: MenuItem[]) {
		state.group = list;
		storage.set("menuGroup", list);
	},

	// 设置视图路由
	SET_VIEW_ROUTES(state: any, list: MenuItem[]) {
		router.$plugin.addViews(list);

		state.routes = list;
		storage.set("viewRoutes", list);
	},

	// 设置左侧菜单
	SET_MENU_LIST(state: any, index: number) {
		const { showAMenu } = store.getters.app.conf;

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
	SET_PERMIESSION(state: any, list: Array<any>) {
		state.permission = list;
		storage.set("permission", list);
	}
};

export default {
	state,
	getters,
	actions,
	mutations
};
