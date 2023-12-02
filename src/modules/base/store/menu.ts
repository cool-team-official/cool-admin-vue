import { defineStore } from "pinia";
import { ref } from "vue";
import { deepTree, revDeepTree, storage } from "/@/cool/utils";
import { cloneDeep, isArray, isEmpty, orderBy } from "lodash-es";
import { router, service } from "/@/cool";
import { revisePath } from "../utils";
import { Menu } from "../types";
import { config } from "/@/config";

// 本地缓存
const data = storage.info();

export const useMenuStore = defineStore("menu", function () {
	// 视图路由
	const routes = ref<Menu.List>([]);

	// 菜单组
	const group = ref<Menu.List>(data["base.menuGroup"] || []);

	// 左侧菜单列表
	const list = ref<Menu.List>([]);

	// 权限列表
	const perms = ref<any[]>(data["base.menuPerms"] || []);

	// 设置左侧菜单
	function setMenu(i: number = 0) {
		// 显示分组显示菜单
		if (config.app.menu.isGroup) {
			list.value = group.value.filter((e) => e.isShow)[i]?.children || [];
		} else {
			list.value = group.value;
		}
	}

	// 设置权限
	function setPerms(list: Menu.List) {
		function deep(d: any) {
			if (typeof d == "object") {
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
		storage.set("base.menuPerms", list);

		deep(service);
	}

	// 设置视图
	function setRoutes(list: Menu.List) {
		// 获取第一个菜单路径
		const fp = getPath(group.value);

		// 查找符合路由
		const route = list.find((e) => (e.meta!.isHome = e.path == fp));

		if (route) {
			const home = router.getRoutes().find((e) => e.meta.isHome);

			// 判断是否存在
			if (!home) {
				router.append([
					{
						...route,
						path: "/",
						name: "home"
					}
				]);
			} else {
				Object.assign(home.meta, route.meta);
			}
		}

		routes.value = list.filter((e) => e.type == 1);
	}

	// 设置菜单组
	function setGroup(list: Menu.List) {
		group.value = orderBy(deepTree(list), "orderNum");
		storage.set("base.menuGroup", group.value);
	}

	// 获取菜单，权限信息
	async function get() {
		function next(res: { menus: Menu.List; perms?: any[] }) {
			const list = res.menus
				?.filter((e) => e.type != 2)
				.map((e) => {
					const path = revisePath(e.router || String(e.id));
					const isShow = e.isShow === undefined ? true : e.isShow;

					return {
						...e,
						path,
						isShow,
						meta: {
							...e.meta,
							label: e.name, // 菜单名称的唯一标识
							keepAlive: e.keepAlive || 0
						},
						name: `${e.name}-${e.id}`, // 避免重复命名之前的冲突
						children: []
					};
				});

			// 设置权限
			setPerms(res.perms || []);

			// 设置菜单组
			setGroup(list);

			// 设置视图路由
			setRoutes(list);

			// 设置菜单
			setMenu();

			return list;
		}

		// 自定义菜单
		if (!isEmpty(config.app.menu.list)) {
			next({
				menus: revDeepTree(config.app.menu.list || [])
			});
		} else {
			// 动态菜单
			await service.base.comm.permmenu().then(next);
		}
	}

	// 获取菜单路径
	function getPath(data: Menu.Item | Menu.List) {
		const list = isArray(data) ? data : [data];

		let path = "";

		function deep(arr: Menu.List) {
			arr.forEach((e: Menu.Item) => {
				switch (e.type) {
					case 0:
						deep(e.children || []);
						break;
					case 1:
						if (!path) {
							path = e.path;
						}
						break;
				}
			});
		}

		deep(list);

		return path;
	}

	return {
		routes,
		group,
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
