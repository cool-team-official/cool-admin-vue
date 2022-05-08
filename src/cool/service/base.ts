// @ts-nocheck
import { baseUrl, isDev, test } from "../config";
import { isObject } from "../utils";
import request from "./request";

export function Service(
	value:
		| string
		| {
				namespace?: string;
				url?: string;
				mock?: boolean;
		  }
) {
	return function (target: any) {
		// 命名
		if (typeof value == "string") {
			target.prototype.namespace = value;
		}

		// 复杂项
		if (isObject(value)) {
			target.prototype.namespace = value.namespace;
			target.prototype.mock = value.mock;

			if (value.url) {
				target.prototype.url = value.url;
			}
		}
	};
}

export class BaseService {
	constructor(
		options = {} as {
			namespace?: string;
		}
	) {
		if (options?.namespace) {
			this.namespace = options.namespace;
		}
	}

	request(
		options = {} as {
			params?: any;
			data?: any;
			url: string;
			method?: "GET" | "get" | "POST" | "post" | string;
			[key: string]: any;
		}
	) {
		if (!options.params) options.params = {};

		let ns = "";

		// 是否 mock 模式
		if (this.mock || test.mock) {
			// 测试
		} else {
			if (isDev) {
				ns = this.proxy || baseUrl;
			} else {
				ns = this.proxy ? this.url : baseUrl;
			}
		}

		// 拼接前缀
		if (this.namespace) {
			ns += "/" + this.namespace;
		}

		// 处理地址
		if (options.proxy === undefined || options.proxy) {
			options.url = ns + options.url;
		}

		return request(options);
	}

	list(data: any) {
		return this.request({
			url: "/list",
			method: "POST",
			data
		});
	}

	page(data: { page?: number; size?: number; [key: string]: any }) {
		return this.request({
			url: "/page",
			method: "POST",
			data
		});
	}

	info(params: { id?: number | string; [key: string]: any }) {
		return this.request({
			url: "/info",
			params
		});
	}

	update(data: { id?: number | string; [key: string]: any }) {
		return this.request({
			url: "/update",
			method: "POST",
			data
		});
	}

	delete(data: { ids?: number[] | string[]; [key: string]: any }) {
		return this.request({
			url: "/delete",
			method: "POST",
			data
		});
	}

	add(data: any) {
		return this.request({
			url: "/add",
			method: "POST",
			data
		});
	}
}
