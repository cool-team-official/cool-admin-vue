import { getCurrentInstance } from "vue";
import { useCore } from "./core";
import { isFunction } from "../utils";

export function useProxy(ctx: any) {
	const { type }: any = getCurrentInstance();
	const { mitt, crud } = useCore();

	// 挂载
	crud[type.name] = ctx;

	// 事件
	mitt.on("crud.proxy", ({ name, data = [], callback }: any) => {
		if (ctx[name]) {
			let d = null;

			if (isFunction(ctx[name])) {
				d = ctx[name](...data);
			} else {
				d = ctx[name];
			}

			if (callback) {
				callback(d);
			}
		}
	});

	return ctx;
}
