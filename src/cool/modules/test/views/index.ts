// 导出的列表会自动注册到 "/" 子路由中

export default [
	{
		path: "/test-views/about", // 路由地址
		component: () => import("./about.vue"), // 组件实例
		meta: {
			keepAlive: true, // 是否缓存路由
			label: "关于 cool-admin" // 路由名称
		}
	}
];
