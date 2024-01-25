import { ModuleConfig } from "/@/cool";
import { getRules } from "./utils";

export default (): ModuleConfig => {
	return {
		options: {
			host: "https://service.cool-js.com"
		},
		toolbar: {
			order: 1,
			component: import("./components/auto-menu/btn.vue")
		},
		views: [
			{
				path: "/helper/ai-code",
				meta: {
					label: "Ai 极速编码",
					keepAlive: true
				},
				component: () => import("./views/ai-code.vue")
			}
		],
		onLoad() {
			getRules();
		}
	};
};
