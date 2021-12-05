// @ts-nocheck
import request from "/@/service/request";
import { baseUrl, isDev } from "/@/config/env";

export default class BaseService {
	constructor(options: any = {}) {
		const crud: any = {
			page: "page",
			list: "list",
			info: "info",
			add: "add",
			delete: "delete",
			update: "update"
		};

		if (options?.namespace) {
			this.namespace = options?.namespace;
		}

		if (!this.permission) this.permission = {};

		for (const i in crud) {
			if (this.namespace) {
				this.permission[i] = this.namespace.replace(/\//g, ":") + ":" + crud[i];
			} else {
				this.permission[i] = crud[i];
			}
		}
	}

	request(options: any = {}) {
		if (!options.params) options.params = {};

		let ns = "";

		// 是否 mock 模式
		if (!this.mock) {
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

		// 处理 http
		if (options.url.indexOf("http") !== 0) {
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

	page(data: any) {
		return this.request({
			url: "/page",
			method: "POST",
			data
		});
	}

	info(params: any) {
		return this.request({
			url: "/info",
			params
		});
	}

	update(data: any) {
		return this.request({
			url: "/update",
			method: "POST",
			data
		});
	}

	delete(data: any) {
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
