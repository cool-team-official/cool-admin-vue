import { ModuleConfig } from "/@/cool";

export default (): ModuleConfig => {
	return {
		label: "Excel",
		description: "表格的导入、导出组件",
		author: "COOL",
		version: "1.0.0",
		updateTime: "2024-02-01",
		demo: [
			{
				name: "基础用法",
				component: () => import("./demo/base.vue")
			}
		],

		components: [
			() => import("./components/import-btn.vue"),
			() => import("./components/export-btn")
		]
	};
};
