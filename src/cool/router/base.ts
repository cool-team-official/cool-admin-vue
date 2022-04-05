import { ElMessage } from "element-plus";
import {
	createRouter,
	createWebHashHistory,
	createWebHistory,
	NavigationGuardNext,
	RouteRecordRaw
} from "vue-router";
import { storage } from "/@/cool";
import { useBaseStore } from "/$/base";
import { app, ignore } from "/@/cool/config";

const { views, pages, mode } = app.router;

// 默认路由
const routes: RouteRecordRaw[] = [
	{
		path: "/",
		name: "index",
		component: () => import("/$/base/pages/layout/index.vue"),
		children: [
			{
				path: "/",
				name: "数据统计",
				component: () => import("/@/views/home/index.vue")
			},
			...views
		]
	},
	...pages,
	{
		path: "/:catchAll(.*)",
		name: "404",
		redirect: "/404"
	}
];

// 创建
const router = createRouter({
	history: mode == "history" ? createWebHistory() : createWebHashHistory(),
	routes
});

// 路由守卫
router.beforeEach((to: any, _: any, next: NavigationGuardNext) => {
	const { user, process } = useBaseStore();

	if (user.token) {
		if (to.path.includes("/login")) {
			// 登录成功且 token 未过期，回到首页
			if (!storage.isExpired("token")) {
				return next("/");
			}
		} else {
			// 添加路由进程
			process.add({
				keepAlive: to.meta?.keepAlive,
				label: to.meta?.label || to.name,
				value: to.fullPath
			});
		}
	} else {
		if (!ignore.token.find((e: string) => to.path == e)) {
			return next("/login");
		}
	}

	next();
});

let lock = false;

// 错误监听
router.onError((err: any) => {
	if (!lock) {
		lock = true;

		ElMessage.error("页面不存在或者未配置！");
		console.error(err);

		setTimeout(() => {
			lock = false;
		}, 0);
	}
});

export { router };
export * from "./views";
