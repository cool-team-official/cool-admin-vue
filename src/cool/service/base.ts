// @ts-nocheck
import { isDev, config, proxy } from "../../config";
import { isObject } from "lodash-es";
import { request } from "./request";
import { AxiosRequestConfig } from "axios";

export function Service(
	value:
		| string
		| {
				proxy?: string;
				namespace?: string;
				url?: string;
		  }
) {
	return function (target: any) {
		// 命名
		if (typeof value == "string") {
			target.prototype.namespace = value;
		}

		// 复杂项
		if (isObject(value)) {
			const { namespace, proxy: proxyName, url } = value;

			target.prototype.namespace = namespace;

			if (proxyName) {
				target.prototype.url = proxy[proxyName]?.target || url;
			} else {
				target.prototype.url = url;
			}
		}
	};
}

export class BaseService {
	constructor(namespace?: string) {
		if (namespace) {
			this.namespace = namespace;
		}
	}

	async request(options: AxiosRequestConfig = {}) {
		if (options.url) {
			// 过滤 http 开头的地址
			if (options.url.indexOf("http") < 0) {
				let ns = "";

				if (isDev) {
					ns = this.proxy || config.baseUrl;
				} else {
					ns = this.proxy ? this.url : config.baseUrl;
				}

				// 拼接前缀
				if (this.namespace) {
					ns += "/" + this.namespace;
				}

				// 处理地址
				if (options.proxy === undefined || options.proxy) {
					options.url = ns + options.url;
				}
			}
		}

		return request(options);
	}

	async list(data: any) {
		return this.request({
			url: "/list",
			method: "POST",
			data
		});
	}

	async page(data: any) {
		return this.request({
			url: "/page",
			method: "POST",
			data
		});
	}

	async info(params: any) {
		return this.request({
			url: "/info",
			params
		});
	}

	async update(data: any) {
		return this.request({
			url: "/update",
			method: "POST",
			data
		});
	}

	async delete(data: any) {
		return this.request({
			url: "/delete",
			method: "POST",
			data
		});
	}

	async add(data: any) {
		return this.request({
			url: "/add",
			method: "POST",
			data
		});
	}
}
