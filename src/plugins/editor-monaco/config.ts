import type { ModuleConfig } from "/@/cool";

export default (): ModuleConfig => {
	return {
		label: "代码编辑器",
		description: "基于 monaco 封装的代码编辑器", // https://www.npmjs.com/package/monaco-editor
		author: "COOL",
		version: "1.0.1",
		updateTime: "2024-02-04",
		demo: [
			{
				name: "基础用法",
				component: () => import("./demo/base.vue")
			}
		],

		// 组件依赖过大，如不需求请注释以下代码
		components: [() => import("./components/monaco.vue")]
	};
};
