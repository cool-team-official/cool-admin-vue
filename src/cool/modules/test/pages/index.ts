// 导出的列表会自动注册到路由中

export default [
	{
		path: "/test-pages/about", // 路由地址
		component: () => import("./about.vue") // 组件实例
	}
];
