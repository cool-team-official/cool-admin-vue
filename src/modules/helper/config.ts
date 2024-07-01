import type { ModuleConfig } from "/@/cool";
import { getRules } from "./utils";

export default (): ModuleConfig => {
	return {
		options: {
			host: "https://service.cool-js.com/api"
		},
		toolbar: {
			order: 1,
			component: import("./components/auto-menu/btn.vue")
		},
		pages: [
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
