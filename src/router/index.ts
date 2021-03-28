import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

// 忽略规则
const ignore: any = {
	token: ["/login", "/403", "/404", "/500", "/502"]
};

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "index",
		component: () => import(`@/pages/layout/index.vue`),
		children: [
			{
				path: "/",
				name: "数据统计",
				component: () => import("@/views/home/index.vue")
			}
		]
	},
	{
		path: "/:catchAll(.*)",
		name: "404",
		redirect: "/404"
	}
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

export default router;
export { ignore };
