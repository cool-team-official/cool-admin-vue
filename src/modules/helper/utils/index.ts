import axios from "axios";
import { module } from "/@/cool";
import { PropRules } from "../dict";
import type { PropRule } from "../types";

// 统一请求
export async function request(options: any): Promise<any> {
	const { host } = module.config("helper");

	return new Promise((resolve, reject) => {
		axios({
			...options,
			url: host + "/api" + options.url
		})
			.then((res) => {
				const { code, data, message } = res.data;

				if (code == 1000) {
					resolve(data);
				} else {
					reject({ message });
				}
			})
			.catch(reject);
	});
}

// 获取匹配规则
export async function getRules() {
	const res = await request({
		url: "/app/base/comm/param",
		params: {
			key: "epsFieldType"
		}
	});

	let eps: { components: PropRule[] };

	eval(`
		${res}
		eps = EPS
	`);

	const arr = eps!.components.map((e) => {
		return {
			...e,
			...e.render
		};
	});

	PropRules.unshift(...arr);
}
