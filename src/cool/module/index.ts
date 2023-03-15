import { Module } from "../types";
import { hmr } from "../hook";

// 模块列表
const list: Module[] = hmr.getData("modules", []);

const module = {
	list,
	dirs: __MODULE_DIRS__,
	req: Promise.resolve(),
	get(name: string): Module {
		// @ts-ignore
		return this.list.find((e) => e.name == name);
	},
	add(data: Module) {
		this.list.push(data);
	},
	wait() {
		return this.req;
	}
};

export { module };
