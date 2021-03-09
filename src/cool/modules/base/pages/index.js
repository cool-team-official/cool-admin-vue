export default [
	{
		path: "/403",
		component: () => import("./error-page/403")
	},
	{
		path: "/404",
		component: () => import("./error-page/404")
	},
	{
		path: "/500",
		component: () => import("./error-page/500")
	},
	{
		path: "/502",
		component: () => import("./error-page/502")
	},
	{
		path: "/login",
		component: () => import("./login")
	}
];
