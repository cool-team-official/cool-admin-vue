import { ModuleConfig } from "/@/cool";

export default (): ModuleConfig => {
	return {
		label: "富文本编辑器",
		description: "基于 wangEditor 封装的富文本编辑器",
		author: "COOL",
		version: "1.0.0",
		updateTime: "2024-02-01",
		demo: [
			{
				name: "基础用法",
				component: () => import("./demo/base.vue")
			}
		],

		components: [() => import("./components/wang.vue")]
	};
};
