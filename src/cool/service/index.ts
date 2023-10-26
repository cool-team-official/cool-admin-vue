import { BaseService } from "./base";
import { hmr } from "../hook";
import { eps } from "virtual:eps";
import { merge } from "lodash-es";

// service 数据集合
export const service: Eps.Service = hmr.getData("service", {
	request: new BaseService().request
});

// 同步 service 数据
function update() {
	function deep(d: any) {
		if (d.namespace) {
			const a = new BaseService(d.namespace);

			for (const i in d) {
				const { path, method = "get" } = d[i];

				if (path) {
					a.request = a.request;

					a[i] = function (data?: any) {
						return this.request({
							url: path,
							method,
							[method.toLocaleLowerCase() == "post" ? "data" : "params"]: data
						});
					};
				}
			}

			for (const i in a) {
				d[i] = a[i];
			}
		} else {
			for (const i in d) {
				deep(d[i]);
			}
		}
	}

	// 遍历
	deep(eps.service);

	// 合并
	merge(service, eps.service);

	// 缓存
	hmr.setData("service", service);

	// tips
	console.log("[eps] update");
}

update();

if (import.meta.hot) {
	import.meta.hot.on("eps-update", () => {
		update();
	});
}

export * from "./base";
