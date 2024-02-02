import { ModuleConfig } from "/@/cool";

export default (): ModuleConfig => {
	return {
		label: "视图组件",
		description: "左右侧布局、顶部详情等",
		author: "COOL",
		version: "1.0.0",
		updateTime: "2024-02-01",
		demo: [
			{
				name: "左右侧布局",
				component: () => import("./demo/group.vue")
			},
			{
				name: "顶部详情",
				component: () => import("./demo/head.vue")
			}
		],

		components: [() => import("./components/group.vue"), () => import("./components/head.vue")]
	};
};
