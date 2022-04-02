import { deepFiles, deepMerge } from "../utils";
import { BaseService } from "./base";
import { useEps } from "./eps";

// 服务
export const service: Service = {
	request: new BaseService().request
};

export function useService() {
	useEps(service);

	if (window.__modules__) {
		window.__modules__.forEach((e: any) => {
			deepMerge(service, deepFiles(e.service || []));
		});
	}

	return service;
}

export * from "./base";
export * from "./request";
