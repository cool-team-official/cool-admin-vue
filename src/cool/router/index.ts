// @ts-nocheck
import { ElMessage } from "element-plus";
import {
	createRouter,
	createWebHashHistory,
	createWebHistory,
	NavigationGuardNext,
	RouteRecordRaw
} from "vue-router";
import { storage, config } from "/@/cool";
import { useBase } from "/$/base";
import { cloneDeep, isArray } from "lodash";

// 视图文件
const views = import.meta.globEager("/src/**/views/**/*.vue");

for (const i in views) {
	views[i.slice(5)] = views[i];
	delete views[i];
}

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
			...config.app.router.views
		]
	},
	...config.app.router.pages,
	{
		path: "/:catchAll(.*)",
		name: "404",
		redirect: "/404"
	}
];

// 创建
const router = createRouter({
	history: config.app.router.mode == "history" ? createWebHistory() : createWebHashHistory(),
	routes
}) as CoolRouter;

// 路由守卫
router.beforeEach((to: any, _: any, next: NavigationGuardNext) => {
	const { user, process } = useBase();

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
		if (!config.ignore.token.find((e: string) => to.path == e)) {
			return next("/login");
		}
	}

	next();
});

// 自定义
router.href = function (path: string) {
	const url = import.meta.env.BASE_URL + path;

	if (url != location.pathname) {
		location.href = url;
	}
};

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

// 视图
const viewer = {
	add(data: any[] | any) {
		// 列表
		const list = isArray(data) ? data : [data];

		list.forEach((e: any) => {
			const d: any = cloneDeep(e);

			// 命名
			d.name = d.router;

			if (!d.component) {
				const url = d.viewPath;

				if (url) {
					if (
						/^(http[s]?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i.test(
							url
						)
					) {
						d.meta.iframeUrl = url;
						d.component = () => import(`/$/base/pages/iframe/index.vue`);
					} else {
						d.component = () => Promise.resolve(views[url.replace("cool/", "")]);
					}
				} else {
					d.redirect = "/404";
				}
			}

			// 批量添加
			router.addRoute("index", d);
		});
	},

	get() {
		return router.getRoutes().find((e) => e.name == "index")?.children;
	}
};

export { router, viewer };
