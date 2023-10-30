import { hmr } from "../hook";
import { BaseService } from "./base";

// service 数据集合
export const service: Eps.Service = hmr.getData("service", {
	request: new BaseService().request
});

export * from "./base";
