import Vue from "vue";
import VueRouter from "vue-router";
import { routerMode } from "@/config/env";

Vue.use(VueRouter);

// 忽略规则
const ignore = {
	token: ["/login", "/403", "/404", "/500", "/502"]
};

// 路由列表
const routes = [
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
	}
];

const Router = new VueRouter({
	mode: routerMode || "history",
	base: process.env.BASE_URL,
	routes,
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		} else {
			return { x: 0, y: 0 };
		}
	}
});

export { ignore, routes };
export default Router;
