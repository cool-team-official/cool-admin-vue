import BaseService from "./service/base";
import { Service, Permission, useService } from "./service";
import { useRouter } from "./router";
import { useModule } from "./module";
import router from "/@/router";
import store from "/@/store";

const service = useService();

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

export { Service, Permission, BaseService, service, bootstrap, usePermission };
export * from "./hook";
