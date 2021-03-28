export default [
	{
		path: "/403",
		component: () => import("./error-page/403.vue")
	},
	{
		path: "/404",
		component: () => import("./error-page/404.vue")
	},
	{
		path: "/500",
		component: () => import("./error-page/500.vue")
	},
	{
		path: "/502",
		component: () => import("./error-page/502.vue")
	},
	{
		path: "/login",
		component: () => import("./login/index.vue")
	}
];
