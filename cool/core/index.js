import { BaseService, Service, Permission } from "./service";
import { SET_SERVICE, SET_ROUTER, SET_COMPONENT } from "./set";
import "./common";

async function bootstrap(options = {}) {
	const { components } = options;

	SET_ROUTER();
	SET_SERVICE();
	SET_COMPONENT({ events: components });
}
export { Service, Permission, BaseService, bootstrap };
