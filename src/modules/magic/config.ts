import { ModuleConfig } from "/@/cool";

export default (): ModuleConfig => {
	return {
		views: [
			{
				path: "/magic/ai-code",
				meta: {
					label: "Ai编码",
					keepAlive: true
				},
				component: () => import("./views/ai-code/index.vue")
			}
		]
	};
};
