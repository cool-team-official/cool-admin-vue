import { ElMessage } from 'element-plus';
import {
	createRouter,
	createRouterMatcher,
	createWebHashHistory,
	createWebHistory,
	type RouteRecordRaw
} from 'vue-router';
import { type Router, storage, module } from '/@/cool';
import { isArray } from 'lodash-es';
import { useBase } from '/$/base';
import { Loading } from '../utils';
import { config } from '/@/config';

// 基本路径
const baseUrl = import.meta.env.BASE_URL;

// 扫描文件
const files = import.meta.glob(['/src/modules/*/{views,pages}/**/*', '!**/components']);

// 默认路由
const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'index',
		component: () => import('/$/base/pages/main/index.vue'),
		children: []
	},
	{
		path: '/:catchAll(.*)',
		name: '404',
		component: () => import('/$/base/pages/error/404.vue')
	}
];

// 创建路由器
const router = createRouter({
	history:
		config.app.router.mode == 'history'
			? createWebHistory(baseUrl)
			: createWebHashHistory(baseUrl),
	routes
}) as Router;

// 组件加载后
router.beforeResolve(() => {
	Loading.close();
});

let lock = false;

// 错误监听
router.onError((err: Error) => {
	if (!lock) {
		lock = true;

		ElMessage.error(`页面存在错误：${err.message}`);
		console.error(err);

		// 动态加载组件错误，刷新页面
		if (err.message?.includes('Failed to fetch dynamically imported module')) {
			window.location.reload();
		}

		setTimeout(() => {
			lock = false;
		}, 0);
	}
});

// 添加试图，页面路由
router.append = function (data) {
	if (!data) {
		return false;
	}

	const list = isArray(data) ? data : [data];

	list.forEach(d => {
		if (!d.meta) {
			d.meta = {};
		}

		// 组件路径
		if (!d.component) {
			const url = d.viewPath;

			if (url) {
				if (url.indexOf('http') == 0) {
					if (d.meta) {
						d.meta.iframeUrl = url;
					}

					d.component = () => import('/$/base/views/frame.vue');
				} else {
					d.component = files['/src/' + url.replace('cool/', '')];
				}
			} else {
				if (!d.redirect) {
					d.redirect = '/404';
				}
			}
		}

		// 支持 props 接收参数
		d.props = true;

		// 是否动态添加
		d.meta.dynamic = true;

		// 判断是页面/视图
		if (d.isPage || d.viewPath?.includes('/pages/')) {
			router.addRoute(d);
		} else {
			router.addRoute('index', d);
		}
	});
};

// 删除路由
router.del = function (name) {
	const rs = router.getRoutes();

	rs.forEach(e => {
		if (e.name == name) {
			router.removeRoute(name);
		}
	});
};

// 清空路由
router.clear = function () {
	const rs = router.getRoutes();

	rs.forEach(e => {
		if (e.name && e.meta?.dynamic) {
			router.removeRoute(e.name);
		}
	});
};

// 找路由
router.find = function (path: string) {
	const { menu } = useBase();

	// 已注册路由
	const routes = router.getRoutes();

	// 路由列表
	const list: any[] = [
		...routes.map(e => {
			return {
				...e,
				isReg: true
			};
		}),
		// 菜单配置
		...menu.routes,
		// 模块中自定义
		...module.list.map(e => (e.views || [])?.concat(e.pages || [])).flat(1)
	];

	let isReg = false;
	let route: (typeof list)[number] | undefined;

	// 匹配器
	const matcher = createRouterMatcher(list, {});

	// 获取路由
	matcher.getRoutes().find(e => {
		const r = new RegExp(e.re);

		if (r.test(path)) {
			if (path == '/') {
				route = list.find(e => e.meta?.isHome);
			} else {
				route = list.find(a => a.path == e.record.path && a.name != 'index');
			}

			if (route) {
				isReg = !!route.isReg;
			}

			return true;
		} else {
			return false;
		}
	});

	return {
		route,
		isReg
	};
};

// 路由守卫
router.beforeEach(async (to, from, next) => {
	// 等待应用配置加载完
	await Loading.wait();

	// 数据缓存
	const { user, process } = useBase();

	// 查找路由信息
	const { isReg, route } = router.find(to.path);

	// 路由不存在
	if (!route) {
		next(user.token ? '/404' : '/login');
		return;
	}

	// 路由未注册
	if (!isReg) {
		// 注册路由
		router.append(route);

		// 重定向原路径
		next(to.fullPath);
		return;
	}

	// 登录成功
	if (user.token) {
		// 在登录页
		if (to.path.includes('/login')) {
			// Token 未过期
			if (!storage.isExpired('token')) {
				// 回到首页
				next('/');
				return;
			}
		} else {
			// 添加路由进程
			process.add(to);
		}
	} else {
		// 忽略部分 Token 验证
		if (!config.ignore.token.find(e => to.path == e)) {
			next('/login');
			return;
		}
	}

	next();
});

export { router };
