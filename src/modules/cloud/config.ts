import { ModuleConfig } from "/@/cool";
import { CodeDeclare } from "./dict";
import { addDeclare } from "/@/plugins/editor-monaco";

export default (): ModuleConfig => {
	return {
		views: [
			{
				path: "/cloud/func/dev",
				meta: {
					label: "云函数开发"
				},
				component: () => import("./views/func/dev.vue")
			}
		],

		onLoad() {
			addDeclare(CodeDeclare);
		}
	};
};
