import { cloneDeep, isArray } from "lodash";
import { router } from "./base";

const views = import.meta.globEager("/src/**/views/**/*.vue");

for (const i in views) {
	views[i.slice(5)] = views[i];
	delete views[i];
}

export function addViews(data: any[] | any) {
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
}

export function getViews() {
	return router.getRoutes().find((e) => e.name == "index")?.children;
}
