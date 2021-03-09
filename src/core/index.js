import { BaseService, Service, Permission } from "./service";
import { SET_SERVICE, SET_ROUTER, SET_MODULE } from "./set";
import "./common";

async function bootstrap(options = {}) {
	const { modules } = options;

	SET_ROUTER();
	SET_SERVICE();
	SET_MODULE({ events: modules });
}
export { Service, Permission, BaseService, bootstrap };
