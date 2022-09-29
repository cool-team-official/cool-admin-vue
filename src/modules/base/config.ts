import { ModuleConfig, config } from "/@/cool";
import { useStore } from "./store";
import { App } from "vue";
import Admin from "@cool-vue/admin";
import "@cool-vue/admin/dist/index.css";
import "./static/css/index.scss";

export default (): ModuleConfig => {
	return {
		order: 99,
		views: [
			{
				path: "/my/info",
				meta: {
					label: "个人中心"
				},
				component: () => import("./views/info.vue")
			}
		],
		pages: [
			{
				path: "/login",
				component: () => import("./pages/login/index.vue")
			},
			{
				path: "/401",
				meta: {
					process: false
				},
				component: () => import("./pages/error-page/401.vue")
			},
			{
				path: "/403",
				meta: {
					process: false
				},
				component: () => import("./pages/error-page/403.vue")
			},
			{
				path: "/404",
				meta: {
					process: false
				},
				component: () => import("./pages/error-page/404.vue")
			},
			{
				path: "/500",
				meta: {
					process: false
				},
				component: () => import("./pages/error-page/500.vue")
			},
			{
				path: "/502",
				meta: {
					process: false
				},
				component: () => import("./pages/error-page/502.vue")
			}
		],
		install(app: App) {
			// 基础库
			app.use(Admin);

			// 设置标题
			document.title = config.app.name;
		},
		async onLoad() {
			const { user, menu, app } = useStore();

			// token 事件
			async function hasToken(cb: () => Promise<any> | void) {
				if (cb) {
					app.addEvent("hasToken", cb);

					if (user.token) {
						await cb();
					}
				}
			}

			await hasToken(async () => {
				// 获取用户信息
				user.get();
				// 获取菜单权限
				await menu.get();
			});

			return {
				hasToken
			};
		}
	};
};
