export default [
	{
		path: "/my/info",
		component: () => import("./info"),
		meta: {
			label: "个人中心",
			keepAlive: true
		}
	}
];
