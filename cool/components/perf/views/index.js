export default [
	{
		moduleName: "sys.perf",
		label: "状态监控",
		path: "/sys/perf",
		component: () => import("./perf")
	}
];
