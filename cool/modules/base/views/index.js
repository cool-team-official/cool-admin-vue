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
		moduleName: "sys.task",
		label: "任务列表",
		path: "/sys/task",
		component: () => import("./task")
	},
	{
		moduleName: "sys.perf",
		label: "状态监控",
		path: "/sys/perf",
		component: () => import("./perf")
	},
	{
		moduleName: "sys.param",
		label: "参数列表",
		path: "/sys/param",
		component: () => import("./param")
	},
	{
		moduleName: "sys.log",
		label: "请求日志",
		path: "/sys/log",
		component: () => import("./log")
	},
	{
		moduleName: "plugin",
		label: "插件列表",
		path: "/plugin",
		icon: "icon-menu",
		component: () => import("./plugin")
	}
];
