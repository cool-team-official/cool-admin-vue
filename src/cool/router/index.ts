import { ElMessage } from "element-plus";
import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from "vue-router";
import { config, Router, storage, module } from "/@/cool";
import { isArray } from "lodash-es";
import { useBase } from "/$/base";
import { Loading } from "../utils";

// 扫描文件
const files = import.meta.glob(["/src/modules/*/{views,pages}/**/*", "!**/components"]);

// 默认路由
const routes: RouteRecordRaw[] = [
	{
		path: "/",
		name: "index",
		component: () => import("/$/base/layout/index.vue"),
		children: [
			{
				path: "",
				name: "home",
				component: config.app.router.home
			}
		]
	},
	{
		path: "/:pathMatch(.*)*",
		component: () => import("/$/base/pages/error/404.vue")
	}
];

// 创建路由器
const router = createRouter({
	history: config.app.router.mode == "history" ? createWebHistory() : createWebHashHistory(),
	routes
}) as Router;

// 组件加载后
router.beforeResolve(() => {
	Loading.close();
});

// 添加试图，页面路由
router.append = function (data) {
	const list = isArray(data) ? data : [data];

	list.forEach((d) => {
		if (!d.name) {
			d.name = d.path.substring(1);
		}

		if (!d.meta) {
			d.meta = {};
		}

		if (!d.component) {
			const url = d.viewPath;

			if (url) {
				if (url.indexOf("http") == 0) {
					if (d.meta) {
						d.meta.iframeUrl = url;
					}

					d.component = () => import(`/$/base/views/frame.vue`);
				} else {
					d.component = files["/src/" + url.replace("cool/", "")];
				}
			} else {
				d.redirect = "/404";
			}
		}

		d.meta.dynamic = true;

		if (d.isPage) {
			router.addRoute(d);
		} else {
			router.addRoute("index", d);
		}
	});
};

// 清空路由
router.clear = function () {
	const rs = router.getRoutes();

	rs.forEach((e) => {
		if (e.name && e.meta?.dynamic) {
			router.removeRoute(e.name);
		}
	});
};

// 找路由
router.find = function (path: string) {
	return router.getRoutes().find((e) => e.path == path);
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

// 注册
async function register(path: string) {
	// 当前路由是否存在
	const f = Boolean(router.find(path));

	if (!f) {
		const { menu } = useBase();

		// 等待加载
		await Loading.wait();

		// 待注册列表
		const list: any[] = [];

		// 菜单数据
		menu.routes.find((e) => {
			list.push({
				...e,
				isPage: e.viewPath?.includes("/pages")
			});
		});

		// 模块数据
		module.list.forEach((e) => {
			if (e.views) {
				list.push(...e.views);
			}

			if (e.pages) {
				list.push(
					...e.pages.map((d) => {
						return {
							...d,
							isPage: true
						};
					})
				);
			}
		});

		// 需要注册的路由
		const r = list.find((e) => e.path == path);

		if (r) {
			router.append(r);
		}
	}

	return { route: router.find(path), isReg: !f };
}

// 路由守卫
router.beforeEach(async (to, from, next) => {
	// 数据缓存
	const { user, process } = useBase();

	// 预先注册路由
	const { isReg, route } = await register(to.path);

	// 组件不存在、路由不存在
	if (!route?.components) {
		next(user.token ? "/404" : "/login");
	} else {
		// 注册后重定向
		if (isReg) {
			next({ ...to, path: route.path });
		} else {
			// 登录成功
			if (user.token) {
				// 在登录页
				if (to.path.includes("/login")) {
					// Token 未过期
					if (!storage.isExpired("token")) {
						// 回到首页
						return next("/");
					}
				} else {
					// 添加路由进程
					process.add(to);
				}
			} else {
				// 忽略部分 Token 验证
				if (!config.ignore.token.find((e) => to.path == e)) {
					return next("/login");
				}
			}

			next();
		}
	}
});

export { router };
