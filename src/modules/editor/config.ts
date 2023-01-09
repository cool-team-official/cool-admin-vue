import { ModuleConfig } from "/@/cool";

export default (): ModuleConfig => {
	return {
		// 根据使用情况选择组件，避免资源过大问题
		components: [
			() => import("./components/wang.vue"),
			() => import("./components/quill.vue"),
			() => import("./components/monaco/index.vue")
		]
	};
};
