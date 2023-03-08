import { BaseService } from "./base";
import { hmr } from "../hook";

export const service: Eps.Service = hmr.getData("service", {
	request: new BaseService().request
});

export * from "./base";
