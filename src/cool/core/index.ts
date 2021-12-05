import router from "/@/router";
import store from "/@/store";
import { service } from "./service";
import { useRouter } from "./router";
import { useModule } from "./module";

async function bootstrap(app: any) {
	app.config.globalProperties.service = store.service = service;
	app.provide("service", service);

	useRouter();
	useModule(app);

	router.$plugin?.addViews(store.getters.routes || []);
}

function usePermission(list: any[]) {
	function deep(d: any) {
		if (d.permission) {
			d._permission = {};
			for (const i in d.permission) {
				d._permission[i] =
					list.findIndex((e: string) =>
						e.replace(/:/g, "/").includes(`${d.namespace}/${i}`)
					) >= 0;
			}
		} else {
			for (const i in d) {
				deep(d[i]);
			}
		}
	}

	deep(service);
}

export { service, bootstrap, usePermission };
export { BaseService, Service, Permission, useEps } from "./service";
export * from "./hook";
