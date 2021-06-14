import BaseService from "./service/base";
import { Service, Permission, useService } from "./service";
import { useRefs } from "./hook/core";
import { useRouter } from "./router";
import { useModule } from "./module";
import router from "/@/router";
import store from "/@/store";

const services = useService();

async function bootstrap(app: any) {
	app.config.globalProperties.service = store.service = services;
	app.provide("service", services);

	useRouter();
	useModule(app);

	router.$plugin?.addViews(store.getters.routes || []);
}

export { Service, Permission, BaseService, services, bootstrap, useRefs };
