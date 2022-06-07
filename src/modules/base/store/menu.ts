import { ElMessage } from "element-plus";
import { defineStore } from "pinia";
import { ref } from "vue";
import { deepTree, revDeepTree, storage } from "/@/cool/utils";
import { isArray, isEmpty, isObject, orderBy } from "lodash";
import { viewer, service, config } from "/@/cool";
import { revisePath } from "../utils";

declare enum Type {
	"目录" = 0,
	"菜单" = 1,
	"权限" = 2
}

declare interface Item {
	id: number;
	parentId: number;
	path: string;
	router?: string;
	viewPath?: string;
	type: Type;
	name: string;
	icon: string;
	orderNum: number;
	isShow: number;
	keepAlive?: number;
	meta?: {
		label: string;
		keepAlive: number;
	};
	children?: Item[];
}

// 本地缓存
const data = storage.info();

export const useMenuStore = defineStore("menu", function () {
	// 视图路由
	const routes = ref<Item[]>(data["menu.routes"] || []);

	// 菜单组
	const group = ref<Item[]>(data["menu.group"] || []);

	// 顶部菜单序号
	const index = ref<number>(0);

	// 左侧菜单列表
	const list = ref<Item[]>([]);

	// 权限列表
	const perms = ref<any[]>(data["menu.perms"] || []);

	// 设置左侧菜单
	function setMenu(i?: number) {
		if (i === undefined) {
			i = index.value;
		}

		// 显示分组显示菜单
		if (config.app.menu.isGroup) {
			const { children = [] } = group.value[i] || {};

			index.value = i;
			list.value = children;
		} else {
			list.value = group.value;
		}
	}

	// 设置权限
	function setPerms(list: Item[]) {
		function deep(d: any) {
			if (isObject(d)) {
				if (d.permission) {
					d._permission = {};
					for (const i in d.permission) {
						d._permission[i] =
							list.findIndex((e: any) =>
								e
									.replace(/:/g, "/")
									.includes(`${d.namespace.replace("admin/", "")}/${i}`)
							) >= 0;
					}
				} else {
					for (const i in d) {
						deep(d[i]);
					}
				}
			}
		}

		perms.value = list;
		storage.set("menu.perms", list);

		deep(service);
	}

	// 设置视图
	function setRoutes(list: Item[]) {
		viewer.add(list);

		routes.value = list;
		storage.set("menu.routes", list);
	}

	// 设置菜单组
	function setGroup(list: Item[]) {
		group.value = orderBy(list, "orderNum").filter((e) => e.isShow);
		storage.set("menu.group", group.value);
	}

	// 获取菜单，权限信息
	function get(): Promise<Item[]> {
		return new Promise((resolve, reject) => {
			function next(res: any) {
				if (!isArray(res.menus)) {
					res.menus = [];
				}

				if (!isArray(res.perms)) {
					res.perms = [];
				}

				const list = res.menus
					.filter((e: Item) => e.type != 2)
					.map((e: Item) => {
						return {
							id: e.id,
							parentId: e.parentId,
							path: revisePath(e.router || String(e.id)),
							viewPath: e.viewPath,
							type: e.type,
							name: e.name,
							icon: e.icon,
							orderNum: e.orderNum,
							isShow: e.isShow === undefined ? true : e.isShow,
							meta: {
								label: e.name,
								keepAlive: e.keepAlive
							},
							children: []
						};
					});

				// 设置权限
				setPerms(res.perms);

				// 设置菜单组
				setGroup(deepTree(list));

				// 设置视图路由
				setRoutes(list.filter((e: Item) => e.type == 1));

				// 设置菜单
				setMenu(index.value);

				resolve(group.value);
			}

			if (isEmpty(config.app.menu.list)) {
				service.base.comm
					.permmenu()
					.then(next)
					.catch((err) => {
						ElMessage.error("菜单加载异常！");
						reject(err);
					});
			} else {
				// 自定义菜单
				next({
					menus: revDeepTree(config.app.menu.list)
				});
			}
		});
	}

	// 获取菜单路径
	function getPath(list?: Item[]) {
		list = list || group.value;

		let path = "";

		function deep(arr: Item[]) {
			arr.forEach((e: Item) => {
				if (e.type == 1) {
					if (!path) {
						path = e.path;
					}
				} else {
					deep(e.children || []);
				}
			});
		}

		deep(list);

		return path || "/";
	}

	return {
		routes,
		group,
		index,
		list,
		perms,
		get,
		setPerms,
		setMenu,
		setRoutes,
		setGroup,
		getPath
	};
});
