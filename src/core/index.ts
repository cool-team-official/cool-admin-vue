import { BaseService, Service, Permission } from "./service";
import { SET_SERVICE, SET_ROUTER, SET_MODULE } from "./set";
import { useRefs } from "./hook/core";
import router from "@/router";
import store from "@/store";
import "./common";

async function bootstrap(app: any) {
	SET_ROUTER();
	SET_SERVICE(app);
	SET_MODULE(app);

	router.$plugin.addViews(store.getters.routes);
}
export { Service, Permission, BaseService, bootstrap, useRefs };
