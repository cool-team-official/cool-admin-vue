import { BaseService } from "./base";

// @ts-ignore
export const service: Eps.Service = {
	request: new BaseService().request
};

export * from "./base";
