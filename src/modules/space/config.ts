import type { ModuleConfig } from "/@/cool";

export default (): ModuleConfig => {
	return {
		components: [
			() => import("./components/space.vue"),
			() => import("./components/space-inner.vue")
		],

		views: [
			{
				meta: {
					label: "文件空间"
				},
				path: "/space/list",
				component: () => import("./views/list.vue")
			}
		]
	};
};
