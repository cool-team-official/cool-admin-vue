import { ModuleConfig } from "/@/cool";

export default (): ModuleConfig => {
	return {
		components: [
			// 代码编辑器 https://www.npmjs.com/package/monaco-editor
			() => import("./components/index.vue")
		]
	};
};
