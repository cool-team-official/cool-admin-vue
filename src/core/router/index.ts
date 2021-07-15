import { ElMessage } from "element-plus";
import store from "/@/store";
import router, { ignore } from "/@/router";
import storage from "../utils/storage";
import { cloneDeep } from "../utils";

const views = import.meta.globEager("/src/**/views/**/*.vue");

for (const i in views) {
	views[i.slice(5)] = views[i];
	delete views[i];
}

function useRouter() {
	router.$plugin = {
		addViews: (list: Array<any>, options: any) => {
			if (!options) {
				options = {};
			}

			// Parse route config
			list.forEach((e: any) => {
				const d: any = cloneDeep(e);

				// avoid router repeat
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
							d.component = () => Promise.resolve(views[url]);
						}
					} else {
						d.redirect = "/404";
					}
				}

				// Batch add route
				router.addRoute("index", d);
			});
		}
	};

	router.beforeEach((to: any, from: any, next: any) => {
		const { token, browser } = store.getters;

		if (token) {
			if (to.path.indexOf("/login") === 0) {
				// 登录成功且 token 未过期，回到首页
				if (!storage.isExpired("token")) {
					return next("/");
				}
			} else {
				// 添加路由进程
				store.commit("ADD_PROCESS", {
					keepAlive: to.meta?.keepAlive,
					label: to.meta?.label || to.name,
					value: to.fullPath
				});
			}
		} else {
			if (!ignore.token.some((e: string) => to.path.indexOf(e) === 0)) {
				return next("/login");
			}
		}

		// H5 下关闭左侧菜单
		if (browser && browser.isMini) {
			store.commit("COLLAPSE_MENU", true);
		}

		next();
	});

	let lock = false;

	router.onError((err: any) => {
		if (!lock) {
			lock = true;

			ElMessage.error(`页面不存在或者未配置`);
			console.error(err);

			setTimeout(() => {
				lock = false;
			}, 0);
		}
	});
}

export { useRouter };
