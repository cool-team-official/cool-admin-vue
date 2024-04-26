import { base } from "./base";
import { config } from "./config";
import { demo } from "./demo";
import { virtual } from "./virtual";
import type { Config } from "../types";

export function cool(options: Config.Options) {
	// 应用类型，admin | app
	config.type = options.type;

	// 请求地址
	config.reqUrl = options.proxy["/dev/"].target;

	// Eps
	if (options.eps) {
		const { dist, mapping } = options.eps;

		if (dist) {
			config.eps.dist = dist;
		}

		if (mapping) {
			config.eps.mapping.unshift(...mapping);
		}
	}

	return [base(), virtual(), demo(options.demo)];
}
