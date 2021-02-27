export default [
	{
		moduleName: "sys.log",
		label: "请求日志",
		path: "/sys/log",
		component: () => import("./log")
	}
];
