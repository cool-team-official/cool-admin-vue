import { base } from "./base";
import { virtual } from "./virtual";
import { demo } from "./demo";

export function cool(test?: boolean) {
	return [
		// 基础
		base(),
		// 虚拟模块
		virtual(),
		// demo 官方示例，代码片段
		demo(test)
	];
}
