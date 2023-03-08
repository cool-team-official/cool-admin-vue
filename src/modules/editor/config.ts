import { ModuleConfig } from "/@/cool";

export default (): ModuleConfig => {
	return {
		// 根据使用情况选择组件注释，避免资源过大问题
		components: [
			// 富文本编辑器 https://www.npmjs.com/package/@wangeditor/editor
			() => import("./components/wang.vue"),
			// 富文本编辑器 https://www.npmjs.com/package/quill
			() => import("./components/quill.vue"),
			// 代码编辑器 https://www.npmjs.com/package/monaco-editor
			() => import("./components/monaco/index.vue"),
			() => import("./components/preview.vue")
		]
	};
};
