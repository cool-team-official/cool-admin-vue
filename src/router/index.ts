import {
	createRouter,
	createWebHashHistory,
	createWebHistory,
	Router,
	RouteRecordRaw
} from "vue-router";
import { routerMode } from "/@/config/env";

declare interface CoolRouter extends Router {
	$plugin?: {
		addViews(list: any[], options?: any): void;
	};
}

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "index",
		component: () => import(`/@/pages/layout/index.vue`),
		children: [
			{
				path: "/",
				name: "数据统计",
				component: () => import("/@/views/home/index.vue")
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
	history: routerMode == "history" ? createWebHistory() : createWebHashHistory(),
	routes
}) as CoolRouter;

export default router;

export const ignore: any = {
	token: ["/login", "/403", "/404", "/500", "/502"]
};
