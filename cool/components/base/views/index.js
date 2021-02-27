export default [
	{
		label: "个人中心",
		path: "/my/info",
		component: () => import("./info")
	},
	{
		moduleName: "sys-user",
		label: "用户列表",
		path: "/sys/user",
		icon: "icon-user",
		component: () => import("./user")
	},
	{
		moduleName: "sys-menu",
		label: "菜单列表",
		path: "/sys/menu",
		icon: "icon-menu",
		component: () => import("./menu")
	},
	{
		moduleName: "sys-role",
		label: "角色列表",
		path: "/sys/role",
		icon: "icon-common",
		component: () => import("./role")
	},
	{
		moduleName: "plugin",
		label: "插件列表",
		path: "/plugin",
		icon: "icon-menu",
		component: () => import("./plugin")
	}
];
