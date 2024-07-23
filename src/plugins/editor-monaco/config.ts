import { ModuleConfig } from "/@/cool";

export default (): ModuleConfig => {
	return {
		label: "代码编辑器",
		description: "基于 monaco 封装的代码编辑器",
		author: "COOL",
		version: "1.1.0",
		updateTime: "2024-06-01",
		demo: [
			{
				name: "基础用法",
				component: () => import("./demo/base.vue")
			}
		],

		components: [
			// 依赖偏大，现用于“ai编码页面”，如不需要请注释组件
			// 代码编辑器 https://www.npmjs.com/package/monaco-editor
			() => import("./components/monaco.vue")
		]
	};
};
