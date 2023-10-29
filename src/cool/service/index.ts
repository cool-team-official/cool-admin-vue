import { BaseService } from "./base";

// service 数据集合
export const service: Eps.Service = {
	// @ts-ignore
	request: new BaseService().request
};

export * from "./base";
