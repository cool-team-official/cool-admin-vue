import request from "@/service/request";
import { baseUrl } from "@/config/env";

export default class BaseService {
	constructor() {
		const crud = {
			page: "page",
			list: "list",
			info: "info",
			add: "add",
			delete: "delete",
			update: "update"
		};

		if (!this.permission) {
			this.permission = {};
		}

		for (let i in crud) {
			if (this.namespace) {
				this.permission[i] = this.namespace.replace(/\//g, ":") + ":" + crud[i];
			} else {
				this.permission[i] = crud[i];
			}
		}
	}

	request(options = {}) {
		if (!options.params) {
			options.params = {};
		}

		let path = "";

		if (process.env.NODE_ENV == "development") {
			path = this.proxy || baseUrl;
		} else {
			if (this.proxy) {
				path = this.url;
			} else {
				path = baseUrl;
			}
		}

		if (this.namespace) {
			path += "/" + this.namespace;
		}

		if (options.url.indexOf("http") !== 0) {
			if (options.url[0] === "@") {
				options.url = options.url.replace("@", "");
			} else {
				options.url = path + options.url;
			}
		}

		return request(options);
	}

	list(params) {
		return this.request({
			url: "/list",
			method: "POST",
			data: {
				...params
			}
		});
	}

	page(params) {
		return this.request({
			url: "/page",
			method: "POST",
			data: {
				...params
			}
		});
	}

	info(params) {
		return this.request({
			url: "/info",
			params: {
				...params
			}
		});
	}

	update(params) {
		return this.request({
			url: "/update",
			method: "POST",
			data: {
				...params
			}
		});
	}

	delete(params) {
		return this.request({
			url: "/delete",
			method: "POST",
			data: {
				...params
			}
		});
	}

	add(params) {
		return this.request({
			url: "/add",
			method: "POST",
			data: {
				...params
			}
		});
	}
}
