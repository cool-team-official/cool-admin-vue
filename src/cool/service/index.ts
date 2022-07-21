import { deepMerge, basename } from "../utils";
import { BaseService } from "./base";
import { useEps } from "./eps";
import { module } from "../module";

// 路径转对象
function deepFiles(list: any[]) {
	const data: any = {};

	list.forEach(({ path, value }) => {
		const arr: string[] = path.split("/");
		const parents = arr.slice(0, arr.length - 1);
		const name = basename(path).replace(".ts", "");

		let curr = data;

		parents.forEach((k) => {
			if (!curr[k]) {
				curr[k] = {};
			}

			curr = curr[k];
		});

		curr[name] = value;
	});

	return data;
}

// 基础服务
export const service: Eps.Service = {
	request: new BaseService().request
};

export function useService() {
	// 接口内容
	useEps(service);

	// 模块内容
	module.list.forEach((e) => {
		deepMerge(service, deepFiles(e.services || []));
	});

	return service;
}

export * from "./base";
export * from "./request";
