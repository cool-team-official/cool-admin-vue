import { isObject } from "../utils";

export function Permission(value) {
	return function (target, key, descriptor) {
		if (!target.permission) {
			target.permission = {};
		}

		setTimeout(() => {
			target.permission[key] = (
				(target.namespace ? target.namespace + "/" : "") + value
			).replace(/\//g, ":");
		}, 0);

		return descriptor;
	};
}

export function Service(value) {
	const { devServer } = require("@/../vue.config.js");

	return function (target) {
		// 命名
		if (typeof value == "string") {
			target.prototype.namespace = value;
		}

		// 复杂项
		if (isObject(value)) {
			let { proxy, namespace, url } = value;

			target.prototype.namespace = namespace;

			if (proxy) {
				target.prototype.proxy = proxy;
				target.prototype.url = url || devServer.proxy[proxy].target;
			}
		}
	};
}
