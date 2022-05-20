import { deepFiles, deepMerge, module } from "../utils";
import { BaseService } from "./base";
import { useEps } from "./eps";

// 基础服务
export const service: Service = {
	request: new BaseService().request
};

export function useService() {
	// 接口内容
	useEps(service);

	// 模块内容
	module.list.forEach((e) => {
		deepMerge(service, deepFiles(e.service || []));
	});

	return service;
}

export * from "./base";
export * from "./request";
