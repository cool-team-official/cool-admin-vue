import { ModuleConfig } from "/@/cool";

export default (): ModuleConfig => {
	return {
		// 根据使用情况选择组件注释，避免资源过大问题
		components: [
			// 富文本编辑器 https://www.npmjs.com/package/@wangeditor/editor
			() => import("./editor/wang.vue"),
			// 代码编辑器 https://www.npmjs.com/package/monaco-editor
			() => import("./editor/monaco/index.vue"),
			// 文本预览
			() => import("./editor/preview.vue"),
			// 省市区选择 https://github.com/modood/Administrative-divisions-of-China
			() => import("./distpicker/index"),
			// 导入按钮
			() => import("./excel/import-btn.vue"),
			// 导出按钮
			() => import("./excel/export-btn")
		]
	};
};
